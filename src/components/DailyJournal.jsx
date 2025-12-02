import React, { useState, useEffect, useCallback } from 'react';
import DataStore from '../utils/dataStore.js';
import { journalTemplates } from '../utils/data.js';
import { model } from '../firebase.jsx';

// Import Refactored Components
import JournalForm from './journal/JournalForm.jsx';
import JournalListView from './journal/JournalList.jsx';
import MoodGraphView from './journal/MoodGraph.jsx';
import { InsightsModal, AnalysisConfigModal } from './journal/JournalModals.jsx';

const DailyJournal = ({ journalTemplate, setJournalTemplate, journalTags, setJournalTags }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'graph'
    const [newItemText, setNewItemText] = useState('');
    const [currentMood, setCurrentMood] = useState(0); 
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [showGeminiHelper, setShowGeminiHelper] = useState(false);

    // AI Insights State
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showInsightsModal, setShowInsightsModal] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [aiInsights, setAiInsights] = useState('');

    // Editing & Tagging State
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [allTags, setAllTags] = useState([]);
    const [currentEntryTags, setCurrentEntryTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // --- Data Loading & Management ---
    const saveItemsToStore = useCallback(async (updatedItems) => {
        const sortedItems = updatedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setItems(sortedItems);
        await DataStore.save(DataStore.KEYS.JOURNAL, sortedItems);
    }, []);

    const saveAllTagsToStore = useCallback(async (updatedTags) => {
        const sortedTags = [...new Set(updatedTags)].sort();
        setAllTags(sortedTags);
        await DataStore.save(DataStore.KEYS.JOURNAL_TAGS, sortedTags);
    }, []);

    useEffect(() => {
        const loadJournalData = async () => {
            setIsLoading(true);
            const loadedItems = await DataStore.load(DataStore.KEYS.JOURNAL) || [];
            const loadedTags = await DataStore.load(DataStore.KEYS.JOURNAL_TAGS) || [];
            setItems(loadedItems);
            setAllTags(loadedTags.sort());
            setIsLoading(false);
        };
        loadJournalData();
    }, []);
    
    // Handle External Triggers (e.g. from Dashboard or Tools)
    useEffect(() => {
        if (journalTemplate) {
            setIsEditing(false);
            setEditItemId(null);
            setNewItemText(journalTemplate);
            setCurrentEntryTags(journalTags || []);
            setCurrentMood(0);
            setViewMode('form');
            setJournalTemplate('');
            if (setJournalTags) setJournalTags([]);
        }
    }, [journalTemplate, journalTags, setJournalTemplate, setJournalTags]);

    // --- UI Handlers ---
    const handleShowNewForm = () => {
        setIsEditing(false);
        setEditItemId(null);
        setNewItemText('');
        setCurrentEntryTags([]);
        setCurrentMood(0);
        setViewMode('form');
    };

    const handleStartEdit = (item) => {
        setEditItemId(item.id);
        setNewItemText(item.text);
        setCurrentEntryTags(item.tags || []);
        setCurrentMood(item.mood || 0);
        setIsEditing(true);
        setViewMode('form');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditItemId(null);
        setNewItemText('');
        setCurrentEntryTags([]);
        setCurrentMood(0);
        setViewMode('list');
    };

    const handleDeleteItem = async (id) => {
        await saveItemsToStore(items.filter(item => item.id !== id));
    };

    const handleApplyTemplate = () => {
        const templateObj = journalTemplates.find(t => t.id === selectedTemplateId);
        if (templateObj) {
            setNewItemText(templateObj.template);
            let tagsToAdd = [];
            if (templateObj.name === '3-Part Gratitude Check') tagsToAdd.push('gratitude');
            if (templateObj.name === 'Resentment Filter') tagsToAdd.push('resentments');

            if (tagsToAdd.length > 0) {
                setCurrentEntryTags(prev => {
                    const newTags = tagsToAdd.filter(t => !prev.includes(t));
                    return [...prev, ...newTags];
                });
            }
        }
        setSelectedTemplateId('');
    };

    // --- AI Logic ---
    const handleRunAnalysis = async (startDate, endDate, selectedTags) => {
        setShowConfigModal(false);
        setIsGeneratingInsights(true);
        setShowInsightsModal(true);
        setAiInsights('');

        const start = new Date(startDate); start.setHours(0, 0, 0, 0);
        const end = new Date(endDate); end.setHours(23, 59, 59, 999);

        const filteredEntries = items.filter(item => {
            const itemDate = new Date(item.timestamp);
            const matchesDate = itemDate >= start && itemDate <= end;
            const matchesTags = selectedTags.length === 0 ? true : item.tags?.some(t => selectedTags.includes(t));
            return matchesDate && matchesTags;
        });
        
        const recentEntries = filteredEntries.slice(0, 20); // Limit context
        
        if (recentEntries.length === 0) {
            setAiInsights("I couldn't find any journal entries matching your filters.");
            setIsGeneratingInsights(false);
            return;
        }

        const entriesText = recentEntries.map(entry => 
            `Date: ${new Date(entry.timestamp).toLocaleDateString()}\nMood: ${entry.mood}/10\nTags: ${entry.tags?.join(', ')}\nContent: "${entry.text}"`
        ).join('\n---\n');

        const prompt = `You are an empathetic recovery companion. Analyze the following journal entries... \n\n${entriesText}`; // Truncated prompt for brevity

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            setAiInsights(response.text());
        } catch (error) {
            console.error("AI Error:", error);
            setAiInsights("Sorry, I was unable to analyze your entries at this time.");
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    // --- Tag Handlers ---
    const handleAddTag = async () => {
        const newTag = tagInput.trim().toLowerCase();
        if (newTag && !currentEntryTags.includes(newTag)) {
            setCurrentEntryTags([...currentEntryTags, newTag]);
            if (!allTags.includes(newTag)) {
                await saveAllTagsToStore([...allTags, newTag]);
            }
        }
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove) => setCurrentEntryTags(currentEntryTags.filter(tag => tag !== tagToRemove));
    const handleTagInputKeyDown = (e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } };

    // --- Save Handler ---
    const handleSaveEntry = async (e) => {
        e.preventDefault();
        if (currentMood === 0) {
            window.alert("Please set the mood indicator to save your entry.");
            return;
        }
        if (newItemText.trim() === '') return;

        const entryData = {
            text: newItemText,
            tags: currentEntryTags,
            mood: currentMood,
            timestamp: new Date().toISOString()
        };

        if (isEditing && editItemId) {
            await saveItemsToStore(items.map(item => item.id === editItemId ? { ...item, ...entryData } : item));
        } else {
            const newTagsForMasterList = currentEntryTags.filter(t => !allTags.includes(t));
            if (newTagsForMasterList.length > 0) await saveAllTagsToStore([...allTags, ...newTagsForMasterList]);
            await saveItemsToStore([{ id: DataStore.generateId(), ...entryData }, ...items]);
        }
        handleCancelEdit();
    };

    // --- Render ---
    const renderContent = () => {
        switch (viewMode) {
            case 'form':
                return <JournalForm
                    isEditing={isEditing}
                    editItemId={editItemId}
                    items={items}
                    handleCancelEdit={handleCancelEdit}
                    handleSaveEntry={handleSaveEntry}
                    newItemText={newItemText}
                    setNewItemText={setNewItemText}
                    currentMood={currentMood}
                    setCurrentMood={setCurrentMood}
                    selectedTemplateId={selectedTemplateId}
                    setSelectedTemplateId={setSelectedTemplateId}
                    handleApplyTemplate={handleApplyTemplate}
                    currentEntryTags={currentEntryTags}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    handleTagInputKeyDown={handleTagInputKeyDown}
                    handleAddTag={handleAddTag}
                    handleRemoveTag={handleRemoveTag}
                    allTags={allTags}
                    showGeminiHelper={showGeminiHelper}
                    setShowGeminiHelper={setShowGeminiHelper}
                />;
            case 'graph':
                return <MoodGraphView items={items} onBack={() => setViewMode('list')} onPointClick={(entry) => handleStartEdit(entry)} />;
            case 'list':
            default:
                return <JournalListView
                    isLoading={isLoading}
                    items={items}
                    handleShowNewForm={handleShowNewForm}
                    handleStartEdit={handleStartEdit}
                    handleDeleteItem={handleDeleteItem}
                    setViewMode={setViewMode}
                    onOpenAnalysisConfig={() => setShowConfigModal(true)}
                />;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <AnalysisConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} onAnalyze={handleRunAnalysis} allTags={allTags} />
            {showInsightsModal && <InsightsModal onClose={() => setShowInsightsModal(false)} isLoading={isGeneratingInsights} insights={aiInsights} />}
            
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4">Daily Journal</h2>
            <p className="text-deep-charcoal/70 mb-6">How are you feeling? You can write about your day, feelings, or things you are grateful for.</p>
            {renderContent()}
        </div>
    );
};

export default DailyJournal;