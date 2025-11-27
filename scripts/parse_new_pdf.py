import json
import re
import sys
from pypdf import PdfReader

# --- CONFIGURATION ---
MAX_PAGE_LENGTH = 2500

def normalize_spacing(text):
    """
    Final polish to fix 'Justified Text' artifacts.
    1. Collapses multiple spaces: "But  we  saw" -> "But we saw"
    2. Removes space before punctuation: "consummation ." -> "consummation."
    """
    # 1. Collapse all whitespace sequences to a single space
    text = re.sub(r'[ \t]+', ' ', text)
    
    # 2. Fix space before punctuation ( . , : ; ! ? )
    # Matches: "word ." -> "word."
    text = re.sub(r'\s+([.,:;!?])', r'\1', text)
    
    # 3. Ensure proper spacing AFTER punctuation (if missing)
    # Matches: "word.Next" -> "word. Next"
    # We only do this for lowercase-dot-Uppercase patterns to avoid breaking acronyms like U.S.A.
    text = re.sub(r'([a-z][.!?:])([A-Z])', r'\1 \2', text)
    
    return text

def repair_broken_words(text):
    """
    Fixes words split by hyphens/spaces and handles ligatures.
    """
    # 1. Fix Ligatures
    text = text.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('ﬀ', 'ff')
    
    # 2. Fix Hyphenated Line Breaks (Soft Hyphens)
    # "impor- tant" or "impor-\ntant" -> "important"
    # CAUTION: This also merges "self- seeking" -> "selfseeking". 
    # Ideally we'd check a dictionary, but merging is safer for readability than splitting.
    text = re.sub(r'([a-zA-Z])[-­\u00ad]\s+([a-zA-Z])', r'\1\2', text)
    
    return text

def fix_drop_cap_and_headers(text, chapter_title):
    """Cleans up Start-of-Chapter artifacts."""
    clean_title = chapter_title.upper().replace("'", "[’']")
    title_regex = r'\s*'.join([re.escape(c) if c.isalnum() else c for c in clean_title])
    
    header_zone = text[:1000]
    rest = text[1000:]
    
    header_zone = re.sub(r'^\s*Chapter\s+(\d+|[a-zA-Z]+)\s*', '', header_zone, flags=re.IGNORECASE | re.MULTILINE)
    header_zone = re.sub(r'^\s*' + title_regex + r'\s*', '', header_zone, flags=re.IGNORECASE | re.MULTILINE)
    header_zone = re.sub(r'^\s*ALCOHOLICS\s+ANONYMOUS\s*', '', header_zone, flags=re.IGNORECASE | re.MULTILINE)
    
    text = header_zone + rest
    text = re.sub(r'^\s*([A-Z])\s+([a-z])', r'\1\2', text, count=1, flags=re.MULTILINE)
    return text

def clean_text_block(text, chapter_title):
    """Main cleaning pipeline."""
    
    # 1. Fix Drop Caps & Headers
    text = fix_drop_cap_and_headers(text, chapter_title)
    
    # 2. Repair Broken Words
    text = repair_broken_words(text)

    lines = text.split('\n')
    filtered_lines = []
    
    NOISE_PATTERNS = [
        r'^\d+\s+ALCOHOLICS\s+ANONYMOUS',
        r'^ALCOHOLICS\s+ANONYMOUS\s+\d+',
        r'^\d+\s+[A-Z\s’\']+$',  
        r'^[A-Z\s’\']+\s+\d+$',  
        r'^\s*\d+\s*$',          
        r'^Chapter\s+\d+$',      
        r'^CONTENTS$'            
    ]
    
    for line in lines:
        stripped = line.strip()
        if not stripped: continue
        
        is_noise = False
        for pattern in NOISE_PATTERNS:
            if re.match(pattern, stripped, re.IGNORECASE):
                is_noise = True
                break
        
        if is_noise and stripped.upper() != chapter_title.upper(): 
            continue
            
        filtered_lines.append(stripped)

    # 3. Reflow Paragraphs
    final_paragraphs = []
    current_para = ""
    
    for line in filtered_lines:
        if current_para:
            prev_line_end = current_para[-1]
            if prev_line_end in ['.', '!', '?', '”', '"']:
                final_paragraphs.append(current_para)
                current_para = line
            else:
                current_para += " " + line
        else:
            current_para = line
            
    if current_para:
        final_paragraphs.append(current_para)
    
    # 4. JOIN & NORMALIZE SPACING (The New Fix)
    full_text = "\n\n".join(final_paragraphs)
    full_text = normalize_spacing(full_text)
    
    return full_text

def paginate_smart(clean_text, max_chars=MAX_PAGE_LENGTH):
    paragraphs = clean_text.split('\n\n')
    pages = []
    current_page = []
    current_length = 0
    
    for para in paragraphs:
        para = para.strip()
        if not para: continue
        
        if current_length + len(para) > max_chars and current_page:
            pages.append("\n\n".join(current_page))
            current_page = []
            current_length = 0
            
        current_page.append(para)
        current_length += len(para)
        
    if current_page:
        pages.append("\n\n".join(current_page))
        
    return pages

def parse_new_pdf_map(pdf_path, output_filename):
    print(f"--- Starting PDF Processing ---")
    print(f"Source: {pdf_path}")
    
    try:
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
        print(f"PDF Loaded: Structure ready ({total_pages} pages).")
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return

    chapter_map = [
        ("Preface", 4),
        ("Foreword to First Edition", 6),
        ("Foreword to Second Edition", 7),
        ("Foreword to Third Edition", 13),
        ("Foreword to Fourth Edition", 14),
        ("The Doctor's Opinion", 16),
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
    total_chapters = len(chapter_map)
    
    print(f"\n--- Extracting & Cleaning Chapters ---")
    
    for i, (title, start_idx) in enumerate(chapter_map):
        print(f"[{i+1}/{total_chapters}] {title}...", end=" ", flush=True)
        
        if i + 1 < len(chapter_map):
            end_idx = chapter_map[i+1][1]
        else:
            end_idx = 183 
            
        chapter_pages_text = []
        for p_idx in range(start_idx, end_idx):
            if p_idx < total_pages:
                chapter_pages_text.append(reader.pages[p_idx].extract_text())
        
        raw_text = "\n".join(chapter_pages_text)
        
        clean_content = clean_text_block(raw_text, title)
        ui_pages = paginate_smart(clean_content)
        
        final_chapters.append({
            "title": title,
            "content": clean_content,
            "pages": ui_pages
        })
        
        print(f"Done ({len(ui_pages)} pgs)")

    output_data = {
        "title": "The Big Book (4th Edition)",
        "chapters": final_chapters
    }
    
    print(f"\n--- Saving JSON ---")
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Success! Saved to: {output_filename}")

if __name__ == "__main__":
    parse_new_pdf_map("Big-Book-of-Alcoholics-Anonymous.pdf", "src/data/aa_big_book_v4.json")