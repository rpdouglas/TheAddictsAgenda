// --- LOCAL STORAGE UTILITIES (src/utils/storage.js) ---

// This file provides a simple, self-contained module for all read/write operations
// using the browser's local storage. This ensures the app remains private and serverless.

export const LocalDataStore = {
    KEYS: {
        SOBRIETY: 'recovery_sobriety_date',
        JOURNAL: 'recovery_journal_entries',
        GOALS: 'recovery_goals',
        WORKBOOK: 'recovery_workbook_responses',
        WELCOME_TIP: 'recovery_welcome_tip_dismissed',
        PIN: 'recovery_app_pin',
        NINETY_IN_NINETY: 'recovery_90_in_90_challenge',
        MEETINGS: 'recovery_user_meetings',
        HOMEGROUP_TRACKER: 'recovery_homegroup_tracker',
        // CORRECTED: Added the missing key for homegroup members
        HOMEGROUP_MEMBERS: 'recovery_homegroup_members',
        JOURNAL_TAGS: 'recovery_journal_tags' // Assuming this key might be used elsewhere
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
                if (key === LocalDataStore.KEYS.PIN) return null;
                if (key === LocalDataStore.KEYS.NINETY_IN_NINETY) return null;
                return []; // Default for arrays (Journal/Goals/Meetings/Members)
            }

            // Sobriety date is stored as a raw ISO string
            if (key === LocalDataStore.KEYS.SOBRIETY) {
                return serializedData;
            }
            // Welcome tip is stored as the string 'true' or 'false'
            if (key === LocalDataStore.KEYS.WELCOME_TIP) {
                return serializedData === 'true';
            }
            // PIN is stored as a raw string
            if (key === LocalDataStore.KEYS.PIN) {
                return serializedData;
            }

            // For JSON data
            return JSON.parse(serializedData);

        } catch (error) {
            console.error(`Error loading data from localStorage for key ${key}:`, error);
            // Ensure runtime stability by returning safe defaults on error
            if (key === LocalDataStore.KEYS.SOBRIETY) return null;
            if (key === LocalDataStore.KEYS.WELCOME_TIP) return false;
            if (key === LocalDataStore.KEYS.PIN) return null;
            if (key === LocalDataStore.KEYS.NINETY_IN_NINETY) return null;
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

            if (key === LocalDataStore.KEYS.SOBRIETY || key === LocalDataStore.KEYS.PIN) {
                dataToStore = data;
            } else if (key === LocalDataStore.KEYS.WELCOME_TIP) {
                dataToStore = data ? 'true' : 'false';
            } else {
                dataToStore = JSON.stringify(data);
            }

            localStorage.setItem(key, dataToStore);
        } catch (error) {
            console.error(`Error saving data to localStorage for key ${key}:`, error);
        }
    },

    /**
     * Collects all user data for export.
     * @returns {Object} An object containing all stored user data.
     */
    loadAll: () => {
        const allData = {};
        for (const key in LocalDataStore.KEYS) {
            if (Object.prototype.hasOwnProperty.call(LocalDataStore.KEYS, key)) {
                 const storageKey = LocalDataStore.KEYS[key];
                 const rawData = localStorage.getItem(storageKey);
                 if (rawData) {
                     try {
                         // Attempt to parse JSON, fall back to raw string if it fails
                         allData[storageKey] = JSON.parse(rawData);
                     } catch {
                         allData[storageKey] = rawData;
                     }
                 }
            }
        }
        return allData;
    },


    /**
     * Generates a simple, unique ID.
     * @returns {string} A unique ID string.
     */
    generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
};

/**
 * Simplified Auth Hook
 * @returns {{user: {uid: string}, isAuthLoading: boolean}}
 */
export const useAuth = () => {
    const user = { uid: 'local_user_id' };
    return { user, isAuthLoading: false };
};