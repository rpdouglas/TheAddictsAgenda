// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// --- MODEL PRIORITY ---
// Cycles from Fast/Cheap -> Powerful -> Legacy Stable -> Auto-Resolve
const MODEL_PRIORITY = [
    "gemini-2.5-flash",       // Primary: Verified Available (Preview)
    "gemini-2.5-pro",         // Secondary: High Reasoning (Preview)
    "gemini-2.0-flash",       // Fallback: Previous Stable
    "gemini-flash-latest"     // Safety Net: Auto-resolves to latest stable
];

/**
 * Attempts to generate content, cycling through available models if a Quota, Overload, or Model error occurs.
 * Explicitly checks for blocked responses by checking for the presence of candidates.
 * @param {string} prompt The analysis prompt string.
 * @returns {Promise<any>} The successful response object from the API.
 */
export async function generateContentWithFallback(prompt) {
    let lastError = null;

    for (const modelName of MODEL_PRIORITY) {
        try {
            // console.log(`[AI Fallback] Attempting analysis with model: ${modelName}`);
            
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            
            // Explicitly check for an empty response (often a safety block)
            if (!result.response.candidates || result.response.candidates.length === 0) {
                // If a response was returned but had no candidates, it's a safety block.
                const debugResult = JSON.stringify(result, null, 2);
                console.error(`!! CRITICAL: PROMPT BLOCKED (NO CANDIDATES) !! Raw Result: ${debugResult}`);
                
                throw new Error(`Empty AI Response (Blocked): The model output was blocked by a safety filter.`);
            }

            // If candidates are present, return the result.
            return result;

        } catch (error) {
            // UPDATED LOGIC: Catch 503 (Overloaded), 429 (Quota), and 404/400 (Model Error)
            const isOverloaded = error.message && error.message.includes('503');
            const isQuota = error.message && error.message.includes('429');
            const isModelError = error.message && (error.message.includes('404') || error.message.includes('400'));

            if (isOverloaded || isQuota || isModelError) {
                let reason = 'Unknown';
                if (isOverloaded) reason = 'Model Overloaded (503)';
                else if (isQuota) reason = 'Quota Limit (429)';
                else if (isModelError) reason = 'Model Unavailable (404/400)';

                console.warn(`[AI Fallback] ${modelName} failed (${reason}). Switching to next model...`);
                lastError = error;
                continue;
            } else {
                // Throw any other error (network, unauthorized, etc.) immediately
                console.error(`!!!! AI CRITICAL ERROR (NON-RECOVERABLE) in ${modelName} !!!!`, error);
                throw error;
            }
        }
    }

    if (lastError) {
        throw new Error(`CRITICAL: All models failed. Last error: ${lastError.message}`);
    }
    
    throw new Error("CRITICAL: AI analysis failed: No models were available for analysis.");
}

// Authentication & Database Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export { signInWithPopup };