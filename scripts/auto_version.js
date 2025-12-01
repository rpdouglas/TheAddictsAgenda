// scripts/auto_version.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// --- Configuration ---
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE_PATH = path.join(ROOT_DIR, 'src/utils/data.js');
const DEV_HASH_FILE = path.join(ROOT_DIR, 'scripts/component_hashes.json');
const PROD_HASH_FILE = path.join(ROOT_DIR, 'scripts/prod_component_hashes.json');

// Check for --prod flag
const IS_PROD = process.argv.includes('--prod');

// Map keys in APP_VERSIONS to the actual file paths
const COMPONENT_MAP = {
    'DASHBOARD': 'src/components/Dashboard.jsx',
    'JOURNAL': 'src/components/DailyJournal.jsx',
    'GOALS': 'src/components/Goals.jsx',
    'COPING': 'src/components/CopingTools.jsx',
    'WORKBOOK': 'src/components/RecoveryWorkbook.jsx',
    'LITERATURE': 'src/components/RecoveryLiterature.jsx',
    'RESOURCES': 'src/components/Resources.jsx',
    'SETTINGS': 'src/components/Settings.jsx',
    'MEETINGFINDER': 'src/components/MeetingTracker.jsx',
    'DAILYREFLECTION': 'src/components/DailyReflection.jsx',
    'USERGUIDE': 'src/components/UserGuide.jsx',
    'SMARTTOOLS': 'src/components/SmartRecoveryTools.jsx', // Added mapping for Smart Recovery Tools
};

// --- Helper Functions ---

// Calculate MD5 hash of a file
function getFileHash(filePath) {
    try {
        const absolutePath = path.join(ROOT_DIR, filePath);
        if (!fs.existsSync(absolutePath)) return null;
        const fileBuffer = fs.readFileSync(absolutePath);
        const hashSum = crypto.createHash('md5');
        hashSum.update(fileBuffer);
        return hashSum.digest('hex');
    } catch (error) {
        console.error(`Error hashing file ${filePath}:`, error);
        return null;
    }
}

// Increment patch version (1.0.0 -> 1.0.1)
function incrementPatch(version) {
    const parts = version.split('.').map(Number);
    if (parts.length !== 3) return version; 
    parts[2] += 1;
    return parts.join('.');
}

// Increment minor version and reset patch (1.0.5 -> 1.1.0)
function incrementMinor(version) {
    const parts = version.split('.').map(Number);
    if (parts.length !== 3) return version; 
    parts[1] += 1; // Increment 2nd number
    parts[2] = 0;  // Reset 3rd number
    return parts.join('.');
}

// --- Main Logic ---

function main() {
    const modeLabel = IS_PROD ? 'PRODUCTION' : 'DEVELOPMENT';
    console.log(`🔄 Checking for component updates (${modeLabel} MODE)...`);

    // 1. Load previous hashes
    let devHashes = {};
    let prodHashes = {};

    if (fs.existsSync(DEV_HASH_FILE)) {
        devHashes = JSON.parse(fs.readFileSync(DEV_HASH_FILE, 'utf-8'));
    }
    if (fs.existsSync(PROD_HASH_FILE)) {
        prodHashes = JSON.parse(fs.readFileSync(PROD_HASH_FILE, 'utf-8'));
    }

    // Determine which baseline to compare against
    const baselineHashes = IS_PROD ? prodHashes : devHashes;

    // 2. Read data.js content
    let dataFileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    let hasChanges = false;
    
    // Create copies to update
    const nextDevHashes = { ...devHashes };
    const nextProdHashes = { ...prodHashes };

    // 3. Iterate through components
    for (const [key, relativePath] of Object.entries(COMPONENT_MAP)) {
        const currentHash = getFileHash(relativePath);
        
        if (!currentHash) {
            console.warn(`⚠️ Warning: Could not find file for ${key} (${relativePath})`);
            continue;
        }

        // Check if file changed since last baseline check
        if (currentHash !== baselineHashes[key]) {
            console.log(`✨ Changes detected in ${key}. Updating version...`);
            
            // Regex to find: key: '1.2.3'
            const regex = new RegExp(`(${key}:\\s*['"])(\\d+\\.\\d+\\.\\d+)(['"])`);
            const match = dataFileContent.match(regex);

            if (match) {
                const currentVersion = match[2];
                let newVersion;

                if (IS_PROD) {
                    newVersion = incrementMinor(currentVersion);
                } else {
                    newVersion = incrementPatch(currentVersion);
                }
                
                // Replace in content
                dataFileContent = dataFileContent.replace(regex, `$1${newVersion}$3`);
                
                // Update Hash Records
                if (IS_PROD) {
                    // In Prod mode, update BOTH records (establish new baseline for everything)
                    nextProdHashes[key] = currentHash;
                    nextDevHashes[key] = currentHash;
                } else {
                    // In Dev mode, only update Dev record
                    nextDevHashes[key] = currentHash;
                }

                hasChanges = true;
                
                console.log(`   ${key}: ${currentVersion} -> ${newVersion}`);
            } else {
                console.error(`❌ Could not find version string for ${key} in data.js`);
            }
        }
    }

    // 4. Save changes
    if (hasChanges) {
        fs.writeFileSync(DATA_FILE_PATH, dataFileContent, 'utf-8');
        
        // Save Hash Files
        fs.writeFileSync(DEV_HASH_FILE, JSON.stringify(nextDevHashes, null, 2), 'utf-8');
        if (IS_PROD) {
            fs.writeFileSync(PROD_HASH_FILE, JSON.stringify(nextProdHashes, null, 2), 'utf-8');
        }

        console.log('✅ src/utils/data.js and hash records updated successfully.');
    } else {
        console.log('👍 No component changes detected since last build. Versions remain the same.');
    }
}

main();