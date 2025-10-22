import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner, DebouncedTextarea, GeminiJournalHelper } from './common.jsx';
import { journalTemplates } from '../utils/data.js';
import { ArrowLeftIcon, EditIcon, TrashIcon, SparklesIcon, CheckIcon } from '../utils/icons.jsx';

// Journal is the only module that uses the multi-view logic requested by the user.
export const DailyJournal = ({ journalTemplate, setJournalTemplate }) => {
    const storageKey = LocalDataStore.KEYS.JOURNAL;
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showGeminiHelper, setShowGeminiHelper] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    
    // View state for Journal: 'list' or 'form'
    const [viewMode, setViewMode] = useState('list');

    // State for editing an existing item in the form view
    const [isEditingExisting, setIsEditingExisting] = useState(false);
    const [itemToEditId, setItemToEditId] = useState(null);

    // --- Persistence & Loading ---

    const saveItemsToLocal = useCallback((updatedItems) => {
        const sortAndSet = updatedItems.sort((a, b) => (b.timestamp.getTime()) - (a.timestamp.getTime()));
        setItems(sortAndSet);
        const serializableItems = sortAndSet.map(item => ({
            ...item,
            timestamp: item.timestamp.toISOString()
        }));
        LocalDataStore.save(storageKey, serializableItems);
    }, [storageKey]);

    useEffect(() => {
        const loadedItems = LocalDataStore.load(storageKey);
        const formattedItems = loadedItems.map(item => ({
            ...item,
            timestamp: item.timestamp ? new Date(item.timestamp) : new Date(0)
        })).sort((a, b) => (b.timestamp.getTime()) - (a.timestamp.getTime()));

        setItems(formattedItems);
        setIsLoading(false);
    }, [storageKey]);
    
    // Handle template injection from outside (e.g., Coping Cards)
    useEffect(() => {
        if (journalTemplate && setJournalTemplate) {
            setNewItem(journalTemplate);
            setJournalTemplate(''); 
            setViewMode('form'); 
        }
    }, [journalTemplate, setJournalTemplate]);

    // --- CRUD Handlers ---

    const handleApplyTemplate = () => {
        const templateObj = journalTemplates.find(t => t.id === selectedTemplateId);
        if (templateObj && templateObj.template) {
            setNewItem(templateObj.template);
        }
        setSelectedTemplateId('');
    };

    const handleStartEdit = (item) => {
        setItemToEditId(item.id);
        setNewItem(item.text);
        setIsEditingExisting(true);
        setViewMode('form'); 
    };

    const handleCancelEdit = () => {
        setItemToEditId(null);
        setNewItem('');
        setIsEditingExisting(false);
        setViewMode('list'); 
    };

    const handleDeleteItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        saveItemsToLocal(updatedItems);
    };

    const handleSaveEntry = (e) => {
        e.preventDefault();
        if (newItem.trim() === '') return;
        
        if (isEditingExisting && itemToEditId) {
            // Update existing
            const updatedItems = items.map(item => 
                item.id === itemToEditId ? { ...item, text: newItem, timestamp: new Date() } : item
            );
            saveItemsToLocal(updatedItems);
            setItemToEditId(null);
            setIsEditingExisting(false);
        } else {
            // Add new
            const newItemObject = { 
                id: LocalDataStore.generateId(), 
                text: newItem, 
                timestamp: new Date()
            };
            saveItemsToLocal([newItemObject, ...items]);
        }
        
        setNewItem('');
        setViewMode('list');
    };

    // --- Views ---

    const JournalListView = () => (
        <div className="flex-grow overflow-y-auto pr-2 -mr-2 mt-4">
            <button 
                onClick={() => setViewMode('form')} 
                className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 mb-6 transition-colors"
            >
                Add New Entry
            </button>
            {isLoading ? <Spinner /> : (items.length > 0 ? ( 
                <ul className="space-y-3"> 
                    {items.map(item => ( 
                        <li key={item.id} className="p-3 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center transition-colors hover:bg-gray-100">
                            <div className="flex-grow">
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
                        </li>
                    ))} 
                </ul> 
            ) : ( 
                <div className="text-center py-10">
                    <p className="text-gray-500">No journal entries yet. Tap below to start.</p>
                    <button 
                        onClick={() => setViewMode('form')} 
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
            <form onSubmit={handleSaveEntry} className="mb-2 space-y-2">
                
                {isEditingExisting && (
                    <div className="flex justify-between items-center bg-teal-50 p-3 rounded-lg mb-4">
                        <p className="text-sm font-semibold text-teal-700">
                            Editing Entry from: {items.find(i => i.id === itemToEditId)?.timestamp.toLocaleString()}
                        </p>
                    </div>
                )}
                
                {!isEditingExisting && (
                    <div className="flex gap-2">
                        <select 
                            value={selectedTemplateId} 
                            onChange={(e) => setSelectedTemplateId(e.target.value)} 
                            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                        >
                            {journalTemplates.map(template => (
                                <option key={template.id} value={template.id} disabled={!template.id ? true : false}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        <button 
                            type="button" 
                            onClick={handleApplyTemplate} 
                            disabled={!selectedTemplateId} 
                            className="flex-shrink-0 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-400 flex items-center gap-1 transition-colors"
                        >
                            <CheckIcon className="w-4 h-4" /> Apply
                        </button>
                    </div>
                )}

                <DebouncedTextarea
                    value={newItem}
                    onChange={setNewItem} 
                    placeholder="Write your entry..."
                    rows="10" 
                    isInput={false}
                />

                <div className={`flex justify-end gap-2`}>
                    <button 
                        type="button" 
                        onClick={handleCancelEdit} 
                        className="flex-grow bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                    >
                        {isEditingExisting ? 'Discard Changes' : 'Cancel'}
                    </button>
                    <button type="submit" className={`flex-grow bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors`}>
                        {isEditingExisting ? 'Save Changes' : 'Add New Entry'}
                    </button>
                </div>
            </form>
            
            <button onClick={() => setShowGeminiHelper(!showGeminiHelper)} className="flex items-center justify-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-semibold mt-4">
                <SparklesIcon className="w-5 h-5"/> {showGeminiHelper ? 'Close AI Helper' : 'Get Idea with AI'}
            </button> 
            {showGeminiHelper && <GeminiJournalHelper onInsertText={(text) => setNewItem(text)} onClose={() => setShowGeminiHelper(false)} />} 
        </>
    );

    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col"> 
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Journal</h2> 
            <p className="text-gray-600 mb-6">How are you feeling? You can write about your day, feelings, or things you are grateful for.</p> 
            
            {viewMode === 'list' ? JournalListView() : JournalForm()}
        </div> 
    );
};
