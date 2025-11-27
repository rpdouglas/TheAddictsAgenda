import json
import re
import sys
from pypdf import PdfReader

# --- CONFIGURATION ---
MAX_PAGE_LENGTH = 2500

# --- DATA: STORY MANIFEST ---
STORY_MANIFEST = [
    "Doctor Bob's Nightmare",
    "Alcoholics Anonymous Number Three",
    "Gratitude in Action",
    "Women Suffer Too",
    "Our Southern Friend",
    "The Vicious Cycle",
    "Jim's Story",
    "The Man Who Mastered Fear",
    "He Sold Himself Short",
    "The Keys of the Kingdom",
    "The Missing Link",
    "Fear of Fear",
    "The Housewife Who Drank at Home",
    "Physician, Heal Thyself!",
    "My Chance to Live",
    "Student of Life",
    "Crossing the River of Denial",
    "Because I'm an Alcoholic",
    "It Might Have Been Worse",
    "Tightrope",
    "Flooded with Feeling",
    "Winner Takes All",
    "Me an Alcoholic?",
    "The Perpetual Quest",
    "A Drunk, Like You",
    "Acceptance Was the Answer",
    "Window of Opportunity",
    "My Bottle, My Resentments, and Me",
    "He Lived Only to Drink",
    "Safe Haven",
    "Listening to the Wind",
    "Twice Gifted",
    "Building a New Life",
    "On the Move",
    "A Vision of Recovery",
    "Gutter Bravado",
    "Empty on the Inside",
    "Grounded",
    "Another Chance",
    "A Late Start",
    "Freedom From Bondage",
    "A.A. Taught Him to Handle Sobriety"
]

def clean_title_regex(title):
    """Creates a flexible regex for titles."""
    normalized = title.replace("'", "[’']")
    normalized = normalized.replace("A.A.", "A\.?A\.?")
    char_pattern = r'\s*'.join([re.escape(c) if c.isalnum() else c for c in normalized])
    char_pattern = char_pattern.replace(r'\\', '\\') 
    return char_pattern

def find_story_map(reader, start_page_index):
    """Scans PDF to find start pages for stories."""
    print(f"\n--- Scanning for {len(STORY_MANIFEST)} Stories ---")
    story_map = []
    current_search_idx = start_page_index
    total_pages = len(reader.pages)
    
    for title in STORY_MANIFEST:
        found = False
        title_pattern = clean_title_regex(title)
        regex = re.compile(title_pattern, re.IGNORECASE)
        look_ahead_limit = 50 
        
        for i in range(current_search_idx, min(current_search_idx + look_ahead_limit, total_pages)):
            text = reader.pages[i].extract_text()
            if regex.search(text[:1000]):
                print(f"Found '{title}' at Index {i}")
                story_map.append((title, i))
                current_search_idx = i + 1
                found = True
                break
        if not found:
            print(f"⚠️ WARNING: Could not find '{title}'")
    return story_map

def nuke_story_headers(text, chapter_title):
    """
    Removes specific header patterns found in stories.
    Matches: "233 JIM'S STORY 233 ALCOHOLICS ANONYMOUS"
    """
    title_regex = clean_title_regex(chapter_title)
    
    # PATTERN 1: The "Double Header" (Page Title Page BookTitle)
    # Matches: "233 JIM'S STORY 233 ALCOHOLICS ANONYMOUS"
    double_header = re.compile(
        r'\d+\s+' + title_regex + r'\s+\d+\s+ALCOHOLICS\s+ANONYMOUS', 
        re.IGNORECASE | re.MULTILINE
    )
    text = double_header.sub(' ', text) # Replace with space to merge surrounding text

    # PATTERN 2: Reverse Double Header (Page BookTitle Page Title)
    double_header_rev = re.compile(
        r'\d+\s+ALCOHOLICS\s+ANONYMOUS\s+\d+\s+' + title_regex, 
        re.IGNORECASE | re.MULTILINE
    )
    text = double_header_rev.sub(' ', text)

    # PATTERN 3: Simple Title Header with Numbers
    # Matches: "JIM'S STORY 233" or "233 JIM'S STORY"
    # We guard this to ensure we don't delete the title if it's part of the text body
    # (Headers usually have newlines around them or are isolated)
    simple_header = re.compile(
        r'(?:\n|^)\s*(?:\d+\s+' + title_regex + r'|' + title_regex + r'\s+\d+)\s*(?:\n|$)',
        re.IGNORECASE | re.MULTILINE
    )
    text = simple_header.sub('\n', text)

    return text

def fix_story_intro(text):
    """Fixes Intro Blurb insertion between Drop Cap and Sentence."""
    pattern = r'^([A-Z])\s+([^\n\.!?]+.*?[\.!?])\s+([a-z])'
    match = re.search(pattern, text, flags=re.MULTILINE | re.DOTALL)
    
    if match:
        drop_cap = match.group(1)
        blurb = match.group(2).replace('\n', ' ').strip()
        continuation = match.group(3)
        rest_of_text = text[match.end():]
        
        merged_start = ""
        if drop_cap == 'I':
            merged_start = f"{drop_cap} {continuation}"
        elif drop_cap == 'A' and continuation in ['n', 's', 't', 'm', 'r']: 
            merged_start = f"{drop_cap}{continuation}"
        elif drop_cap == 'A':
            merged_start = f"{drop_cap} {continuation}"
        else:
            merged_start = f"{drop_cap}{continuation}"
            
        return f"> {blurb}\n\n{merged_start}{rest_of_text}"
    return text

def clean_text_block(text, chapter_title):
    """Cleaning pipeline."""
    
    # 1. NUKE HEADERS (New Step)
    text = nuke_story_headers(text, chapter_title)
    
    # 2. Remove Generic Headers/Titles from Start
    clean_title = chapter_title.upper().replace("'", "[’']")
    title_regex = r'\s*'.join([re.escape(c) if c.isalnum() else c for c in clean_title])
    
    header_zone = text[:1000]
    rest = text[1000:]
    
    header_zone = re.sub(r'^\s*Chapter\s+(\d+|[a-zA-Z]+)\s*', '', header_zone, flags=re.IGNORECASE | re.MULTILINE)
    header_zone = re.sub(r'^\s*' + title_regex + r'\s*', '', header_zone, flags=re.IGNORECASE | re.MULTILINE)
    header_zone = re.sub(r'^\s*ALCOHOLICS\s+ANONYMOUS\s*', '', header_zone, flags=re.IGNORECASE | re.MULTILINE)
    header_zone = re.sub(r'^\s*Part\s+[IVX]+\s*', '', header_zone, flags=re.IGNORECASE | re.MULTILINE)
    header_zone = re.sub(r'^\s*.*\d+.*\s*$', '', header_zone, flags=re.MULTILINE) 
    
    text = header_zone + rest

    # 3. Fix Story Intro
    text = fix_story_intro(text)
    
    # 4. Merge Drop Caps (if not fixed by intro)
    text = re.sub(r'^\s*([B-HJ-Z])\s+([a-z])', r'\1\2', text, count=1, flags=re.MULTILINE)
    
    # 5. Line Filtering
    lines = text.split('\n')
    filtered_lines = []
    
    NOISE_PATTERNS = [
        r'^\d+\s+ALCOHOLICS\s+ANONYMOUS',
        r'^ALCOHOLICS\s+ANONYMOUS\s+\d+',
        r'^\d+\s+[A-Z\s’\']+$',  
        r'^[A-Z\s’\']+\s+\d+$',  
        r'^\s*\d+\s*$',          
        r'^CONTENTS$',
        r'^\(?[0-9]+\)?$'
    ]
    
    for line in lines:
        stripped = line.strip()
        if not stripped: continue
        
        is_noise = False
        for pattern in NOISE_PATTERNS:
            if re.match(pattern, stripped, re.IGNORECASE):
                is_noise = True
                break
        if is_noise and stripped.upper() != chapter_title.upper(): continue
        filtered_lines.append(stripped)

    # 6. Reflow Paragraphs
    final_paragraphs = []
    current_para = ""
    
    for line in filtered_lines:
        # Repair "word- \n next" -> "wordnext"
        if current_para.endswith('-'):
            current_para = current_para[:-1] + line
            continue
            
        if current_para:
            prev_line_end = current_para[-1]
            if prev_line_end in ['.', '!', '?', '”', '"']:
                final_paragraphs.append(current_para)
                current_para = line
            else:
                current_para += " " + line
        else:
            current_para = line
            
    if current_para: final_paragraphs.append(current_para)
    
    # 7. Normalize Spacing & Ligatures
    full_text = "\n\n".join(final_paragraphs)
    full_text = re.sub(r'[ \t]+', ' ', full_text)
    full_text = re.sub(r'\s+([.,:;!?])', r'\1', full_text)
    
    # Fix broken words (will- ing)
    full_text = re.sub(r'([a-zA-Z])[-­\u00ad]\s+([a-zA-Z])', r'\1\2', full_text)
    full_text = full_text.replace('ﬁ', 'fi').replace('ﬂ', 'fl').replace('ﬀ', 'ff')
    
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
    if current_page: pages.append("\n\n".join(current_page))
    return pages

def process_full_book(pdf_path, output_filename):
    print(f"--- Starting Full Book Processing ---")
    try:
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
    except Exception as e:
        print(f"Error: {e}")
        return

    core_chapter_map = [
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
    
    story_map = find_story_map(reader, 183)
    full_map = core_chapter_map + story_map
    final_chapters = []
    
    print(f"\n--- Extracting {len(full_map)} Chapters ---")
    
    for i, (title, start_idx) in enumerate(full_map):
        print(f"[{i+1}/{len(full_map)}] {title}...", end=" ", flush=True)
        
        if i + 1 < len(full_map):
            end_idx = full_map[i+1][1]
        else:
            end_idx = total_pages 
            
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
        print(f"Done")

    output_data = {
        "title": "The Big Book (4th Edition)",
        "chapters": final_chapters
    }
    
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
    print(f"\nSuccess! Saved to {output_filename}")

if __name__ == "__main__":
    process_full_book("Big-Book-of-Alcoholics-Anonymous.pdf", "src/data/aa_big_book_v4.json")