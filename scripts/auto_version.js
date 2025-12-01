// scripts/auto_version.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// --- Configuration ---
const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE_PATH = path.join(ROOT_DIR, 'src/utils/data.js');
const HASH_FILE_PATH = path.join(ROOT_DIR, 'scripts/component_hashes.json');

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
    'USERGUIDE': 'src/components/UserGuide.jsx', // Added mapping for User Guide
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
function incrementVersion(version) {
    const parts = version.split('.').map(Number);
    if (parts.length !== 3) return version; // Fallback if format is weird
    parts[2] += 1;
    return parts.join('.');
}

// --- Main Logic ---

function main() {
    console.log('🔄 Checking for component updates...');

    // 1. Load previous hashes
    let previousHashes = {};
    if (fs.existsSync(HASH_FILE_PATH)) {
        previousHashes = JSON.parse(fs.readFileSync(HASH_FILE_PATH, 'utf-8'));
    }

    // 2. Read data.js content
    let dataFileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    let hasChanges = false;
    const currentHashes = { ...previousHashes };

    // 3. Iterate through components
    for (const [key, relativePath] of Object.entries(COMPONENT_MAP)) {
        const currentHash = getFileHash(relativePath);
        
        if (!currentHash) {
            console.warn(`⚠️ Warning: Could not find file for ${key} (${relativePath})`);
            continue;
        }

        // If hash is different (file changed), update version
        if (currentHash !== previousHashes[key]) {
            console.log(`✨ Changes detected in ${key}. Updating version...`);
            
            // Regex to find: key: '1.2.3'
            const regex = new RegExp(`(${key}:\\s*['"])(\\d+\\.\\d+\\.\\d+)(['"])`);
            const match = dataFileContent.match(regex);

            if (match) {
                const currentVersion = match[2];
                const newVersion = incrementVersion(currentVersion);
                
                // Replace in content
                dataFileContent = dataFileContent.replace(regex, `$1${newVersion}$3`);
                
                // Update hash record
                currentHashes[key] = currentHash;
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
        fs.writeFileSync(HASH_FILE_PATH, JSON.stringify(currentHashes, null, 2), 'utf-8');
        console.log('✅ src/utils/data.js updated successfully.');
    } else {
        console.log('👍 No component changes detected. Versions remain the same.');
    }
}

main();