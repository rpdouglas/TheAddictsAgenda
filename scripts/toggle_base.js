// scripts/toggle_base.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VITE_CONFIG_PATH = path.join(ROOT_DIR, 'vite.config.js');

// Check for --prod flag
const IS_PROD = process.argv.includes('--prod');

function main() {
    console.log(`🔧 Configuring Base URL for ${IS_PROD ? 'PRODUCTION (Firebase)' : 'GITHUB PAGES'}...`);

    if (!fs.existsSync(VITE_CONFIG_PATH)) {
        console.error('❌ vite.config.js not found!');
        process.exit(1);
    }

    let content = fs.readFileSync(VITE_CONFIG_PATH, 'utf-8');

    // We look for the two specific return statements.
    // We use flexible regex to catch them whether they are currently commented or not.
    
    // Pattern 1: GitHub Pages Base (e.g., return '/TheAddictsAgenda/')
    // Matches: // return '/TheAddictsAgenda/' OR return '/TheAddictsAgenda/'
    const githubPattern = /(\/\/)?\s*return '\/TheAddictsAgenda\/'/g;
    
    // Pattern 2: Firebase Base (e.g., return '/')
    // Matches: // return '/' OR return '/'
    // We are careful not to match the first "return '/'" inside the 'development' check if possible,
    // but based on the provided file, the dev check is separate. 
    // To be safe, we will target the one specifically after the comment "For Firehosting deployment".
    
    // Actually, a safer way is to replace the entire getBase function body or just targeting the specific known lines if they are unique enough.
    // Given the file content, the lines are distinct enough.
    
    const githubLine = "  return '/TheAddictsAgenda/'";
    const fireLine = " //return '/'";
    
    // Logic:
    // If IS_PROD (Firebase):
    //   GitHub line should be commented: "// return '/TheAddictsAgenda/'"
    //   Firebase line should be uncommented: " return '/'"
    // If !IS_PROD (GitHub):
    //   GitHub line should be uncommented: " return '/TheAddictsAgenda/'"
    //   Firebase line should be commented: "// return '/'"

    let newContent = content;

    if (IS_PROD) {
        // Switch to Firebase (Prod)
        // 1. Comment out GitHub line if active
        newContent = newContent.replace(
            /^\s*return '\/TheAddictsAgenda\/'/gm, 
            "  // return '/TheAddictsAgenda/'"
        );
        
        // 2. Uncomment Firebase line if commented
        // We look for "//return '/'" or "// return '/'" specifically near the Firehosting comment if possible
        // but global replace for the specific string is usually fine if unique.
        newContent = newContent.replace(
            /\/\/\s*return '\/'/gm, 
            " return '/'"
        );

    } else {
        // Switch to GitHub (Default Build)
        // 1. Uncomment GitHub line if commented
        newContent = newContent.replace(
            /\/\/\s*return '\/TheAddictsAgenda\/'/gm, 
            "  return '/TheAddictsAgenda/'"
        );

        // 2. Comment out Firebase line if active
        // Note: We must avoid matching the `return '/'` inside the `if (mode === 'development')` block.
        // We can be specific by checking context or assuming the dev one is indented differently or already set.
        // However, a simple regex might hit the dev one.
        // Safe fix: Only replace `return '/'` that is NOT inside the if block?
        // Easier: The dev one is `    return '/'`. The bottom one is likely ` return '/'` or `//return '/'`.
        
        // Let's use a specific string replacement that targets the exact formatting user provided.
        // User provided: `//return '/'` (commented) and `return '/TheAddictsAgenda/'` (uncommented) as default state.
        
        // To safeguard, we will assume the structure provided:
        // `return '/'` found AFTER `// For Firehosting deployment`
        
        const fireCommentMarker = "// For Firehosting deployment";
        const fireRegex = new RegExp(`(${fireCommentMarker}\\s*[\\r\\n]+)\\s*return '\\/'`, 'g');
        
        newContent = newContent.replace(fireRegex, "$1 //return '/'");
    }

    if (newContent !== content) {
        fs.writeFileSync(VITE_CONFIG_PATH, newContent, 'utf-8');
        console.log('✅ vite.config.js updated successfully.');
    } else {
        console.log('👍 vite.config.js already correctly configured.');
    }
}

main();