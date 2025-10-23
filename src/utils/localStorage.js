// A simple key for storing all local data in one localStorage item.
const LOCAL_STORAGE_KEY = 'addictsAgendaLocalData';

export const LocalStorageDataStore = {
    // Use the same KEYS object for consistency.
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
        HOMEGROUP_MEMBERS: 'recovery_homegroup_members',
        JOURNAL_TAGS: 'recovery_journal_tags'
    },

    loadAll: async () => {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error("Error loading all data from localStorage:", error);
            return {};
        }
    },

    save: async (key, value) => {
        try {
            const allData = await LocalStorageDataStore.loadAll();
            allData[key] = value;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allData));
        } catch (error) {
            console.error(`Error saving data to localStorage for key ${key}:`, error);
        }
    },
    
    load: async (key) => {
        try {
            const allData = await LocalStorageDataStore.loadAll();
            return allData[key] !== undefined ? allData[key] : null;
        } catch (error) {
            console.error(`Error loading data from localStorage for key ${key}:`, error);
            return null;
        }
    },

    deleteAll: async () => {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch (error) {
            console.error("Error deleting user data from localStorage:", error);
        }
    },

    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },
};