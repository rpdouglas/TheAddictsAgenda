import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
// UPDATED: The path is now '../firebase.jsx' to correctly go up one level from 'utils' to 'src'
import { db, auth } from '../firebase.jsx';

// Helper to get the current user's document reference
const getUserDocRef = () => {
    const user = auth.currentUser;
    if (!user) {
        // This is a normal condition when the user is logged out.
        return null;
    }
    return doc(db, "users", user.uid);
};

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
            return docSnap.exists() ? docSnap.data() : {};
        } catch (error) {
            console.error("Error loading all data from Firestore:", error);
            return {};
        }
    },

    save: async (key, value) => {
        const docRef = getUserDocRef();
        if (!docRef) return;
        try {
            await setDoc(docRef, { [key]: value }, { merge: true });
        } catch (error) {
            console.error(`Error saving data to Firestore for key ${key}:`, error);
        }
    },
    
    load: async (key) => {
        try {
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