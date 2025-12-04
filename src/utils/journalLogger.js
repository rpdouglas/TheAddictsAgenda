// src/utils/journalLogger.js
import DataStore from './dataStore.js';

/**
 * Appends text to a journal entry with a specific tag for the current day.
 * If no such entry exists, it creates one.
 * @param {string} text - The content to log (e.g., "Walked the dog")
 * @param {string} tag - The tag to group entries by (e.g., "todolist")
 */
export const logDailyAction = async (text, tag) => {
    console.log(`Logging daily action: "${text}" [${tag}]`);
    try {
        // 1. Load existing entries
        const journalEntries = await DataStore.load(DataStore.KEYS.JOURNAL) || [];
        const allTags = await DataStore.load(DataStore.KEYS.JOURNAL_TAGS) || [];
        
        // 2. Define "Today" (ISO Format YYYY-MM-DD ensures consistency)
        // Note: We use local time adjustment to ensure we get the correct "User's Today"
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISODate = new Date(now - offset).toISOString().split('T')[0];
        
        // 3. Find existing entry for today with the specific tag
        const existingEntryIndex = journalEntries.findIndex(entry => {
            if (!entry.timestamp) return false;
            const entryDate = new Date(entry.timestamp);
            // Adjust entry date to local ISO as well for comparison
            const entryOffset = entryDate.getTimezoneOffset() * 60000;
            const entryISODate = new Date(entryDate - entryOffset).toISOString().split('T')[0];
            
            return entryISODate === localISODate && entry.tags && entry.tags.includes(tag);
        });

        if (existingEntryIndex !== -1) {
            // --- APPEND TO EXISTING ---
            const entry = journalEntries[existingEntryIndex];
            
            // Avoid logging the exact same line twice if clicked rapidly
            if (!entry.text.includes(`- ${text}`)) {
                const updatedEntry = {
                    ...entry,
                    text: `${entry.text}\n- ${text}`
                };
                
                // Update the array and save
                journalEntries[existingEntryIndex] = updatedEntry;
                await DataStore.save(DataStore.KEYS.JOURNAL, journalEntries);
                console.log("Appended to existing journal entry.");
            }
            
        } else {
            // --- CREATE NEW ---
            const newEntry = {
                id: DataStore.generateId(),
                // Create a header if it's the first entry of the day
                text: `Daily Log (${tag}):\n- ${text}`,
                mood: 0, // Neutral mood for automated logs
                tags: [tag],
                timestamp: new Date().toISOString()
            };
            
            // Add to list
            journalEntries.push(newEntry); 
            await DataStore.save(DataStore.KEYS.JOURNAL, journalEntries);
            console.log("Created new journal entry.");

            // Update Master Tag List if needed
            if (!allTags.includes(tag)) {
                await DataStore.save(DataStore.KEYS.JOURNAL_TAGS, [...allTags, tag].sort());
            }
        }
        
    } catch (error) {
        console.error("Error logging daily action:", error);
    }
};