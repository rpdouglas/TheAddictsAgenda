import pdfplumber
import re
import json
import sys

def parse_pdf_to_chapters(pdf_path: str, output_json_path: str):
    """
    Parses the "AA-Big-Book-4th-edition.pdf" into its distinct chapters
    and stories based on the table of contents.

    Args:
        pdf_path (str): The file path to the "AA-Big-Book-4th-edition.pdf".
        output_json_path (str): The file path for the output JSON.
    """
    
    # This list is derived from the "CONTENTS" page of your specific PDF.
    # It's used to find the exact start of each section.
    chapter_titles = [
        "Foreword", "The Doctor's Opinion", "Bill's Story", "There Is A Solution",
        "More About Alcoholism", "We Agnostics", "How It Works", "Into Action",
        "Working With Others", "To Wives", "The Family Afterward", "To Employers",
        "A Vision For You", "The Doctor's Nightmare", "The Unbeliever",
        "The European Drinker", "A Feminine Victory", "Our Southern Friend",
        "A Business Man's Recovery", "A Different Slant", "Traveler, Editor, Scholar",
        "The Back-Slider", "Home Brewmeister", "The Seventh Month Slip",
        "My Wife And I", "A Ward Of The Probate Court", "Riding The Rods",
        "The Salesman", "Fired Again", "The Fearful One", "Truth Freed Me!",
        "Smile with Me, At Me", "A Close Shave", "Educated Agnostic",
        "Another Prodigal Story", "The Car Smasher", "Hindsight", "On His Way",
        "An Alcoholic's Wife", "An Artist's Concept", "The Rolling Stone",
        "Lone Endeavor", "Ace Full Seven-Eleven"
    ]

    print(f"Opening PDF: {pdf_path}")
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            all_text = ""
            for page in pdf.pages:
                page_text = page.extract_text(x_tolerance=1)
                if page_text:
                    all_text += page_text + "\n"
            
            # --- This regex is built specifically from the chapter_titles list ---
            # It looks for any of the titles in ALL CAPS at the start of a line.
            
            # 1. Convert titles to uppercase and escape any regex special chars
            titles_upper_escaped = [re.escape(t.upper()) for t in chapter_titles]
            
            # 2. Create a regex pattern: ^\s*(TITLE 1|TITLE 2|TITLE 3...)\s*?$
            # This will match the chapter title line itself
            pattern_string = r'^\s*(' + '|'.join(titles_upper_escaped) + r')\s*?$'
            chapter_pattern = re.compile(pattern_string, re.MULTILINE)

            # Split the entire text based on the chapter titles
            potential_chapters = chapter_pattern.split(all_text)
            
            # Find all the titles that matched the pattern
            chapter_titles_found = chapter_pattern.findall(all_text)

            chapters = []
            
            # The first element (potential_chapters[0]) is everything before the first
            # matched title (i.e., the PDF title page and the CONTENTS page).
            if potential_chapters[0].strip():
                chapters.append({
                    "title": "Title Page and Contents",
                    "content": potential_chapters[0].strip()
                })

            # Match titles with their content
            if len(chapter_titles_found) == len(potential_chapters) - 1:
                print(f"Found {len(chapter_titles_found)} sections. Processing...")
                for i in range(len(chapter_titles_found)):
                    # .title() case makes "BILL'S STORY" into "Bill's Story"
                    title = chapter_titles_found[i].strip().title()
                    
                    # The content is the text *after* the title,
                    # until the *next* title.
                    content = potential_chapters[i + 1].strip()
                    
                    # The "Chapter One 10" etc. part is *in* the content
                    # of the previous chapter. We'll clean it up.
                    # This also cleans up page numbers from stories.
                    
                    # Clean up "Chapter X" headers from previous content block if they exist
                    if i > 0:
                        last_content = chapters[-1]["content"]
                        chapter_header_match = re.search(r'^\s*Chapter (One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven)\s+\d+\s*$', content, re.IGNORECASE | re.MULTILINE)
                        if chapter_header_match:
                            # Remove the "Chapter One 10" line from the *start* of this content
                            content = content.replace(chapter_header_match.group(0), "").strip()

                    # Clean up "PERSONAL STORIES 183" header
                    personal_story_header = re.search(r'^\s*PERSONAL STORIES\s+\d+\s*$', content, re.IGNORECASE | re.MULTILINE)
                    if personal_story_header:
                        content = content.replace(personal_story_header.group(0), "").strip()
                    
                    # Clean up page numbers that sometimes get stuck to titles
                    content = re.sub(r'^\d+\s*ALCOHOLICS ANONYMOUS\s*', '', content, flags=re.MULTILINE)
                    content = re.sub(r'^\s*\d+\s*$', '', content, flags=re.MULTILINE).strip()


                    chapters.append({
                        "title": title,
                        "content": content
                    })
            else:
                print("Warning: Mismatch between found titles and content blocks.")
                print(f"Titles found: {len(chapter_titles_found)}")
                print(f"Content blocks found: {len(potential_chapters)}")
                # Fallback: Just save what we can
                for i, title in enumerate(chapter_titles_found):
                    if (i + 1) < len(potential_chapters):
                        chapters.append({
                            "title": title.strip().title(),
                            "content": potential_chapters[i + 1].strip()
                        })

            if not chapters:
                print("No chapters were found based on the pattern.")
                print("Using full text as a fallback.")
                chapters.append({
                    "title": "Full Text",
                    "content": all_text.strip()
                })

            # Write the structured data to a JSON file
            with open(output_json_path, 'w', encoding='utf-8') as f:
                json.dump(chapters, f, indent=4, ensure_ascii=False)
            
            print(f"Successfully parsed {len(chapters)} sections.")
            print(f"Output saved to: {output_json_path}")

    except FileNotFoundError:
        print(f"Error: The file '{pdf_path}' was not found.")
        print("Please make sure the file is in the same directory as the script,")
        print("or provide the full file path.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    # Check if command-line arguments are provided
    if len(sys.argv) == 3:
        # Use arguments if provided
        input_pdf = sys.argv[1]
        output_json = sys.argv[2]
        print(f"Using provided file paths:")
        print(f"Input PDF: {input_pdf}")
        print(f"Output JSON: {output_json}")
    else:
        # Use default names if no arguments are given
        print("No file paths provided. Using default filenames.")
        print("Usage: python parse_aa_book.py <input_pdf_path> <output_json_path>")
        print("-" * 30)
        input_pdf = "AA-Big-Book-4th-edition.pdf"
        output_json = "aa_big_book_chapters.json"
        print(f"Default Input PDF: {input_pdf}")
        print(f"Default Output JSON: {output_json}")
        print("-" * 30)


    parse_pdf_to_chapters(input_pdf, output_json)
