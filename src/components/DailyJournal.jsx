// src/components/DailyJournal.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import JournalForm from './journal/JournalForm.jsx';
import JournalList from './journal/JournalList.jsx';
import MoodGraph from './journal/MoodGraph.jsx';
import WordCloudView from './journal/WordCloudView.jsx';
import JournalModals, { InsightsModal, AnalysisConfigModal } from './journal/JournalModals.jsx';
import { processAIActionPlan } from '../utils/journalLogger.js';
import { SparklesIcon } from '../utils/icons.jsx';

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

    // --- AI Analysis State ---
    const [showAnalysisConfig, setShowAnalysisConfig] = useState(false);
    const [showInsightsResult, setShowInsightsResult] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [suggestedActions, setSuggestedActions] = useState([]);

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
            await saveActionsToGoals(pendingActions);
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

    const saveActionsToGoals = async (actions) => {
        const currentGoals = await DataStore.load(DataStore.KEYS.GOALS) || [];
        const newGoals = actions.map(actionText => ({
            id: DataStore.generateId(),
            text: actionText,
            completed: false,
            createdAt: new Date().toISOString(),
            source: 'journal_ai'
        }));
        await DataStore.save(DataStore.KEYS.GOALS, [...currentGoals, ...newGoals]);
        alert(`Saved ${actions.length} action items to your To-Do List!`);
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

    const handleWordClick = (word) => {
        setSearchQuery(word);
        setActiveTab('history');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- AI ANALYSIS HANDLERS ---

    const handleRunAnalysis = async (startDate, endDate, selectedTags) => {
        setShowAnalysisConfig(false);
        setIsAnalyzing(true);
        setShowInsightsResult(true);

        // 1. Filter Items
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59); // Include full end day

        const analysisItems = items.filter(item => {
            const itemDate = new Date(item.timestamp);
            const inDateRange = itemDate >= start && itemDate <= end;
            const hasTag = selectedTags.length === 0 || (item.tags && item.tags.some(t => selectedTags.includes(t)));
            return inDateRange && hasTag;
        });

        if (analysisItems.length === 0) {
            setAnalysisResult("No journal entries found for this period/filter. Try adjusting your range.");
            setSuggestedActions([]);
            setIsAnalyzing(false);
            return;
        }

        // 2. Prepare Context
        const contextText = analysisItems.map(i => 
            `Date: ${new Date(i.timestamp).toDateString()}\nMood: ${i.mood}/10\nTags: ${i.tags?.join(', ')}\nContent: ${i.text}`
        ).join('\n---\n');

        // 3. Call AI (MOCK FOR NOW - Replace with real API call)
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock Response
            const mockInsights = `Based on your ${analysisItems.length} entries from ${startDate} to ${endDate}, here are some patterns:\n\n1. **Mood Trends**: Your mood seems to correlate with your "Meeting" tags. Days you attend meetings show a mood lift of about 2 points.\n\n2. **Key Themes**: "Anxiety" and "Work" appear frequently together. You often mention feeling overwhelmed on Tuesdays.\n\n3. **Victory**: You have consistently practiced gratitude this week. Keep it up!`;
            
            const mockActions = [
                "Schedule a meeting for next Tuesday",
                "Practice box breathing when work gets stressful",
                "Call a friend to discuss work anxiety"
            ];

            setAnalysisResult(mockInsights);
            setSuggestedActions(mockActions);

        } catch (error) {
            console.error("Analysis failed", error);
            setAnalysisResult("Sorry, I couldn't complete the analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveAnalysisActions = async (actionsToSave) => {
        await saveActionsToGoals(actionsToSave);
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
                        // FIX: Removed the overriding props here so JournalForm uses internal state
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

                {activeTab === 'insights' && (
                    <div className="space-y-6">
                        
                        {/* --- NEW: AI Analysis Trigger Card --- */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                    <SparklesIcon className="w-5 h-5 text-yellow-300"/> 
                                    AI Recovery Analysis
                                </h3>
                                <p className="text-blue-100 text-sm mb-4 max-w-sm">
                                    Analyze your journal history to find emotional patterns, triggers, and suggested actions.
                                </p>
                                <button 
                                    onClick={() => setShowAnalysisConfig(true)}
                                    className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    Generate Report
                                </button>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        </div>

                        {/* 1. Mood Graph */}
                        <div className="h-[400px]">
                            <MoodGraph items={items} />
                        </div>
                        
                        {/* 2. Word Cloud */}
                        <WordCloudView items={items} onWordClick={handleWordClick} />
                    </div>
                )}
            </div>

            {/* --- MODALS --- */}
            <JournalModals 
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                confirmDelete={confirmDelete}
            />

            <AnalysisConfigModal 
                isOpen={showAnalysisConfig}
                onClose={() => setShowAnalysisConfig(false)}
                onAnalyze={handleRunAnalysis}
                allTags={allTags}
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