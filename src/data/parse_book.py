import fitz  # PyMuPDF
import json
import re
import os

def clean_chapter_content(text: str) -> str:
    """Cleans the extracted raw text of a chapter."""
    # Remove page headers/footers like "152 ALCOHOLICS ANONYMOUS" or chapter titles with page numbers
    cleaned_text = re.sub(r'^\d+\s+ALCOHOLICS\s+ANONYMOUS\s*$', '', text, flags=re.MULTILINE | re.IGNORECASE)
    cleaned_text = re.sub(r'^[A-Z\s]+?\s+\d+\s*$', '', cleaned_text, flags=re.MULTILINE)
    
    # Re-join lines that were broken mid-sentence (common in PDFs)
    cleaned_text = re.sub(r'([a-z,;])\n([a-z])', r'\1 \2', cleaned_text)

    # Normalize whitespace
    lines = [line.strip() for line in cleaned_text.strip().split('\n')]
    cleaned_text = "\n".join(lines)
    
    # Replace multiple newlines with a double newline for paragraph breaks
    cleaned_text = re.sub(r'\n{2,}', '\n\n', cleaned_text).strip()
    
    return cleaned_text

def parse_aa_big_book_v2(pdf_path: str, json_template_path: str, output_path: str):
    """
    Parses the AA Big Book PDF to extract full chapter content and populate a JSON structure.
    This version uses a more robust method to locate chapter start/end points.

    Args:
        pdf_path (str): Path to the input PDF file.
        json_template_path (str): Path to the JSON structure template.
        output_path (str): Path to save the populated JSON file.
    """
    if not os.path.exists(pdf_path) or not os.path.exists(json_template_path):
        print("Error: Input PDF or JSON file not found.")
        return

    try:
        doc = fitz.open(pdf_path)
        full_text = "\n".join(page.get_text() for page in doc)
        doc.close()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return

    with open(json_template_path, 'r') as f:
        data_structure = json.load(f)

    # A more comprehensive list of chapter titles to identify boundaries
    all_chapter_titles = [
        "THE DOCTOR'S OPINION", "BILL'S STORY", "THERE IS A SOLUTION", 
        "MORE ABOUT ALCOHOLISM", "WE AGNOSTICS", "HOW IT WORKS", "INTO ACTION", 
        "WORKING WITH OTHERS", "TO WIVES", "THE FAMILY AFTERWARD", "TO EMPLOYERS", 
        "A VISION FOR YOU", "THE DOCTOR'S NIGHTMARE", "PERSONAL STORIES"
    ]

    # Map the JSON title to the actual text markers in the PDF
    target_chapters = {
        "The Doctor's Opinion": "THE DOCTOR'S OPINION",
        "Chapter 1: Bill's Story": "BILL'S STORY",
        "Chapter 5: How It Works": "HOW IT WORKS"
    }

    for chapter_info in data_structure["chapters"]:
        json_title = chapter_info.get("title")
        if json_title in target_chapters:
            start_marker = target_chapters[json_title]
            
            # Use a more specific regex to find the actual chapter heading, not a mention in the TOC.
            # Looks for the title in all caps, at the start of a line, followed by a newline.
            start_regex = re.compile(f"^{re.escape(start_marker)}\s*$", re.MULTILINE | re.IGNORECASE)
            start_match = start_regex.search(full_text)

            if not start_match:
                chapter_info["content"] = f"Content for '{json_title}' could not be found."
                continue

            start_index = start_match.end()
            end_index = len(full_text) # Default to end of book if no next chapter is found

            # Find the start of the *next* chapter to define the end of the current one
            for next_title in all_chapter_titles:
                if next_title.upper() == start_marker.upper():
                    continue
                
                next_regex = re.compile(f"^{re.escape(next_title)}\s*$", re.MULTILINE | re.IGNORECASE)
                next_match = next_regex.search(full_text, pos=start_index)
                
                if next_match and next_match.start() < end_index:
                    end_index = next_match.start()

            # Extract and clean the content
            raw_content = full_text[start_index:end_index]
            chapter_info["content"] = clean_chapter_content(raw_content)

    try:
        with open(output_path, 'w') as f:
            json.dump(data_structure, f, indent=2)
        print(f"✅ Successfully parsed PDF. The corrected data is in '{output_path}'")
    except Exception as e:
        print(f"Error writing to JSON file: {e}")

if __name__ == '__main__':
    try:
        import fitz
    except ImportError:
        print("PyMuPDF is not installed. Please install it to run this script:")
        print("pip install PyMuPDF")
    else:
        parse_aa_big_book_v2(
            pdf_path="AA-Big-Book-4th-edition.pdf",
            json_template_path="aa_big_book.json",
            output_path="aa_big_book_populated.json"
        )