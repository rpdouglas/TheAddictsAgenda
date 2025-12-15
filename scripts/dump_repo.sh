#!/bin/bash

# Output filename
OUTPUT_FILE="full_codebase.txt"

# Clear/Create the file
echo "--- PROJECT FILE TREE ---" > "$OUTPUT_FILE"

# 1. Create the File Tree
# Lists all files up to 4 levels deep, excluding massive folders like node_modules
find . -maxdepth 4 \
  -not -path '*/.*' \
  -not -path './node_modules*' \
  -not -path './dist*' \
  -not -path './build*' \
  -print | sed -e 's;[^/]*/;|____;g;s;____|; |;g' >> "$OUTPUT_FILE"

# 2. Dump Content of Root Config Files
echo -e "\n\n--- ROOT CONFIG FILES ---" >> "$OUTPUT_FILE"

# Array of specific root files to include
ROOT_FILES=("package.json" "vite.config.js" "tailwind.config.js" "index.html" "postcss.config.js" ".env.example")

for f in "${ROOT_FILES[@]}"; do
  if [ -f "$f" ]; then
    echo -e "\n\n--- START FILE: $f ---\n" >> "$OUTPUT_FILE"
    cat "$f" >> "$OUTPUT_FILE"
    echo -e "\n--- END FILE: $f ---" >> "$OUTPUT_FILE"
  fi
done

# 3. Dump Content of SRC, SCRIPTS, and PUBLIC (Recursive)
echo -e "\n\n--- SOURCE, SCRIPTS, & PUBLIC CONTENTS ---" >> "$OUTPUT_FILE"

# Find files in src, scripts, and public with specific extensions
find src scripts public -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.json" -o -name "*.css" -o -name "*.py" -o -name "*.sh" -o -name "*.html" \) 2>/dev/null | while read filename; do
  echo -e "\n\n--- START FILE: $filename ---\n" >> "$OUTPUT_FILE"
  cat "$filename" >> "$OUTPUT_FILE"
  echo -e "\n--- END FILE: $filename ---" >> "$OUTPUT_FILE"
done

echo "✅ Repository dump complete! Data saved to: $OUTPUT_FILE"