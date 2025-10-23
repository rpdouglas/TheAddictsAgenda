import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataStore from '../utils/dataStore.js';
import { Spinner, DebouncedTextarea, GeminiJournalHelper } from './common.jsx';
import { journalTemplates } from '../utils/data.js';
import { ArrowLeftIcon, EditIcon, TrashIcon, SparklesIcon, CheckIcon, XIcon, TrendingUpIcon, PenIcon } from '../utils/icons.jsx';

// --- Mood Graph Component ---
const MoodGraphView = ({ items, onBack }) => {
    const moodData = useMemo(() => {
        return items
            .filter(item => typeof item.mood === 'number')
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }, [items]);

    if (moodData.length < 2) {
        return (
            <div className="flex flex-col h-full">
                <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold flex-shrink-0">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Entries</span>
                </button>
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <TrendingUpIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-700">Not Enough Data</h3>
                    <p className="text-gray-500 mt-2">Record your mood on at least two journal entries to see your graph.</p>
                </div>
            </div>
        );
    }

    const PADDING = 40;
    const SVG_WIDTH = 500;
    const SVG_HEIGHT = 300;
    const chartWidth = SVG_WIDTH - PADDING * 2;
    const chartHeight = SVG_HEIGHT - PADDING * 2;

    const minTime = new Date(moodData[0].timestamp).getTime();
    const maxTime = new Date(moodData[moodData.length - 1].timestamp).getTime();
    const timeRange = maxTime - minTime || 1;

    const points = moodData.map(item => ({
        x: PADDING + ((new Date(item.timestamp).getTime() - minTime) / timeRange) * chartWidth,
        y: PADDING + chartHeight - ((item.mood - 1) / 9) * chartHeight, // Mood 1-10
        mood: item.mood,
        date: new Date(item.timestamp).toLocaleDateString()
    }));

    const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

    return (
        <div className="h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Entries</span>
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Mood Over Time</h3>
            <div className="w-full overflow-x-auto">
                 <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="min-w-[500px]">
                    <text x="15" y={PADDING} dy="5" textAnchor="middle" className="text-xs fill-gray-500">10</text>
                    <text x="15" y={PADDING + chartHeight / 2} dy="5" textAnchor="middle" className="text-xs fill-gray-500">5</text>
                    <text x="15" y={PADDING + chartHeight} dy="5" textAnchor="middle" className="text-xs fill-gray-500">1</text>
                    <text x={PADDING} y={SVG_HEIGHT - 10} textAnchor="start" className="text-xs fill-gray-500">{new Date(moodData[0].timestamp).toLocaleDateString()}</text>
                    <text x={SVG_WIDTH - PADDING} y={SVG_HEIGHT - 10} textAnchor="end" className="text-xs fill-gray-500">{new Date(moodData[moodData.length - 1].timestamp).toLocaleDateString()}</text>
                    <path d={pathData} fill="none" stroke="#14b8a6" strokeWidth="2" />
                    {points.map((p, i) => (
                        <g key={i}>
                            <circle cx={p.x} cy={p.y} r="8" fill="#14b8a6" fillOpacity="0.2" />
                            <circle cx={p.x} cy={p.y} r="4" fill="#14b8a6">
                                <title>{`Mood: ${p.mood} on ${p.date}`}</title>
                            </circle>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};


export const DailyJournal = ({ journalTemplate, setJournalTemplate }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');

    const [newItemText, setNewItemText] = useState('');
    const [currentMood, setCurrentMood] = useState(5);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [showGeminiHelper, setShowGeminiHelper] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editItemId, setEditItemId] = useState(null);

    const [allTags, setAllTags] = useState([]);
    const [currentEntryTags, setCurrentEntryTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

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
    
    useEffect(() => {
        if (journalTemplate && setJournalTemplate) {
            setIsEditing(false);
            setEditItemId(null);
            setNewItemText(journalTemplate);
            setCurrentEntryTags([]);
            setCurrentMood(5);
            setViewMode('form');
            setJournalTemplate(''); 
        }
    }, [journalTemplate, setJournalTemplate]);

    const handleShowNewForm = () => {
        setIsEditing(false);
        setEditItemId(null);
        setNewItemText('');
        setCurrentEntryTags([]);
        setCurrentMood(5);
        setViewMode('form');
    };

    const handleStartEdit = (item) => {
        setEditItemId(item.id);
        setNewItemText(item.text);
        setCurrentEntryTags(item.tags || []);
        setCurrentMood(item.mood || 5);
        setIsEditing(true);
        setViewMode('form'); 
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditItemId(null);
        setNewItemText('');
        setCurrentEntryTags([]);
        setCurrentMood(5);
        setViewMode('list'); 
    };

    const handleDeleteItem = async (id) => {
        await saveItemsToStore(items.filter(item => item.id !== id));
    };
    
    const handleApplyTemplate = () => {
        const templateObj = journalTemplates.find(t => t.id === selectedTemplateId);
        if (templateObj) setNewItemText(templateObj.template);
        setSelectedTemplateId('');
    };

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
    
    const handleRemoveTag = (tagToRemove) => {
        setCurrentEntryTags(currentEntryTags.filter(tag => tag !== tagToRemove));
    };
    
    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSaveEntry = async (e) => {
        e.preventDefault();
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
            await saveItemsToStore([{ id: DataStore.generateId(), ...entryData }, ...items]);
        }
        
        handleCancelEdit();
    };

    const renderContent = () => {
        switch (viewMode) {
            case 'form':
                return <JournalForm />;
            case 'graph':
                return <MoodGraphView items={items} onBack={() => setViewMode('list')} />;
            case 'list':
            default:
                return <JournalListView />;
        }
    };
    
    const JournalListView = () => (
        <div className="flex-grow overflow-y-auto pr-2 -mr-2 mt-4">
            <div className="flex gap-2 mb-6">
                <button 
                    onClick={handleShowNewForm} 
                    className="flex-grow bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                >
                    Add New Entry
                </button>
                 <button 
                    onClick={() => setViewMode('graph')} 
                    className="flex-shrink-0 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                    title="View Mood Graph"
                >
                    <TrendingUpIcon className="w-5 h-5"/>
                </button>
            </div>
            {isLoading ? <Spinner /> : (items.length > 0 ? ( 
                <ul className="space-y-4"> 
                    {items.map(item => ( 
                        <li key={item.id} className="p-4 bg-gray-50 rounded-lg shadow-sm transition-colors hover:bg-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-800 font-semibold">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0">
                                    <button onClick={() => handleStartEdit(item)} className="text-teal-600 hover:text-teal-800 text-sm font-semibold flex items-center gap-1 p-2 rounded-lg bg-white shadow-sm border border-gray-200">
                                        <EditIcon className="w-4 h-4" /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 p-2 rounded-lg bg-white shadow-sm border border-gray-200">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                             {(item.tags && item.tags.length > 0 || item.mood) && (
                                <div className="mt-3 flex flex-wrap gap-2 items-center">
                                    {item.mood && (
                                        <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            Mood: {item.mood}/10
                                        </span>
                                    )}
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-xs font-semibold bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))} 
                </ul> 
            ) : ( 
                <div className="text-center py-10">
                    <p className="text-gray-500">No journal entries yet. Tap below to start.</p>
                    <button 
                        onClick={handleShowNewForm} 
                        className="mt-4 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                    >
                        Start Your First Entry
                    </button>
                </div>
            ))}
        </div>
    );

    const JournalForm = () => (
        <>
            <button onClick={handleCancelEdit} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Entries List</span>
            </button>
            <form onSubmit={handleSaveEntry} className="mb-2 space-y-4">
                
                {isEditing && (
                    <div className="bg-teal-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-teal-700">
                            Editing Entry from: {new Date(items.find(i => i.id === editItemId)?.timestamp).toLocaleString()}
                        </p>
                    </div>
                )}
                
                {!isEditing && (
                    <div className="flex gap-2">
                        <select 
                            value={selectedTemplateId} 
                            onChange={(e) => setSelectedTemplateId(e.target.value)} 
                            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                        >
                            {journalTemplates.map(template => (
                                <option key={template.id} value={template.id} disabled={!template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        <button type="button" onClick={handleApplyTemplate} disabled={!selectedTemplateId} className="flex-shrink-0 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-400 flex items-center gap-1 transition-colors">
                            <CheckIcon className="w-4 h-4" /> Apply
                        </button>
                    </div>
                )}

                <DebouncedTextarea 
                    value={newItemText} 
                    onChange={setNewItemText} 
                    placeholder="Write your entry..." 
                    rows="10" 
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 resize-y min-h-[150px]"
                />

                <div className="p-3 border border-gray-200 rounded-lg space-y-2">
                     <label htmlFor="mood-slider" className="block text-sm font-semibold text-gray-700">
                        Today's Mood: <span className="font-bold text-teal-600">{currentMood} / 10</span>
                     </label>
                     <input
                        id="mood-slider"
                        type="range"
                        min="1"
                        max="10"
                        value={currentMood}
                        onChange={(e) => setCurrentMood(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                     />
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {currentEntryTags.map(tag => (
                            <div key={tag} className="flex items-center bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm font-medium">
                                <span>{tag}</span>
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-teal-600 hover:text-teal-800"><XIcon className="w-3 h-3"/></button>
                            </div>
                        ))}
                    </div>
                     <div className="flex gap-2">
                        <input type="text" list="all-tags-list" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} placeholder="Add a new tag..." className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm text-sm" />
                        <datalist id="all-tags-list">
                            {allTags.map(tag => <option key={tag} value={tag} />)}
                        </datalist>
                        <button type="button" onClick={handleAddTag} className="bg-gray-200 text-gray-700 font-semibold px-4 rounded-lg text-sm hover:bg-gray-300">Add</button>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={handleCancelEdit} className="flex-grow bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
                        {isEditing ? 'Discard Changes' : 'Cancel'}
                    </button>
                    <button type="submit" className="flex-grow bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                        {isEditing ? 'Save Changes' : 'Add New Entry'}
                    </button>
                </div>
            </form>
            
            <button onClick={() => setShowGeminiHelper(!showGeminiHelper)} className="flex items-center justify-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-semibold mt-4">
                <SparklesIcon className="w-5 h-5"/> {showGeminiHelper ? 'Close AI Helper' : 'Get Idea with AI'}
            </button> 
            {showGeminiHelper && <GeminiJournalHelper onInsertText={(text) => setNewItemText(text)} onClose={() => setShowGeminiHelper(false)} />} 
        </>
    );

    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col"> 
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Journal</h2> 
            <p className="text-gray-600 mb-6">How are you feeling? You can write about your day, feelings, or things you are grateful for.</p> 
            {renderContent()}
        </div> 
    );
};