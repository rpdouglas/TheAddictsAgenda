import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from '../firebase.jsx';
// Import the encryption helpers (ensure you have created this file)
import { encryptData, decryptData } from './encryption.js';

// Helper to get the current user's document reference
const getUserDocRef = () => {
    const user = auth.currentUser;
    if (!user) {
        // This is a normal condition when the user is logged out.
        return null;
    }
    return doc(db, "users", user.uid);
};

// Retrieve the user's encryption key from the current session
// NOTE: You must set this value in sessionStorage when the user enters their PIN
const getUserSecret = () => {
    return sessionStorage.getItem('USER_ENCRYPTION_KEY');
};

// Define which data keys require encryption
const ENCRYPTED_KEYS = [
    'recovery_journal_entries',   // Corresponds to KEYS.JOURNAL
    'recovery_workbook_responses' // Corresponds to KEYS.WORKBOOK
];

export const FirestoreDataStore = {
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
        const docRef = getUserDocRef();
        if (!docRef) return {};
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const secret = getUserSecret();

                // Attempt to decrypt sensitive fields if a secret key is available in the session
                if (secret) {
                    ENCRYPTED_KEYS.forEach(key => {
                        if (data[key]) {
                            // Try to decrypt; if successful, replace the ciphertext with the real data
                            const decrypted = decryptData(data[key], secret);
                            if (decrypted) {
                                data[key] = decrypted;
                            }
                        }
                    });
                }
                return data;
            }
            return {};
        } catch (error) {
            console.error("Error loading all data from Firestore:", error);
            return {};
        }
    },

    save: async (key, value) => {
        const docRef = getUserDocRef();
        if (!docRef) return;

        let dataToSave = value;
        const secret = getUserSecret();

        // Check if this key is sensitive and needs encryption
        if (ENCRYPTED_KEYS.includes(key) && secret) {
            const encrypted = encryptData(value, secret);
            // Only use the encrypted version if encryption succeeded
            if (encrypted) {
                dataToSave = encrypted;
            }
        }

        try {
            await setDoc(docRef, { [key]: dataToSave }, { merge: true });
        } catch (error) {
            console.error(`Error saving data to Firestore for key ${key}:`, error);
        }
    },
    
    load: async (key) => {
        try {
            // We call loadAll() here, which now handles the decryption automatically
            const allData = await FirestoreDataStore.loadAll();
            
            if (allData[key] === undefined) {
                if (key === FirestoreDataStore.KEYS.WELCOME_TIP) return false;
                if ([
                    FirestoreDataStore.KEYS.JOURNAL, 
                    FirestoreDataStore.KEYS.GOALS, 
                    FirestoreDataStore.KEYS.MEETINGS, 
                    FirestoreDataStore.KEYS.HOMEGROUP_MEMBERS,
                    FirestoreDataStore.KEYS.JOURNAL_TAGS
                ].includes(key)) {
                    return [];
                }
                return null;
            }
            return allData[key];
        } catch (error) {
            console.error(`Error loading data from Firestore for key ${key}:`, error);
            return null;
        }
    },

    deleteAll: async () => {
        const docRef = getUserDocRef();
        if (!docRef) return;
        try {
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting user data from Firestore:", error);
        }
    },

    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },
};