import fitz  # PyMuPDF
import json
import re
import sys
import time

def extract_reflections_to_json(pdf_path, json_path):
    """
    Extracts daily reflections with a corrected and more robust parsing engine.
    """
    print("🚀 Starting the extraction process...")
    time.sleep(1)

    # --- Step 1: Reading and Parsing PDF ---
    print("\n[Step 1/4] Reading and extracting text from PDF file...")
    try:
        doc = fitz.open(pdf_path)
        full_text = "".join([page.get_text() for page in doc])
        doc.close()
        print("✅ PDF read successfully.")
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")
        return

    # --- Step 2: Cleaning Text ---
    print("\n[Step 2/4] Pre-processing and cleaning text...")
    # Clean page markers and extra newlines
    full_text = re.sub(r'---\s*PAGE\s*\d+\s*---', '', full_text)
    full_text = re.sub(r'\n{3,}', '\n\n', full_text)
    
    # Strip leading/trailing whitespace from every line to fix formatting issues
    lines = full_text.split('\n')
    cleaned_lines = [line.strip() for line in lines]
    full_text = "\n".join(cleaned_lines)
    
    print("✅ Text cleaned, including removal of trailing spaces from each line.")
    
    # --- Step 3: Finding and Processing Entries ---
    print("\n[Step 3/4] Scanning text to find and process all daily reflections...")

    # A more robust regex to capture all parts of an entry cleanly.
    # It captures 5 groups: Month, Day, Title, Quote, and Reflection.
    entry_pattern = re.compile(
        r"^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+(\d{1,2})\n" # Groups 1 & 2: Date
        r"(.+?)\n" # Group 3: Title
        r"([\s\S]+?(?:ALCOHOLICS ANONYMOUS, p\. \d+|AS BILL SEES IT, p\. \d+|TWELVE STEPS AND TWELVE TRADITIONS, p\. \d+))\n" # Group 4: The full quote block
        r"([\s\S]+?)" # Group 5: The reflection block
        r"(?=\n(?:JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+\d{1,2}|$)", # End condition
        re.MULTILINE
    )
    
    matches = list(entry_pattern.finditer(full_text))
    total_entries = len(matches)

    if total_entries == 0:
        print("\n❌ CRITICAL FAILURE: No entries were found. The PDF structure may be unusual.")
        # You can save the cleaned text to a file for inspection if needed.
        # with open('debug_cleaned_text.txt', 'w', encoding='utf-8') as f: f.write(full_text)
        return

    print(f"✅ Found {total_entries} potential entries. Now structuring the data...")
    reflections = {}
    
    for i, match in enumerate(matches):
        progress = i + 1
        groups = match.groups()
        
        month, day, title, quote, reflection = groups
        
        date_key = f"{month.strip()} {day.strip()}"
        
        reflections[date_key] = {
            # Replace any lingering newlines with spaces for clean JSON output
            "title": " ".join(title.strip().split()),
            "quote": " ".join(quote.strip().splitlines()),
            "reflection": " ".join(reflection.strip().splitlines()),
        }
        
        status_line = f"➡️  Processing: {progress}/{total_entries} | Found: '{date_key}'"
        print(status_line.ljust(80), end='\r')
        sys.stdout.flush()

    print(f"\n✅ All {len(reflections)} entries processed.")
    
    # --- Step 4: Writing to JSON ---
    print(f"\n[Step 4/4] Writing structured entries to {json_path}...")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(reflections, f, indent=2, ensure_ascii=False)
    print("✅ JSON file created successfully.")
    print("\n🎉 Process complete!")


# --- Run the script ---
pdf_file = 'AA-Daily-Reflections_copy.pdf'
json_file = 'daily_reflections.json'
extract_reflections_to_json(pdf_file, json_file)