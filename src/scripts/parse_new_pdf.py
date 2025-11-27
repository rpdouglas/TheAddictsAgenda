import json
import re
from pypdf import PdfReader

def clean_text_block(text):
    """
    Removes headers/footers and fixes hyphenation for the 'Big Book' PDF.
    """
    lines = text.split('\n')
    cleaned_lines = []
    
    # Patterns to strip from text (e.g. "14 ALCOHOLICS ANONYMOUS")
    NOISE_PATTERNS = [
        r'^\d+\s+ALCOHOLICS\s+ANONYMOUS',
        r'^ALCOHOLICS\s+ANONYMOUS\s+\d+',
        r'^\d+\s+[A-Z\s’\']+$',  # Page Number + UPPERCASE TITLE (e.g. "2 BILL'S STORY")
        r'^[A-Z\s’\']+\s+\d+$',  # UPPERCASE TITLE + Page Number
        r'^\s*\d+\s*$',          # Standalone Page Numbers
        r'^Chapter\s+\d+$'       # "Chapter 1"
    ]
    
    for line in lines:
        stripped = line.strip()
        if not stripped: continue
        
        is_noise = False
        for pattern in NOISE_PATTERNS:
            if re.match(pattern, stripped):
                is_noise = True
                break
        
        if is_noise: continue
        cleaned_lines.append(stripped)
        
    text = "\n".join(cleaned_lines)
    
    # Fix Hyphenation: "impor-\ntant" -> "important"
    text = re.sub(r'-\n', '', text)
    
    # Fix Paragraphs:
    # Heuristic: Sentence end (.) followed by newline and Capital Letter = New Para
    # Otherwise, join lines with space.
    text = re.sub(r'([\.!?])\n([A-Z])', r'\1\n\n\2', text)
    
    # Merge remaining broken lines (e.g. mid-sentence newlines)
    # If line ends in lowercase/comma and next starts with lowercase -> merge
    text = re.sub(r'(?<!\n)\n(?=[a-z])', ' ', text)
    
    return text

def parse_new_pdf_map(pdf_path, output_filename):
    print(f"Processing {pdf_path}...")
    reader = PdfReader(pdf_path)
    all_pages = [page.extract_text() for page in reader.pages]
    
    # MAP: Defined from my analysis of your file
    # (Title, Start Page Index)
    chapter_map = [
        ("The Doctor's Opinion", 4),
        ("Bill's Story", 24),
        ("There Is A Solution", 40),
        ("More About Alcoholism", 53),
        ("We Agnostics", 67),
        ("How It Works", 81),
        ("Into Action", 95),
        ("Working With Others", 112),
        ("To Wives", 127),
        ("The Family Afterward", 145),
        ("To Employers", 159),
        ("A Vision For You", 174)
    ]
    
    final_chapters = []
    
    for i, (title, start_idx) in enumerate(chapter_map):
        # Determine End Index
        if i + 1 < len(chapter_map):
            end_idx = chapter_map[i+1][1]
        else:
            end_idx = 183 # "Doctor's Nightmare" starts here (end of basic text)
            
        # Extract Raw Text
        raw_text = "\n".join(all_pages[start_idx:end_idx])
        
        # Clean it
        clean_content = clean_text_block(raw_text)
        
        # Create "Pages" for UI (chunks of ~2500 chars)
        ui_pages = [clean_content[i:i+2500] for i in range(0, len(clean_content), 2500)]
        
        final_chapters.append({
            "title": title,
            "content": clean_content,
            "pages": ui_pages
        })
        print(f"Parsed '{title}' ({len(ui_pages)} pages)")

    # Save
    output_data = {
        "title": "The Big Book (4th Edition)",
        "chapters": final_chapters
    }
    
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Saved to {output_filename}")

if __name__ == "__main__":
    # Use the NEW PDF file
    parse_new_pdf_map("Big-Book-of-Alcoholics-Anonymous.pdf", "src/data/aa_big_book_v4.json")