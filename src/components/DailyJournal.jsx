// src/components/DailyJournal.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import JournalForm from './journal/JournalForm.jsx';
import JournalList from './journal/JournalList.jsx';
import MoodGraph from './journal/MoodGraph.jsx';
import WordCloudView from './journal/WordCloudView.jsx';
import JournalModals, { InsightsModal } from './journal/JournalModals.jsx';
import { processAIActionPlan } from '../utils/journalLogger.js';
import { SparklesIcon } from '../utils/icons.jsx';

// Shared AI Logic
import { generateContentWithFallback } from '../firebase.jsx';
import { parseAIResponse, createActionItemObject } from '../utils/aiService.js';

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
    
    // Date Range State: Defaults to Last 30 Days (Local Time)
    const [dateRange, setDateRange] = useState(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        // Helper to format YYYY-MM-DD in local time
        const formatLocal = (d) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };

        return { start: formatLocal(thirtyDaysAgo), end: formatLocal(today) };
    });
    
    // Tag Management
    const [tagInput, setTagInput] = useState('');
    const [allTags, setAllTags] = useState([]);

    // Modals
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // --- AI Analysis State ---
    const [showInsightsResult, setShowInsightsResult] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [suggestedActions, setSuggestedActions] = useState([]);

    useEffect(() => {
        loadJournal();
    }, []);

    // Handle Template Props
    useEffect(() => {
        if (journalTemplate) {
            setNewItemText(journalTemplate);
            setJournalTemplate(''); 
            setActiveTab('write');
        }
        if (journalTags && journalTags.length > 0) {
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

    // --- COMPUTED: Filtered Items ---
    const filteredItems = items.filter(item => {
        // 1. Tag Filter
        const matchesTag = filterTag === 'All' || (item.tags && item.tags.includes(filterTag));
        
        // 2. Search Filter (Text or Tags)
        const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
        
        // 3. Date Range Filter
        let matchesDate = true;
        if (dateRange.start || dateRange.end) {
            const itemDate = new Date(item.timestamp);
            itemDate.setHours(0, 0, 0, 0);

            if (dateRange.start) {
                const [sy, sm, sd] = dateRange.start.split('-').map(Number);
                const startDate = new Date(sy, sm - 1, sd);
                if (itemDate < startDate) matchesDate = false;
            }
            if (dateRange.end) {
                const [ey, em, ed] = dateRange.end.split('-').map(Number);
                const endDate = new Date(ey, em - 1, ed);
                endDate.setHours(23, 59, 59, 999);
                if (itemDate > endDate) matchesDate = false;
            }
        }

        return matchesTag && matchesSearch && matchesDate;
    });

    const handleSaveEntry = async (e) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        let updatedItems;
        
        const { cleanText, pendingActions } = processAIActionPlan(newItemText);

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

        if (pendingActions.length > 0) {
            const currentGoals = await DataStore.load(DataStore.KEYS.GOALS) || [];
            const newGoals = pendingActions.map(actionText => createActionItemObject(actionText, 'journal'));
            await DataStore.save(DataStore.KEYS.GOALS, [...currentGoals, ...newGoals]);
            alert(`Saved ${pendingActions.length} action items to your To-Do List!`);
        }

        await DataStore.save(DataStore.KEYS.JOURNAL, updatedItems);
        setItems(updatedItems);
        
        setNewItemText('');
        setCurrentMood(0);
        setWeather(''); 
        setJournalTags([]);
        setShowGeminiHelper(false);
        setActiveTab('history');
        
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
        loadJournal(); 
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditItemId(null);
        setNewItemText('');
        setCurrentMood(0);
        setWeather('');
        setJournalTags([]);
    };

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

    const handleWordClick = (word) => {
        setSearchQuery(word);
        setActiveTab('history');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- AI ANALYSIS HANDLER ---
    const handleQuickAnalysis = async () => {
        if (filteredItems.length === 0) {
            alert("No entries visible to analyze. Please adjust your filters.");
            return;
        }

        setIsAnalyzing(true);
        setShowInsightsResult(true);
        setAnalysisResult('');
        setSuggestedActions([]);

        const contextText = filteredItems.map(i => 
            `Date: ${new Date(i.timestamp).toDateString()}\nMood: ${i.mood}/10\nTags: ${i.tags?.join(', ')}\nContent: ${i.text}`
        ).join('\n---\n');

        const prompt = `You are a recovery companion AI. Analyze these specific journal entries provided below.
        
        Entries:
        ${contextText}

        Identify emotional patterns, triggers, and victories within this specific set of entries.
        IMPORTANT: At the very end, provide a section titled "SUGGESTED_ACTIONS" followed by exactly 3 short, concrete, actionable bullet points for their recovery.`;

        try {
            const result = await generateContentWithFallback(prompt);
            const rawText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
            
            const { insights, actions } = parseAIResponse(rawText);

            setAnalysisResult(insights || "I couldn't generate insights this time.");
            setSuggestedActions(actions);

        } catch (error) {
            console.error("Analysis failed", error);
            setAnalysisResult("Sorry, I couldn't complete the analysis. Please check your connection.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveAnalysisActions = async (actionsToSave) => {
        const currentGoals = await DataStore.load(DataStore.KEYS.GOALS) || [];
        let updatedGoals = [...currentGoals];
        
        for (const actionText of actionsToSave) {
            const existing = updatedGoals.find(g => g.text.toLowerCase() === actionText.toLowerCase());
            
            if (!existing || window.confirm(`"${actionText}" is already on your list. Add it again?`)) {
                const newTask = createActionItemObject(actionText, 'journal');
                updatedGoals.push(newTask);
            }
        }
        
        await DataStore.save(DataStore.KEYS.GOALS, updatedGoals);
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
                        setJournalTags={setJournalTags}
                        tagInput={tagInput}
                        setTagInput={setTagInput}
                        handleTagInputKeyDown={handleTagInputKeyDown}
                        handleAddTag={handleAddTag}
                        handleRemoveTag={handleRemoveTag}
                        allTags={allTags}
                        showGeminiHelper={showGeminiHelper}
                        setShowGeminiHelper={setShowGeminiHelper}
                    />
                )}

                {activeTab === 'history' && (
                    <JournalList 
                        items={filteredItems} 
                        onEdit={handleEdit}
                        onDelete={(id) => { setItemToDelete(id); setShowDeleteModal(true); }}
                        filterTag={filterTag}
                        setFilterTag={setFilterTag}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onAnalyze={handleQuickAnalysis}
                        allTags={allTags}
                    />
                )}

                {activeTab === 'insights' && (
                    <div className="space-y-6">
                        <div className="h-[400px]">
                            <MoodGraph items={items} />
                        </div>
                        <WordCloudView items={items} onWordClick={handleWordClick} />
                    </div>
                )}
            </div>

            <JournalModals 
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                confirmDelete={confirmDelete}
            />

            {showInsightsResult && (
                <InsightsModal 
                    isLoading={isAnalyzing}
                    insights={analysisResult}
                    actions={suggestedActions}
                    onSaveActions={handleSaveAnalysisActions}
                    onClose={() => setShowInsightsResult(false)}
                />
            )}
        </div>
    );
};

export default DailyJournal;