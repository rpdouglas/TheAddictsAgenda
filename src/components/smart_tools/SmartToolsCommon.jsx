import React, { useState, useEffect } from 'react';
import DataStore from '../../utils/dataStore.js';
import { ClipboardListIcon, ChevronDown, ChevronUp } from '../../utils/icons.jsx';

// --- NEW COMPONENT: Tool Guide (Explanation + Walkthrough) ---
export const ToolGuide = ({ explanation, walkthrough }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-6 bg-white/60 rounded-lg border border-black/5 overflow-hidden shadow-sm">
            <div className="p-4 text-sm text-gray-800 leading-relaxed border-b border-black/5">
                <p>{explanation}</p>
            </div>
            <div>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center p-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-black/5 transition-colors focus:outline-none"
                >
                    <span>How to use this tool</span>
                    {isOpen ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                </button>
                
                {isOpen && (
                    <div className="p-4 bg-white/40 text-sm text-gray-700 space-y-3 animate-fade-in border-t border-black/5">
                        {walkthrough.map((step, index) => (
                            <div key={index} className="flex gap-3">
                                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-black/10 text-[10px] font-bold text-gray-700">
                                    {index + 1}
                                </span>
                                <div>
                                    <span className="font-bold text-gray-900">{step.title}: </span>
                                    <span>{step.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

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