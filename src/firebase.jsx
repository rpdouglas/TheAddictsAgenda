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

// --- Model Fallback Configuration ---
const MODEL_PRIORITY = [
    "gemini-2.5-flash", // Fast, low-cost primary choice
    "gemini-2.0-pro",   // High-quality fallback for complex analysis
];

/**
 * Attempts to generate content, cycling through available models if a Quota Exceeded error occurs.
 * Explicitly checks for blocked responses by checking for the presence of candidates.
 * @param {string} prompt The analysis prompt string.
 * @returns {Promise<any>} The successful response object from the API.
 */
export async function generateContentWithFallback(prompt) {
    let lastError = null;

    for (const modelName of MODEL_PRIORITY) {
        try {
            console.warn(`[AI Fallback] Attempting analysis with model: ${modelName}`);
            
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
            // Check if the error is specifically a Quota Exceeded (429) error
            if (error.message && error.message.includes('[429 ]')) {
                console.error(`[AI Fallback] ${modelName} failed due to Quota Exceeded (429). Trying next model.`);
                lastError = error;
                continue;
            } else {
                // Throw any other error (network, unauthorized model, etc.)
                console.error(`!!!! AI CRITICAL ERROR (NON-QUOTA) in ${modelName} !!!!`, error);
                throw error;
            }
        }
    }

    if (lastError) {
        throw new Error(`CRITICAL: All models failed due to Quota Exceeded. Last error: ${lastError.message}`);
    }
    
    throw new Error("CRITICAL: AI analysis failed: No models were available for analysis.");
}

// Authentication & Database Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export { signInWithPopup };