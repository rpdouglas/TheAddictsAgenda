import json
import re
import statistics
from pypdf import PdfReader

# --- CONFIGURATION ---
# Global headers to remove (Uppercase only to avoid matching body text)
GLOBAL_NOISE_PATTERNS = [
    r'ALCOHOLICS\s+ANONYMOUS',             
    r'C\s*O\s*N\s*T\s*E\s*N\s*T\s*S',
    r'CHAPTER\s+[IVXLC]+',
    r'^\s*\d+\s*$' # Standalone numbers
]

def clean_title_regex(title):
    """Creates a regex that matches the title even with wide spacing."""
    normalized = title.replace("'", "[’']")
    # Allow whitespace between every character
    char_pattern = r'\s*'.join([re.escape(c) if c.isalnum() else c for c in normalized])
    return char_pattern

def pre_clean_text(text, current_chapter_title):
    """
    Removes noise lines (Page numbers, Headers) *before* processing text flow.
    This prevents "boomer-\n9\nang" issues.
    """
    lines = text.split('\n')
    cleaned_lines = []
    
    # Build specific header regex for this chapter (Uppercase only)
    title_clean = clean_title_regex(current_chapter_title)
    # Matches "BILL'S STORY 10" or "10 BILL'S STORY"
    header_pattern = re.compile(f"({title_clean}\\s*\\d*|\\d+\\s*{title_clean})", re.IGNORECASE)

    for line in lines:
        stripped = line.strip()
        if not stripped: continue

        # 1. Remove Standalone Page Numbers (e.g. "9")
        if re.match(r'^\d+$', stripped):
            continue

        # 2. Remove Global Noise (e.g. "ALCOHOLICS ANONYMOUS")
        is_noise = False
        for pattern in GLOBAL_NOISE_PATTERNS:
            if re.search(pattern, stripped, re.IGNORECASE):
                # If the line is *mostly* noise (short), drop it
                if len(stripped) < 40: 
                    is_noise = True
                    break
        if is_noise: continue

        # 3. Remove Chapter Headers (e.g. "BILL'S STORY 12")
        # We check if the line is just the header
        if header_pattern.search(stripped):
            # If line is short, it's likely just a header. 
            # If long, it might be text containing the title? Unlikely for header style.
            if len(stripped) < 50:
                continue
            
            # If it's a merged header (e.g. "BILL'S STORY 12 text starts here")
            # This is harder, but let's try to strip the header part
            stripped = re.sub(f"{title_clean}\\s*\\d*", "", stripped, flags=re.IGNORECASE).strip()
            if not stripped: continue

        cleaned_lines.append(stripped)

    return "\n".join(cleaned_lines)

def smart_paragraph_reflow(raw_text):
    """
    Uses statistical analysis to detect paragraph breaks based on line lengths.
    """
    # 1. De-hyphenate: "boomer-\nang" -> "boomerang"
    # Since we removed page numbers in pre_clean, this now works safely
    text = re.sub(r'-\n', '', raw_text)
    
    # 2. Merge into single lines
    lines = text.split('\n')
    
    # 3. Calculate Statistics to find "Full Line Width"
    lengths = [len(l) for l in lines if len(l) > 10] # Ignore very short artifacts
    if not lengths: return []
    
    median_len = statistics.median(lengths)
    # Threshold: A line is "short" (paragraph end) if it's less than 85% of median
    # e.g. If median is 75 chars, anything under 63 chars ending in dot is a break.
    short_line_threshold = median_len * 0.85
    
    final_paragraphs = []
    current_para = ""

    for line in lines:
        stripped = line.strip()
        if not stripped: continue
        
        # Append to current buffer
        if current_para:
            current_para += " " + stripped
        else:
            current_para = stripped
        
        # 4. Check for Paragraph End
        # Logic: Line ends in punctuation AND (Line is short OR Line ends in quote)
        # We assume quotes often end paragraphs in dialogue.
        ends_punct = stripped[-1] in ['.', '!', '?', '"', '”']
        is_short = len(stripped) < short_line_threshold
        
        if ends_punct and is_short:
            final_paragraphs.append(current_para)
            current_para = ""
            
    # Flush remaining
    if current_para:
        final_paragraphs.append(current_para)
        
    return final_paragraphs

def paginate_paragraphs(paragraphs, lines_per_page=22):
    """Chunks paragraphs into pages."""
    pages = []
    current_page = []
    current_count = 0
    
    for para in paragraphs:
        cost = max(1, len(para) // 120) 
        if current_count + cost > lines_per_page and current_page:
            pages.append("\n\n".join(current_page))
            current_page = []
            current_count = 0
        current_page.append(para)
        current_count += cost
        
    if current_page: pages.append("\n\n".join(current_page))
    return pages

def parse_big_book_platinum(pdf_path, output_filename):
    print(f"Processing {pdf_path}...")
    reader = PdfReader(pdf_path)
    pages_text = [page.extract_text() for page in reader.pages]

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

    final_chapters = []
    current_buffer = ""
    current_title_index = 0
    start_page_offset = 3 
    
    for i in range(start_page_offset, len(pages_text)):
        page_text = pages_text[i]
        
        if current_title_index + 1 < len(titles):
            next_title = titles[current_title_index + 1]
            title_pattern = clean_title_regex(next_title)
            full_pattern = r'(?:CHAPTER\s+\w+\s*\d*\s*)?' + title_pattern
            
            match = re.search(full_pattern, page_text, re.IGNORECASE | re.MULTILINE)
            
            if match:
                print(f"Found split for '{next_title}' on Page {i+1}")
                split_idx = match.start()
                
                # 1. Finish Previous Chapter
                current_buffer += "\n" + page_text[:split_idx]
                
                prev_title_str = titles[current_title_index].title().replace("’S", "'s")
                
                # --- PIPELINE ---
                # 1. Remove numbers/headers from raw text
                cleaned_raw = pre_clean_text(current_buffer, prev_title_str)
                # 2. Smart Reflow (Fix hyphens, detect paragraphs)
                paras = smart_paragraph_reflow(cleaned_raw)
                
                final_chapters.append({
                    "title": prev_title_str,
                    "content": "\n\n".join(paras),
                    "pages": paginate_paragraphs(paras) 
                })
                
                # 2. Start New Chapter 
                current_buffer = page_text[match.end():]
                current_title_index += 1
                continue

        current_buffer += "\n" + page_text

    # Save Final Chapter
    last_title_str = titles[current_title_index].title().replace("’S", "'s")
    cleaned_raw = pre_clean_text(current_buffer, last_title_str)
    paras = smart_paragraph_reflow(cleaned_raw)
    
    final_chapters.append({
        "title": last_title_str,
        "content": "\n\n".join(paras),
        "pages": paginate_paragraphs(paras)
    })

    # Export
    output_data = {
        "title": "The Big Book (4th Edition)",
        "chapters": final_chapters
    }

    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"Success! Parsed {len(final_chapters)} chapters.")
    print(f"Saved to {output_filename}")

if __name__ == "__main__":
    parse_big_book_platinum("AA-Big-Book-4th-edition.pdf", "src/data/aa_big_book_v4.json")