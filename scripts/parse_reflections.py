import pdfplumber
import json
import re

# Configuration
INPUT_PDF = "AA-Daily-Reflections.pdf"
OUTPUT_JSON = "daily_reflections.json"

# Regex patterns
# Matches "JANUARY 1", "FEBRUARY 14", etc.
DATE_PATTERN = re.compile(
    r"^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+\d{1,2}$",
    re.IGNORECASE
)

# Heuristic to identify the citation/source line (e.g., "ALCOHOLICS ANONYMOUS, p. 25")
# Looks for common AA book titles or "p." / "pp." references
SOURCE_PATTERN = re.compile(
    r"(ALCOHOLICS ANONYMOUS|TWELVE STEPS|AS BILL SEES IT|DR\. BOB|COMES OF AGE|LANGUAGE OF THE HEART|BEST OF BILL|LIVING SOBER|GRAPEVINE|TRADITION|WAY OF LIFE).*?(p\.|pp\.)",
    re.IGNORECASE
)

# Simple backup: if a line ends with a page number reference
PAGE_REF_BACKUP = re.compile(r"(p\.|pp\.)\s*\d+", re.IGNORECASE)

def clean_text(text_lines):
    """Joins lines into a single string and cleans up extra whitespace."""
    if not text_lines:
        return ""
    # Join with space
    text = " ".join(text_lines)
    # Replace multiple spaces with single space
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_pdf(pdf_path):
    reflections = []
    
    print(f"Opening {pdf_path}...")
    
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Found {total_pages} pages.")

        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if not text:
                continue

            lines = text.split('\n')
            cleaned_lines = [line.strip() for line in lines if line.strip()]
            
            # --- Parsing Logic ---
            
            # 1. Find Date (Start of entry)
            date_index = -1
            date_str = ""
            
            for idx, line in enumerate(cleaned_lines):
                # We search the first few lines for the date
                if idx > 5: break 
                if DATE_PATTERN.match(line):
                    date_index = idx
                    date_str = line
                    break
            
            # If no date found, skip page (likely title page or index)
            if date_index == -1:
                continue

            # 2. Identify Title
            # Title is usually the line immediately following the date.
            # Sometimes titles span 2 lines, but usually they are short and uppercase.
            if date_index + 1 < len(cleaned_lines):
                title_str = cleaned_lines[date_index + 1]
                content_start_index = date_index + 2
            else:
                title_str = "Unknown Title"
                content_start_index = date_index + 1

            # 3. Find Source/Reference Line
            # We look for the line dividing the "Snippet/Quote" from the "Reflection"
            source_index = -1
            source_str = ""

            for idx in range(content_start_index, len(cleaned_lines)):
                line = cleaned_lines[idx]
                if SOURCE_PATTERN.search(line) or PAGE_REF_BACKUP.search(line):
                    source_index = idx
                    source_str = line
                    break
            
            # If we can't find a source, we might be looking at a page with weird formatting.
            # We'll log it and skip content splitting to avoid crashing.
            if source_index == -1:
                print(f"Warning: Could not separate Quote from Reflection on page {i+1} ({date_str})")
                quote_text = ""
                reflection_text = clean_text(cleaned_lines[content_start_index:])
            else:
                # 4. Extract Quote (Italicized part usually)
                raw_quote = cleaned_lines[content_start_index:source_index]
                quote_text = clean_text(raw_quote)

                # 5. Extract Reflection (Main body)
                raw_reflection = cleaned_lines[source_index + 1:]
                reflection_text = clean_text(raw_reflection)

            # Create Entry
            entry = {
                "id": len(reflections) + 1,
                "date": date_str,
                "title": title_str,
                "quote": quote_text,
                "source": source_str,
                "reflection": reflection_text
            }
            
            reflections.append(entry)

    return reflections

def save_json(data, output_path):
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(data)} reflections to {output_path}")

if __name__ == "__main__":
    try:
        data = parse_pdf(INPUT_PDF)
        save_json(data, OUTPUT_JSON)
    except FileNotFoundError:
        print(f"Error: Could not find file '{INPUT_PDF}'. Make sure it is in the same folder.")
    except Exception as e:
        print(f"An error occurred: {e}")