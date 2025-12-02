import React, { useState, useEffect } from 'react';
import DataStore from '../../utils/dataStore.js';
import { ClipboardListIcon } from '../../utils/icons.jsx';

// --- HELPER: Auto-Save Hook ---
export const useAutoSave = (key, initialState) => {
    const [data, setData] = useState(initialState);
    const [isLoaded, setIsLoaded] = useState(false);
    const [status, setStatus] = useState('');

    // Load on mount
    useEffect(() => {
        const load = async () => {
            const saved = await DataStore.load(key);
            if (saved) setData(saved);
            setIsLoaded(true);
        };
        load();
    }, [key]);

    // Save on change (Debounced)
    useEffect(() => {
        if (!isLoaded) return;
        setStatus('Saving...');
        const timer = setTimeout(async () => {
            await DataStore.save(key, data);
            setStatus('Saved');
            setTimeout(() => setStatus(''), 2000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [data, key, isLoaded]);

    return [data, setData, status];
};

// --- HELPER: Save to Daily Journal ---
export const saveToJournal = async (toolName, content) => {
    try {
        const entries = await DataStore.load(DataStore.KEYS.JOURNAL) || [];
        const existingTags = await DataStore.load(DataStore.KEYS.JOURNAL_TAGS) || [];

        const newEntry = {
            id: DataStore.generateId ? DataStore.generateId() : Date.now().toString(),
            text: `**SMART Recovery Tool: ${toolName}**\n\n${content}`,
            tags: ['SMARTrecovery', toolName],
            mood: 5, 
            timestamp: new Date().toISOString()
        };

        const updatedEntries = [newEntry, ...entries];
        await DataStore.save(DataStore.KEYS.JOURNAL, updatedEntries);

        const tagsToAdd = ['SMARTrecovery', toolName].filter(t => !existingTags.includes(t));
        if (tagsToAdd.length > 0) {
            await DataStore.save(DataStore.KEYS.JOURNAL_TAGS, [...existingTags, ...tagsToAdd].sort());
        }

        return true;
    } catch (error) {
        console.error("Failed to save to journal:", error);
        return false;
    }
};

// --- HELPER: Journal Button Component ---
export const JournalButton = ({ onSave }) => {
    const [status, setStatus] = useState('');

    const handleClick = async () => {
        setStatus('Saving...');
        const success = await onSave();
        if (success) {
            setStatus('Saved to Journal!');
            setTimeout(() => setStatus(''), 2000);
        } else {
            setStatus('Error saving');
        }
    };

    return (
        <div className="flex items-center gap-2">
            {status && <span className="text-xs text-green-600 font-bold animate-fade-in">{status}</span>}
            <button 
                onClick={handleClick}
                className="flex items-center gap-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold py-1 px-3 rounded shadow-sm transition-colors"
                title="Save a copy of this to your Daily Journal"
            >
                <ClipboardListIcon className="w-4 h-4" />
                Save to Journal
            </button>
        </div>
    );
};