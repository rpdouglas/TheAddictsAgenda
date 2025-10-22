// --- LOCAL STORAGE UTILITIES (src/utils/storage.js) ---

// This file provides a simple, self-contained module for all read/write operations
// using the browser's local storage. This ensures the app remains private and serverless.

export const LocalDataStore = {
    KEYS: { 
        SOBRIETY: 'recovery_sobriety_date', 
        JOURNAL: 'recovery_journal_entries', 
        GOALS: 'recovery_goals', 
        WORKBOOK: 'recovery_workbook_responses', 
        WELCOME_TIP: 'recovery_welcome_tip_dismissed' // Flag to show onboarding tip once
    },

    /**
     * Loads and parses data from Local Storage based on the key type.
     * Handles errors gracefully by returning appropriate defaults.
     * @param {string} key - The key for the data item.
     * @returns {*} The loaded data (Date string, Array, Object, or boolean).
     */
    load: (key) => {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                // Return default values if item doesn't exist
                if (key === LocalDataStore.KEYS.SOBRIETY) return null;
                if (key === LocalDataStore.KEYS.WELCOME_TIP) return false; // Default: show tip
                return []; // Default for arrays (Journal/Goals)
            }
            
            // Sobriety date is stored as a raw ISO string
            if (key === LocalDataStore.KEYS.SOBRIETY) {
                return serializedData; 
            }
            // Welcome tip is stored as the string 'true' or 'false'
            if (key === LocalDataStore.KEYS.WELCOME_TIP) {
                return serializedData === 'true';
            }

            // For JSON data (Arrays/Objects like Journal/Goals/Workbook)
            return JSON.parse(serializedData);

        } catch (error) {
            console.error(`Error loading data from localStorage for key ${key}:`, error);
            // Ensure runtime stability by returning safe defaults on error
            if (key === LocalDataStore.KEYS.SOBRIETY) return null;
            if (key === LocalDataStore.KEYS.WELCOME_TIP) return false;
            return [];
        }
    },

    /**
     * Serializes and saves data to Local Storage.
     * @param {string} key - The key for the data item.
     * @param {*} data - The data to be stored.
     */
    save: (key, data) => {
        try {
            let dataToStore;
            
            // Sobriety date and welcome tip are stored as primitive strings/booleans
            if (key === LocalDataStore.KEYS.SOBRIETY) {
                dataToStore = data;
            } else if (key === LocalDataStore.KEYS.WELCOME_TIP) {
                dataToStore = data ? 'true' : 'false';
            } else {
                // All other complex data structures (Arrays/Objects) are serialized
                dataToStore = JSON.stringify(data);
            }
            
            localStorage.setItem(key, dataToStore);
        } catch (error) {
            console.error(`Error saving data to localStorage for key ${key}:`, error);
        }
    },

    /**
     * Collects all user data (excluding the welcome tip) for export purposes.
     * @returns {Object} An object containing all stored user data.
     */
    loadAll: () => {
        const allData = {};
        for (const key in LocalDataStore.KEYS) {
            // Exclude the WELCOME_TIP flag
            if (LocalDataStore.KEYS[key] !== LocalDataStore.KEYS.WELCOME_TIP) {
                 const storageKey = LocalDataStore.KEYS[key];
                 const rawData = localStorage.getItem(storageKey);
                 if (rawData) {
                     try {
                         // Try to parse if it's JSON data
                         allData[storageKey] = JSON.parse(rawData);
                     } catch {
                         // Fallback for raw strings (like the sobriety date)
                         allData[storageKey] = rawData;
                     }
                 }
            }
        }
        return allData;
    },

    /**
     * Generates a simple, unique ID for journal/goal entries.
     * @returns {string} A unique ID string.
     */
    generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
};

/**
 * Simplified Auth Hook (Placeholder for modularity).
 * This mimics the structure but uses a hardcoded local user ID.
 * @returns {{user: {uid: string}, isAuthLoading: boolean}}
 */
export const useAuth = () => {
    // In a real application, this would use Firebase Auth to get the user's UID.
    // Since this is a local-only app, we use a fixed, generic ID.
    const user = { uid: 'local_user_id' };
    return { user, isAuthLoading: false };
};
