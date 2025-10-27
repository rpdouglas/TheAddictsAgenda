import fitz  # PyMuPDF
import re
import json
import datetime
import sys

def clean_text(text):
    """Removes common headers, footers, and page numbers."""
    text = re.sub(r"^\d+\s*\n", "", text, flags=re.MULTILINE)  # Page numbers at start of line
    text = re.sub(r"\n\d+\s*$", "", text, flags=re.MULTILINE)  # Page numbers at end of line
    text = re.sub(r"Just For Today\s*\n", "", text)
    text = re.sub(r"Daily Meditations for Recovering Addicts\s*\n", "", text)
    # Remove any extra whitespace
    text = re.sub(r"\n\s*\n", "\n", text)
    return text.strip()

def parse_meditations(all_text):
    """Parses the full text and extracts individual meditations."""
    
    meditations = {}
    
    # Regex to split the text by date. This is the main delimiter.
    # It captures the date string (e.g., "January 1") so we can use it.
    date_regex = r"((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2})"
    
    # Split the entire text into chunks, where each chunk starts with a date
    # The result is like: ['', 'January 1', 'content...', 'January 2', 'content...']
    entries = re.split(date_regex, all_text)
    
    print(f"Found { (len(entries) - 1) // 2 } potential date entries. Starting parsing loop...")
    
    if len(entries) < 3:
        print("Error: Could not find any date-based entries. Check PDF content.")
        return {}

    # Iterate over the split entries, taking 2 at a time (date, content)
    # We skip the first item, which is usually empty text before the first date
    for i in range(1, len(entries), 2):
        if i + 1 >= len(entries):
            continue  # Avoid index error on the last iteration
            
        date_str = entries[i].strip()
        content_str = entries[i+1].strip()
        
        # Clean up the specific content block
        content_str = clean_text(content_str)
        
        try:
            # 1. Extract Title
            # The title is the first line of the content
            title_end = content_str.index('\n')
            title = content_str[:title_end].strip()
            rest_of_content = content_str[title_end:].strip()
            
            # 2. Extract Quote and Source
            # Looks for "quote" \n Source \n
            quote_match = re.search(r'"(.*?)"\s*\n(.*?)\n', rest_of_content, re.DOTALL)
            if not quote_match:
                print(f"Warning: Skipping {date_str} - could not find quote/source.")
                continue
                
            quote = quote_match.group(1).replace('\n', ' ').strip()
            source = quote_match.group(2).strip()
            
            # 3. Extract Affirmation
            # The affirmation is the last part, starting with "Just for today:"
            affirmation_match = re.search(r"(Just for today:.*)", rest_of_content, re.DOTALL | re.IGNORECASE)
            if not affirmation_match:
                print(f"Warning: Skipping {date_str} - could not find affirmation.")
                continue
                
            affirmation = affirmation_match.group(1).strip()
            
            # 4. Extract Body
            # The body is everything between the source and the affirmation
            body_start_index = quote_match.end()
            body_end_index = affirmation_match.start()
            
            body = rest_of_content[body_start_index:body_end_index].strip()
            
            # 5. Format the date key as MM-DD
            # We add a dummy year (2000) because it's a leap year,
            # which handles February 29th if it exists in the book.
            try:
                date_obj = datetime.datetime.strptime(f"{date_str} 2000", "%B %d %Y")
                json_key = date_obj.strftime("%m-%d")
            except ValueError:
                # Handle non-date entries like 'Preface' if they got caught
                print(f"Skipping non-date entry: {date_str}")
                continue

            # 6. Add to our dictionary
            meditations[json_key] = {
                "date": date_str,  # e.g., "January 1"
                "title": title,
                "quote": quote,
                "source": source,
                "body": body,
                "affirmation": affirmation
            }
            print(f"Successfully processed: {date_str} ({json_key})")

        except Exception as e:
            print(f"Error parsing entry for {date_str}: {e}")
            print(f"--- Content dump: ---\n{content_str[:200]}...\n---")

    return meditations

def main():
    # --- Configuration ---
    # Update this to the path of your PDF file
    pdf_path = "justfortoday_med_book_copy.pdf"
    # The name of the output JSON file
    json_path = "just_for_today_meditations.json"
    # --- End Configuration ---

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening PDF file '{pdf_path}': {e}")
        print("Please make sure the file is in the same directory as the script,")
        print("or update the 'pdf_path' variable in the script.")
        sys.exit(1)

    print(f"Opening PDF: {pdf_path}...")
    all_text = ""
    
    # Extract text from all pages and concatenate
    total_pages = len(doc)
    print(f"Found {total_pages} pages. Extracting text...")
    for page_num in range(total_pages):
        # Add a status update every 25 pages or on the last page
        if (page_num + 1) % 25 == 0 or (page_num + 1) == total_pages:
            print(f"  ...processing page {page_num + 1} of {total_pages}")
        page = doc.load_page(page_num)
        all_text += page.get_text()
        
    doc.close()
    
    print("PDF text extracted. Starting parsing...")
    
    # Parse the concatenated text
    meditations_data = parse_meditations(all_text)
    
    if not meditations_data:
        print("No meditation data was extracted.")
        return

    # Save the data to a JSON file
    print(f"\nParsing complete. Saving {len(meditations_data)} entries to {json_path}...")
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(meditations_data, f, indent=4, ensure_ascii=False)
        
        print(f"Successfully saved {len(meditations_data)} meditations.")
        
    except Exception as e:
        print(f"Error writing JSON file: {e}")

if __name__ == "__main__":
    print("--- Just For Today PDF Extractor ---")
    print("This script requires the 'PyMuPDF' library.")
    print("Install it with: pip install PyMuPDF\n")
    main()