import { FirestoreDataStore } from './storage.js';
import { LocalStorageDataStore } from './localStorage.js';

let activeStore = LocalStorageDataStore; // Default to local

const DataStore = {
    // This function will be called by App.jsx to set the correct storage engine
    setStorageEngine: (sessionType) => {
        if (sessionType === 'firebase') {
            activeStore = FirestoreDataStore;
        } else {
            activeStore = LocalStorageDataStore;
        }
    },

    // Expose all methods, which will dynamically call the active store
    get KEYS() {
        const baseKeys = activeStore.KEYS;
        return {
            // Ensure existing keys (like SOBRIETY) are preserved
            ...(baseKeys || {}),
            // Add new key for custom header text
            HEADER_TEXT: 'soberHeaderText',
            // --- NEW: Centralized Insights Log ---
            INSIGHTS: 'userInsights',
        };
    },
    loadAll: (...args) => activeStore.loadAll(...args),
    save: (...args) => activeStore.save(...args),
    load: (...args) => activeStore.load(...args),
    deleteAll: (...args) => activeStore.deleteAll(...args),
    generateId: (...args) => activeStore.generateId(...args),
};

export default DataStore;