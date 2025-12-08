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
    "gemini-2.5-flash", // Primary model
    "gemini-2.5-pro",   // Higher-tier model
    "gemini-2.0-flash", // Older, stable fallback
];

/**
 * Attempts to generate content, cycling through models if a quota error (429) occurs.
 * @param {string} prompt The analysis prompt string.
 * @returns {Promise<any>} The successful response object from the API.
 */
export async function generateContentWithFallback(prompt) {
    let lastError = null;

    for (const modelName of MODEL_PRIORITY) {
        try {
            console.warn(`[AI Fallback] Attempting analysis with model: ${modelName}`);
            
            // Re-initialize the model instance for the current modelName
            const model = genAI.getGenerativeModel({ model: modelName });
            
            // Generate Content
            const result = await model.generateContent(prompt);
            
            // If successful, return the result immediately
            return result;
        } catch (error) {
            // Check if the error is specifically a Quota Exceeded (429) error
            if (error.message && error.message.includes('[429 ]')) {
                console.error(`[AI Fallback] ${modelName} failed due to Quota Exceeded (429). Trying next model.`);
                lastError = error;
                // Continue to the next model in the loop
                continue;
            } else {
                // If it's any other error (e.g., safety, network), throw immediately
                throw error;
            }
        }
    }

    // If the loop finishes without success, throw a final error detailing the failure
    if (lastError) {
        throw new Error(`All models failed due to Quota Exceeded. Last error: ${lastError.message}`);
    }
    
    throw new Error("AI analysis failed: No models were available for analysis.");
}

// Authentication & Database Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export { signInWithPopup };

// NOTE: The direct export of 'model' has been removed in favor of 'generateContentWithFallback'