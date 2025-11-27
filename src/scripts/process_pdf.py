import json
import re
import sys
from pypdf import PdfReader # Run: pip install pypdf

def parse_big_book(pdf_path, output_filename):
    print(f"Processing {pdf_path}...")
    reader = PdfReader(pdf_path)
    pages_text = [page.extract_text() for page in reader.pages]

    # List of Chapter Titles to search for (Order matters for sorting)
    titles = [
        "FOREWORD", "THE DOCTOR’S OPINION", "BILL’S STORY", "THERE IS A SOLUTION", 
        "MORE ABOUT ALCOHOLISM", "WE AGNOSTICS", "HOW IT WORKS", "INTO ACTION", 
        "WORKING WITH OTHERS", "TO WIVES", "THE FAMILY AFTERWARD", "TO EMPLOYERS", 
        "A VISION FOR YOU", "THE DOCTOR’S NIGHTMARE", "THE UNBELIEVER", 
        "THE EUROPEAN DRINKER", "A FEMININE VICTORY", "OUR SOUTHERN FRIEND", 
        "A BUSINESS MAN’S RECOVERY", "A DIFFERENT SLANT", "TRAVELER, EDITOR, SCHOLAR", 
        "THE BACK-SLIDER", "HOME BREWMEISTER", "THE SEVENTH MONTH SLIP", 
        "MY WIFE AND I", "A WARD OF THE PROBATE COURT", "RIDING THE RODS", 
        "THE SALESMAN", "FIRED AGAIN", "THE FEARFUL ONE", "TRUTH FREED ME!", 
        "SMILE WITH ME, AT ME", "A CLOSE SHAVE", "EDUCATED AGNOSTIC", 
        "ANOTHER PRODIGAL STORY", "THE CAR SMASHER", "HINDSIGHT", "ON HIS WAY", 
        "AN ALCOHOLIC’S WIFE", "AN ARTIST’S CONCEPT", "THE ROLLING STONE", 
        "LONE ENDEAVOR", "ACE FULL SEVEN-ELEVEN"
    ]

    chapter_indices = {}

    # 1. Find start pages for each chapter
    for i, text in enumerate(pages_text):
        # Normalize text (uppercase, remove non-letters) to find headers roughly
        page_norm = re.sub(r'[^A-Z]', '', text[:800].upper())
        
        for t in titles:
            if t in chapter_indices: continue # Already found
            
            t_norm = re.sub(r'[^A-Z]', '', t.upper())
            if t_norm in page_norm:
                # Filter out TOC hits (usually on early pages)
                if i < 5 and "CONTENTS" in text: continue
                chapter_indices[t] = i

    # 2. Create Sorted List
    sorted_titles = sorted(chapter_indices.items(), key=lambda x: x[1])
    
    final_chapters = []
    
    for idx, (title, start) in enumerate(sorted_titles):
        # Determine end of this chapter (start of next, or end of book)
        if idx + 1 < len(sorted_titles):
            end = sorted_titles[idx+1][1]
        else:
            end = len(pages_text)
            
        # Extract pages
        if end <= start: end = start + 1
        chapter_pages = pages_text[start:end]
        
        # Format Title (Title Case)
        display_title = title.title().replace("’S", "'s") 

        final_chapters.append({
            "title": display_title,
            "content": "\n\n".join(chapter_pages),
            "pages": chapter_pages
        })

    # 3. Save to JSON
    output_data = {
        "title": "The Big Book (4th Edition)",
        "chapters": final_chapters
    }

    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"Success! Parsed {len(final_chapters)} chapters.")
    print(f"Saved to {output_filename}")

if __name__ == "__main__":
    # Default paths
    pdf_input = "AA-Big-Book-4th-edition.pdf" # Make sure this file is in the root or update path
    json_output = "src/data/aa_big_book_v4.json"
    parse_big_book(pdf_input, json_output)