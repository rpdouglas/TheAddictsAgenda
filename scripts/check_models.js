// scripts/check_models.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_FILE_PATH = path.join(ROOT_DIR, '.env');

// --- 1. Load API Key from .env manually ---
console.log('🔍 Reading .env file...');

let apiKey = null;

if (fs.existsSync(ENV_FILE_PATH)) {
    const envContent = fs.readFileSync(ENV_FILE_PATH, 'utf-8');
    
    // Regex to find VITE_GEMINI_API_KEY=...
    const match = envContent.match(/VITE_GEMINI_API_KEY\s*=\s*(.*)/);
    
    if (match && match[1]) {
        apiKey = match[1].trim().replace(/['"]/g, ''); // Remove quotes if present
        console.log('✅ Found API Key in .env');
    }
}

if (!apiKey) {
    console.error('❌ ERROR: Could not find VITE_GEMINI_API_KEY in .env file.');
    console.error('   Please ensure your .env file exists in the root directory.');
    process.exit(1);
}

// --- 2. Query Google API ---
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('📡 Contacting Google Gemini API...');

async function listModels() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.error) {
            console.error(`\n❌ API Error: ${data.error.message}`);
            return;
        }

        if (!data.models) {
            console.log('\n⚠️ No models found (Access might be restricted).');
            return;
        }

        console.log('\n✨ AVAILABLE MODELS FOR YOUR KEY:');
        console.log('=================================');
        
        // Filter and display relevant models
        const geminiModels = data.models
            .filter(m => m.name.includes('gemini'))
            .sort((a, b) => b.version.localeCompare(a.version)); // Newest first

        geminiModels.forEach(model => {
            const name = model.name.replace('models/', '');
            console.log(`🔹 ${name.padEnd(25)} | Vers: ${model.version}`);
            // console.log(`   └─ Limits: Input: ${model.inputTokenLimit}, Output: ${model.outputTokenLimit}`);
        });

        console.log('\n💡 RECOMMENDATION:');
        const has15Flash = geminiModels.some(m => m.name.includes('gemini-1.5-flash'));
        const has15Pro = geminiModels.some(m => m.name.includes('gemini-1.5-pro'));
        
        if (has15Flash) {
            console.log('✅ Use "gemini-1.5-flash" as your primary model in src/firebase.jsx');
        } else if (has15Pro) {
            console.log('✅ Use "gemini-1.5-pro" as your primary model.');
        } else {
            console.log('⚠️ Standard 1.5 models not found. Check the list above for a valid alternative.');
        }

    } catch (error) {
        console.error('❌ Network or Script Error:', error);
    }
}

listModels();