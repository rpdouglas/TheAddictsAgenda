import json
import re
from pypdf import PdfReader

# --- CONFIGURATION ---
MAX_PAGE_LENGTH = 2500

# --- MANIFESTS ---
# We use this to find the start of each section.
CHAPTER_MANIFEST = [
    # Roman Numeral Section
    ("Preface", "PREFACE"),
    ("What is Recovery Dharma?", "WHAT IS RECOVERY DHARMA?"),
    ("Where to Begin", "WHERE TO BEGIN"),
    ("The Practice", "THE PRACTICE"),
    
    # Section I: The Basics
    ("Awakening: Buddha", "AWAKENING: BUDDHA"),
    ("The Truth: Dharma", "THE TRUTH: DHARMA"),
    ("The First Noble Truth", "THE FIRST NOBLE TRUTH"),
    ("The Second Noble Truth", "THE SECOND NOBLE TRUTH"),
    ("The Third Noble Truth", "THE THIRD NOBLE TRUTH"),
    ("The Fourth Noble Truth", "THE FOURTH NOBLE TRUTH"),
    
    # The Eightfold Path (Sub-chapters)
    ("Wise Understanding", "WISE UNDERSTANDING"),
    ("Wise Intention", "WISE INTENTION"),
    ("Wise Speech", "WISE SPEECH"),
    ("Wise Action", "WISE ACTION"),
    ("Wise Livelihood", "WISE LIVELIHOOD"),
    ("Wise Effort", "WISE EFFORT"),
    ("Wise Mindfulness", "WISE MINDFULNESS"),
    ("Wise Concentration", "WISE CONCENTRATION"),
    
    # Community
    ("Community: Sangha", "COMMUNITY: SANGHA"),
    ("Isolation and Connection", "ISOLATION AND CONNECTION"),
    ("Reaching Out", "REACHING OUT"),
    ("Wise Friends and Mentors", "WISE FRIENDS AND MENTORS"),
    ("Service and Generosity", "SERVICE AND GENEROSITY"),
    ("Recovery is Possible", "RECOVERY IS POSSIBLE"),
    
    # Section II: Stories (Header only, stories are sub-parsed)
    ("Personal Recovery Stories", "PERSONAL RECOVERY"), 
]

STORY_MANIFEST = [
    "Amy", "Chance", "Synyi", "Matthew", "Berlinda", 
    "Jean", "Destiny", "Ned", "Kara", "Unity", 
    "Randall", "Lacey", "Paul", "Eunsung"
]

APPENDIX_MANIFEST = [
    ("Selected Meditations", "SELECTED MEDITATIONS"),
    ("Inquiry Questions", "INQUIRY QUESTIONS"),
    ("Glossary of Terms", "GLOSSARY OF TERMS"),
    ("Meeting Format", "RECOVERY DHARMA MEETING FORMAT"),
    ("Dedication of Merit", "DEDICATION OF MERIT")
]

def clean_text_block(text, title_str):
    """
    Cleans headers, footers, and fixes hyphenation.
    """
    lines = text.split('\n')
    cleaned_lines = []
    
    # NOISE PATTERNS specific to this PDF
    NOISE_PATTERNS = [
        r'^\d+$',                          # Standalone Page Numbers (1, 58)
        r'^[IVX]+$',                       # Roman Numeral Page Numbers (IX, X)
        r'^RECOVERY DHARMA$',              # Header
        r'^SECTION [I]+$',                 # Section Headers
        r'^STORIES$'                       # "PERSONAL RECOVERY \n STORIES" artifact
    ]
    
    # Regex to remove the Title if it appears as a header
    # (Recovery Dharma titles are often UPPERCASE in text)
    title_clean = re.escape(title_str)
    
    for line in lines:
        stripped = line.strip()
        if not stripped: continue
        
        is_noise = False
        
        # 1. Check Global Noise
        for pattern in NOISE_PATTERNS:
            if re.match(pattern, stripped, re.IGNORECASE):
                is_noise = True
                break
        
        # 2. Check Chapter Title Header
        # If line is EXACTLY the title (case insensitive), likely a header
        if stripped.upper() == title_str.upper():
            is_noise = True
            
        if is_noise: continue
        cleaned_lines.append(stripped)
        
    text = "\n".join(cleaned_lines)
    
    # FIX HYPHENATION: "sub- \n stances" -> "substances"
    text = re.sub(r'-\n', '', text)
    
    # FIX PARAGRAPHS: Sentence end + Newline + Capital -> New Paragraph
    text = re.sub(r'([\.!?])\n([A-Z])', r'\1\n\n\2', text)
    
    # MERGE BROKEN LINES: Lowercase start -> Merge with prev
    text = re.sub(r'(?<!\n)\n(?=[a-z])', ' ', text)
    
    # NORMALIZE SPACING
    text = re.sub(r'[ \t]+', ' ', text)
    
    return text

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

def find_chapter_indices(reader, manifest, start_search_page=0):
    """
    Scans PDF to find start pages for chapters based on their UPPERCASE headers.
    Returns list of (Title, StartIndex).
    """
    found_chapters = []
    current_search = start_search_page
    
    print(f"Scanning for {len(manifest)} chapters...")
    
    for title, header_text in manifest:
        # Search for header in first 1000 chars of page
        # Using simple string check since headers are usually clean in this PDF
        for i in range(current_search, len(reader.pages)):
            page_text = reader.pages[i].extract_text()
            
            # Normalize for search (remove special chars)
            clean_page = re.sub(r'\s+', ' ', page_text).upper()
            clean_header = header_text.upper()
            
            if clean_header in clean_page[:1000]: # Check top of page
                print(f"Found '{title}' at Index {i}")
                found_chapters.append((title, header_text, i))
                current_search = i + 1 # Start next search from next page
                break
                
    return found_chapters

def parse_recovery_dharma(pdf_path, output_filename):
    print(f"Processing {pdf_path}...")
    try:
        reader = PdfReader(pdf_path)
    except Exception as e:
        print(f"Error: {e}")
        return

    # 1. FIND MAIN CHAPTERS
    # We skip TOC (Pages 0-7), start search at 8
    main_chapters = find_chapter_indices(reader, CHAPTER_MANIFEST, start_search_page=8)
    
    # 2. FIND STORIES (Special Case)
    # Stories appear after "Personal Recovery Stories"
    # In this PDF, story titles are often Lowercase or Case-Specific in headers (e.g. "amy")
    story_start_idx = main_chapters[-1][2] + 1 # Page after "Personal Recovery Stories" header
    stories = []
    
    print(f"Scanning for {len(STORY_MANIFEST)} Stories starting at {story_start_idx}...")
    current_story_search = story_start_idx
    
    for story_name in STORY_MANIFEST:
        for i in range(current_story_search, len(reader.pages)):
            text = reader.pages[i].extract_text()
            # Check for name on its own line or at start
            # e.g. "58\namy"
            if re.search(r'(?:\n|^)\s*' + story_name + r'\s*(?:\n|$)', text, re.IGNORECASE):
                print(f"Found Story '{story_name}' at Index {i}")
                stories.append((story_name, story_name.upper(), i)) # Use UPPER for consistency
                current_story_search = i + 1
                break
    
    # 3. FIND APPENDIX
    appendix_start = stories[-1][2] + 1 if stories else 120
    appendix_chapters = find_chapter_indices(reader, APPENDIX_MANIFEST, start_search_page=appendix_start)
    
    # COMBINE ALL
    full_map = main_chapters + stories + appendix_chapters
    final_json_chapters = []
    
    print(f"\n--- Extracting Content ---")
    
    for i, (title, header_str, start_idx) in enumerate(full_map):
        print(f"Extracting '{title}'...", end=" ")
        
        # Determine End Index
        if i + 1 < len(full_map):
            end_idx = full_map[i+1][2]
        else:
            end_idx = len(reader.pages)
            
        # Extract Text
        raw_text = ""
        for p in range(start_idx, end_idx):
            raw_text += reader.pages[p].extract_text() + "\n"
            
        # Clean
        clean_text = clean_text_block(raw_text, header_str)
        
        # Paginate
        ui_pages = paginate_smart(clean_text)
        
        final_json_chapters.append({
            "title": title,
            "content": clean_text,
            "pages": ui_pages
        })
        print(f"Done ({len(ui_pages)} pgs)")

    # EXPORT
    output_data = {
        "title": "Recovery Dharma (2nd Edition)",
        "chapters": final_json_chapters
    }
    
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"\nSaved to {output_filename}")

if __name__ == "__main__":
    parse_recovery_dharma("Recovery Dharma 2.0.pdf", "src/data/recovery_dharma_guidebook.json")