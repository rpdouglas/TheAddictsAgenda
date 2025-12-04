// src/components/DailyJournal.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import JournalForm from './journal/JournalForm.jsx';
import JournalList from './journal/JournalList.jsx';
import MoodGraph from './journal/MoodGraph.jsx';
import WordCloudView from './journal/WordCloudView.jsx'; // NEW IMPORT
import JournalModals from './journal/JournalModals.jsx';
import { processAIActionPlan } from '../utils/journalLogger.js';

const DailyJournal = ({ journalTemplate, setJournalTemplate, journalTags, setJournalTags }) => {
    const [items, setItems] = useState([]);
    const [newItemText, setNewItemText] = useState('');
    const [currentMood, setCurrentMood] = useState(0);
    const [weather, setWeather] = useState(''); 
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [showGeminiHelper, setShowGeminiHelper] = useState(false);
    const [activeTab, setActiveTab] = useState('write');
    
    // Filtering & Search State
    const [filterTag, setFilterTag] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Tag Management
    const [tagInput, setTagInput] = useState('');
    const [allTags, setAllTags] = useState([]);

    // Modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        loadJournal();
    }, []);

    // Handle Template Props (from external components like Coping Cards)
    useEffect(() => {
        if (journalTemplate) {
            setNewItemText(journalTemplate);
            setJournalTemplate(''); 
            setActiveTab('write');
        }
        if (journalTags && journalTags.length > 0) {
            // Merge unique tags
            setAllTags(prev => [...new Set([...prev, ...journalTags])]);
        }
    }, [journalTemplate, journalTags, setJournalTemplate]);


    const loadJournal = async () => {
        const storedItems = await DataStore.load(DataStore.KEYS.JOURNAL) || [];
        
        // Sort by timestamp desc
        storedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setItems(storedItems);

        // Extract all unique tags
        const tags = new Set();
        storedItems.forEach(item => {
            if (item.tags) item.tags.forEach(t => tags.add(t));
        });
        setAllTags(Array.from(tags));
    };

    const handleSaveEntry = async (e) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        let updatedItems;
        
        // 1. Process AI Action Items (if any checkboxes [ ] were used)
        const { cleanText, pendingActions } = processAIActionPlan(newItemText);

        // 2. Construct Entry Object
        const entryData = {
            text: cleanText,
            mood: currentMood,
            weather: weather, 
            tags: journalTags || [],
            timestamp: new Date().toISOString()
        };

        if (isEditing) {
            updatedItems = items.map(item => 
                item.id === editItemId ? { ...item, ...entryData, id: item.id } : item
            );
            setIsEditing(false);
            setEditItemId(null);
        } else {
            const newItem = {
                id: DataStore.generateId(),
                ...entryData
            };
            updatedItems = [newItem, ...items];
        }

        // 3. Handle Action Plan items (Save to Goals)
        if (pendingActions.length > 0) {
            const currentGoals = await DataStore.load(DataStore.KEYS.GOALS) || [];
            const newGoals = pendingActions.map(actionText => ({
                id: DataStore.generateId(),
                text: actionText,
                completed: false,
                createdAt: new Date().toISOString(),
                source: 'journal_ai'
            }));
            await DataStore.save(DataStore.KEYS.GOALS, [...currentGoals, ...newGoals]);
            alert(`Saved ${pendingActions.length} action items to your To-Do List!`);
        }

        await DataStore.save(DataStore.KEYS.JOURNAL, updatedItems);
        setItems(updatedItems);
        
        // Reset Form
        setNewItemText('');
        setCurrentMood(0);
        setWeather(''); 
        setJournalTags([]);
        setShowGeminiHelper(false);
        setActiveTab('history');
        
        // Refresh tags
        loadJournal();
    };

    const handleEdit = (item) => {
        setNewItemText(item.text);
        setCurrentMood(item.mood || 0);
        setWeather(item.weather || ''); 
        setJournalTags(item.tags || []);
        setIsEditing(true);
        setEditItemId(item.id);
        setActiveTab('write');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const updatedItems = items.filter(i => i.id !== itemToDelete);
        await DataStore.save(DataStore.KEYS.JOURNAL, updatedItems);
        setItems(updatedItems);
        setShowDeleteModal(false);
        setItemToDelete(null);
        loadJournal(); // Refresh tags
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditItemId(null);
        setNewItemText('');
        setCurrentMood(0);
        setWeather('');
        setJournalTags([]);
    };

    // Tag Handlers
    const handleAddTag = () => {
        if (tagInput.trim() && !journalTags.includes(tagInput.trim())) {
            setJournalTags([...journalTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setJournalTags(journalTags.filter(t => t !== tagToRemove));
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // --- NEW: Word Cloud Interactivity ---
    const handleWordClick = (word) => {
        setSearchQuery(word);
        setActiveTab('history');
        // Optional: Scroll to top of list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleApplyTemplate = (templateId) => {
        // Legacy prop handler if needed
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            
            {/* Tab Navigation */}
            <div className="flex p-1 bg-gray-200 rounded-xl">
                <button 
                    onClick={() => setActiveTab('write')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'write' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Write Entry
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    History
                </button>
                <button 
                    onClick={() => setActiveTab('insights')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'insights' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Insights
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-grow overflow-y-auto pb-20">
                {activeTab === 'write' && (
                    <JournalForm 
                        isEditing={isEditing}
                        editItemId={editItemId}
                        items={items}
                        handleCancelEdit={handleCancelEdit}
                        handleSaveEntry={handleSaveEntry}
                        newItemText={newItemText}
                        setNewItemText={setNewItemText}
                        currentMood={currentMood}
                        setCurrentMood={setCurrentMood}
                        weather={weather}        
                        setWeather={setWeather}  
                        currentEntryTags={journalTags}
                        tagInput={tagInput}
                        setTagInput={setTagInput}
                        handleTagInputKeyDown={handleTagInputKeyDown}
                        handleAddTag={handleAddTag}
                        handleRemoveTag={handleRemoveTag}
                        allTags={allTags}
                        showGeminiHelper={showGeminiHelper}
                        setShowGeminiHelper={setShowGeminiHelper}
                        selectedTemplateId="" 
                        setSelectedTemplateId={() => {}} 
                        handleApplyTemplate={() => {}}
                    />
                )}

                {activeTab === 'history' && (
                    <JournalList 
                        items={items}
                        onEdit={handleEdit}
                        onDelete={(id) => { setItemToDelete(id); setShowDeleteModal(true); }}
                        filterTag={filterTag}
                        setFilterTag={setFilterTag}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        allTags={allTags}
                    />
                )}

                {/* UPDATED INSIGHTS TAB */}
                {activeTab === 'insights' && (
                    <div className="space-y-6">
                        {/* 1. Mood Graph */}
                        <div className="h-[400px]">
                            <MoodGraph items={items} />
                        </div>
                        
                        {/* 2. Word Cloud */}
                        <WordCloudView items={items} onWordClick={handleWordClick} />
                    </div>
                )}
            </div>

            <JournalModals 
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                confirmDelete={confirmDelete}
            />
        </div>
    );
};

export default DailyJournal;