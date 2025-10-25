import os

# --- Configuration ---

# The root directory to start searching from. '.' means the current directory.
ROOT_DIR = '.'

# List of directories to completely ignore during the search.
EXCLUDED_DIRS = [
    'node_modules',
    '.git',
    'dist',
    'public', # Ignoring public folder to avoid changing SVGs or other assets
    '.github',
]

# List of file extensions to target for replacement.
TARGET_EXTENSIONS = ['.jsx', '.js', '.html', '.css']

# The dictionary of color replacements remains the same.
COLOR_REPLACEMENTS = {
    # Primary Theme: Teal -> Serene Teal & Healing Green
    'bg-teal-600': 'bg-serene-teal',
    'text-teal-600': 'text-serene-teal',
    'text-teal-700': 'text-serene-teal',
    'text-teal-800': 'text-serene-teal',
    'border-teal-500': 'border-serene-teal',
    'hover:bg-teal-700': 'hover:brightness-95', # Use brightness for a consistent hover effect
    'hover:bg-teal-800': 'hover:brightness-95',
    'bg-teal-50': 'bg-serene-teal/10', # Use opacity for light backgrounds
    'hover:bg-teal-50': 'hover:bg-serene-teal/20',
    'hover:bg-teal-100': 'hover:bg-serene-teal/20',

    # Secondary/Alternative Buttons: Blue -> Healing Green
    'bg-blue-500': 'bg-healing-green',
    'hover:bg-blue-600': 'hover:brightness-95',
    'bg-blue-600': 'bg-healing-green',
    'hover:bg-blue-700': 'hover:brightness-95',
    'bg-blue-800': 'bg-healing-green',
    'hover:bg-blue-900': 'hover:brightness-95',

    # Accent/Warning: Red/Yellow -> Hopeful Coral
    'bg-red-500': 'bg-hopeful-coral',
    'bg-red-600': 'bg-hopeful-coral',
    'hover:bg-red-700': 'hover:brightness-95',
    'text-red-500': 'text-hopeful-coral',
    'bg-red-50': 'bg-hopeful-coral/10',
    'border-red-200': 'border-hopeful-coral/30',
    'bg-yellow-100': 'bg-hopeful-coral/20',
    'border-yellow-300': 'border-hopeful-coral/40',
    'bg-yellow-400': 'bg-hopeful-coral',
    'text-yellow-900': 'text-deep-charcoal',
    'hover:bg-yellow-500': 'hover:brightness-95',
    'bg-yellow-50': 'bg-hopeful-coral/10',
    'border-yellow-200': 'border-hopeful-coral/30',
    'text-yellow-800': 'text-deep-charcoal',
    'bg-yellow-600': 'bg-hopeful-coral',

    # Text & Neutrals: Gray -> Deep Charcoal / Light Stone
    'text-gray-900': 'text-deep-charcoal',
    'text-gray-800': 'text-deep-charcoal',
    'text-gray-700': 'text-deep-charcoal/80', # Use opacity for shades
    'text-gray-600': 'text-deep-charcoal/70',
    'text-gray-500': 'text-deep-charcoal/60',
    'text-gray-400': 'text-deep-charcoal/50',
    'bg-gray-50': 'bg-pure-white/60',
    'bg-gray-100': 'bg-soft-linen',
    'bg-gray-200': 'bg-light-stone/50',
    'bg-gray-300': 'bg-light-stone/70',
    'hover:bg-gray-100': 'hover:bg-pure-white/80',
    'hover:bg-gray-300': 'hover:bg-light-stone/60',
    'border-gray-200': 'border-light-stone/50',
    'border-gray-300': 'border-light-stone',

    # Specific Coping Card Gradients
    'from-blue-100 to-indigo-200': 'from-serene-teal/20 to-healing-green/20',
    'from-green-100 to-emerald-200': 'from-healing-green/20 to-serene-teal/20',
    'from-pink-100 to-red-200': 'from-hopeful-coral/20 to-hopeful-coral/30',
}

def update_color_scheme():
    """
    Walks through the project directory and replaces old color classes in target files.
    """
    print("🚀 Starting color scheme update for the entire project...")
    updated_files_count = 0
    
    for root, dirs, files in os.walk(ROOT_DIR, topdown=True):
        # Modify dirs in-place to exclude specified directories from os.walk
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        
        for filename in files:
            # Check if the file has one of the target extensions
            if any(filename.endswith(ext) for ext in TARGET_EXTENSIONS):
                file_path = os.path.join(root, filename)
                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        original_content = file.read()
                    
                    modified_content = original_content
                    # Apply all replacements
                    for old_class, new_class in COLOR_REPLACEMENTS.items():
                        modified_content = modified_content.replace(old_class, new_class)

                    # Only write back to the file if changes were actually made
                    if original_content != modified_content:
                        with open(file_path, 'w', encoding='utf-8') as file:
                            file.write(modified_content)
                        print(f"✅ Updated colors in: {file_path}")
                        updated_files_count += 1

                except Exception as e:
                    print(f"❌ Error processing {file_path}: {e}")
    
    if updated_files_count == 0:
        print("\n🎨 No files needed updating. Your project might already be using the new scheme!")
    else:
        print(f"\n✨ Finished! Updated {updated_files_count} file(s).")
    print("Don't forget to manually update 'tailwind.config.js' and 'src/index.css' if you haven't already.")


if __name__ == "__main__":
    update_color_scheme()