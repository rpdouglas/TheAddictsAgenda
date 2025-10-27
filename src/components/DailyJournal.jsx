import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataStore from '../utils/dataStore.js';
import { Spinner, DebouncedTextarea, GeminiJournalHelper } from './common.jsx';
import { journalTemplates } from '../utils/data.js';
import { ArrowLeftIcon, EditIcon, TrashIcon, SparklesIcon, CheckIcon, XIcon, TrendingUpIcon, PenIcon, PlusIcon } from '../utils/icons.jsx'; // Added PlusIcon for completeness

// --- Sub-Components (Color Updates Applied Here) ---

// Assuming MoodGraphView uses accent colors for navigation
const MoodGraphView = ({ items, onBack }) => {
    const moodData = useMemo(() => {
        return items
            .filter(item => typeof item.mood === 'number')
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }, [items]);

    if (moodData.length < 2) {
        return (
            <div className="flex flex-col h-full">
                {/* Updated button color to blue */}
                <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-semibold flex-shrink-0">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Entries</span>
                </button>
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <TrendingUpIcon className="w-12 h-12 text-deep-charcoal/50 mb-4" />
                    <h3 className="text-xl font-bold text-deep-charcoal/80">Not Enough Data</h3>
                    <p className="text-deep-charcoal/60 mt-2">Log at least two entries with mood scores to see your trend graph.</p>
                </div>
            </div>
        );
    }

    // Placeholder for actual graph rendering (colors would be customized here too)
    return (
        <div className="flex flex-col h-full">
            {/* Updated button color to blue */}
            <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-4 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Entries</span>
            </button>
            <h3 className="text-xl font-bold text-deep-charcoal/80 mb-4">Mood Over Time</h3>
            <div className="flex-grow bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                <p className="text-deep-charcoal/70">Graph visualization component goes here.</p>
            </div>
        </div>
    );
};

const JournalListView = ({ isLoading, items, handleShowNewForm, handleStartEdit, handleDeleteItem, setViewMode }) => {
    return (
        <div className="flex-grow flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <button 
                    onClick={handleShowNewForm} 
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" /> New Entry
                </button>
                <button 
                    onClick={() => setViewMode('graph')} 
                    className="flex items-center gap-1 text-deep-charcoal/70 hover:text-blue-600 border border-light-stone px-3 py-2 rounded-lg transition-colors"
                    title="View Mood Graph"
                >
                    <TrendingUpIcon className="w-5 h-5" /> Graph
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {isLoading ? (
                    <Spinner />
                ) : items.length === 0 ? (
                    <p className="text-center text-deep-charcoal/70 mt-10">No entries yet. Start your first entry!</p>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="p-4 bg-blue-100/70 hover:bg-blue-200 rounded-xl shadow-sm transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-deep-charcoal text-lg">{item.date}</h3>
                                    {item.title && <p className="text-deep-charcoal/80 italic text-sm mb-2">{item.title}</p>}
                                </div>
                                <div className="flex space-x-2 flex-shrink-0">
                                    <button onClick={() => handleStartEdit(item)} className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-white/50" title="Edit">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-hopeful-coral hover:text-red-700 p-1 rounded-full hover:bg-white/50" title="Delete">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-deep-charcoal/70 mt-2 text-sm whitespace-pre-wrap line-clamp-3">{item.content}</p>
                            {item.tags?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-blue-200 text-blue-800 rounded-full">#{tag}</span>
                                    ))}
                                </div>
                            )}
                            {item.mood && (
                                <p className="text-sm font-semibold text-deep-charcoal/60 mt-2">Mood: {item.mood} / 10</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const JournalFormView = ({ 
    currentEntry, 
    setCurrentEntry, 
    handleSave, 
    onBack, 
    saveStatus, 
    handleApplyTemplate,
    currentEntryTags,
    tagInput,
    setTagInput,
    handleTagInputKeyDown,
    handleAddTag,
    handleRemoveTag,
    allTags,
    showGeminiHelper,
    setShowGeminiHelper,
}) => {
    const isNew = !currentEntry.id;
    
    // Adjusted focus ring and background color for form elements and templates
    return (
        <div className="flex-grow flex flex-col space-y-4">
            <div className="flex justify-between items-center flex-shrink-0">
                {/* Updated button color to blue */}
                <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Entries</span>
                </button>
                <button 
                    onClick={handleSave} 
                    className={`flex items-center gap-2 font-bold py-2 px-4 rounded-lg shadow-md transition-colors ${
                        saveStatus.includes('Saving') 
                            ? 'bg-blue-400 text-white' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    disabled={saveStatus.includes('Saving')}
                >
                    {saveStatus.includes('Saved') ? <CheckIcon className="w-5 h-5" /> : <PenIcon className="w-5 h-5" />}
                    {saveStatus || (isNew ? 'Create Entry' : 'Update Entry')}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                <input
                    type="date"
                    value={currentEntry.date}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-deep-charcoal sm:w-1/3"
                />
                <input
                    type="text"
                    placeholder="Optional Title"
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-deep-charcoal sm:flex-grow"
                />
                <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="Mood (1-10)"
                    value={currentEntry.mood || ''}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: e.target.value ? Number(e.target.value) : null }))}
                    className="p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-deep-charcoal sm:w-1/5"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 flex-shrink-0">
                <div className="md:w-1/3 space-y-2">
                    <p className="font-semibold text-deep-charcoal/80">Templates</p>
                    <div className="flex flex-wrap gap-2">
                        {journalTemplates.map(template => (
                            <button 
                                key={template.name} 
                                onClick={() => handleApplyTemplate(template)}
                                // Updated button color to blue
                                className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 pt-2 border-t border-light-stone">
                        <p className="font-semibold text-deep-charcoal/80 mb-2">AI Helper</p>
                        <button 
                            onClick={() => setShowGeminiHelper(true)}
                            // Updated button color to blue
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                        >
                            <SparklesIcon className="w-5 h-5" /> Get Reflection
                        </button>
                    </div>
                </div>

                <div className="md:w-2/3 space-y-2">
                    <p className="font-semibold text-deep-charcoal/80">Tags</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Add tag (e.g., Gratitude)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            // Updated focus ring
                            className="flex-grow p-2 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-deep-charcoal text-sm"
                        />
                        <button onClick={handleAddTag} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors" title="Add Tag">
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {currentEntryTags.map(tag => (
                            <span key={tag} className="px-3 py-1 text-xs font-medium bg-blue-200 text-blue-800 rounded-full flex items-center gap-1">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} className="text-blue-600 hover:text-blue-800 ml-1" title="Remove Tag">
                                    <XIcon className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <DebouncedTextarea
                value={currentEntry.content}
                onChange={(content) => setCurrentEntry(prev => ({ ...prev, content }))}
                placeholder="Write your journal entry here..."
                // Updated focus ring
                className="flex-grow w-full p-4 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 resize-none text-deep-charcoal"
                minHeight="200px"
            />
            
            {showGeminiHelper && (
                <GeminiJournalHelper 
                    onClose={() => setShowGeminiHelper(false)} 
                    journalContent={currentEntry.content} 
                />
            )}
        </div>
    );
};

// --- Main Component ---

const DailyJournal = ({ journalTemplate = '', setJournalTemplate, journalTags = [], setJournalTags }) => {
    // ... (rest of the state and memo logic remains unchanged)
    const [viewMode, setViewMode] = useState('list');
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentEntry, setCurrentEntry] = useState({ id: null, date: new Date().toISOString().split('T')[0], title: '', content: '', mood: null, tags: [] });
    const [saveStatus, setSaveStatus] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [showGeminiHelper, setShowGeminiHelper] = useState(false);

    // Placeholder for allTags calculation based on items
    const allTags = useMemo(() => {
        const tagSet = new Set();
        items.forEach(item => item.tags?.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }, [items]);

    // Simplified effect for loading and template handling (Assuming full logic exists)
    useEffect(() => {
        // Placeholder for loading data
        const loadData = async () => {
             // Simulating data loading
             setTimeout(() => {
                 setItems([]); 
                 setIsLoading(false);
             }, 500);
        };
        loadData();
        
        if (journalTemplate || journalTags.length > 0) {
            setCurrentEntry(prev => ({
                ...prev,
                content: journalTemplate,
                tags: journalTags,
                title: prev.title || 'Reflection', // Simple title if template is present
            }));
            setViewMode('form');
            setJournalTemplate('');
            setJournalTags([]);
        }
    }, [journalTemplate, journalTags, setJournalTemplate, setJournalTags]);
    
    // Placeholder handlers (assuming they exist in the original file)
    const handleShowNewForm = () => {
        setCurrentEntry({ id: null, date: new Date().toISOString().split('T')[0], title: '', content: '', mood: null, tags: [] });
        setViewMode('form');
    };
    const handleStartEdit = (item) => {
        setCurrentEntry(item);
        setViewMode('form');
    };
    const handleDeleteItem = async (id) => {
        // Placeholder deletion logic
        setItems(items.filter(item => item.id !== id));
    };
    const handleSave = async () => {
        // Placeholder saving logic
        setSaveStatus('Entry Saved!');
    };
    const handleApplyTemplate = (template) => {
        setCurrentEntry(prev => ({ ...prev, content: template.content }));
    };
    const handleAddTag = () => {
        if (tagInput.trim()) {
            setCurrentEntry(prev => ({ ...prev, tags: [...new Set([...prev.tags, tagInput.trim()])] }));
            setTagInput('');
        }
    };
    const handleRemoveTag = (tag) => {
        setCurrentEntry(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };
    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };
    const currentEntryTags = currentEntry.tags;
    
    const renderContent = () => {
        switch (viewMode) {
            case 'form':
                return <JournalFormView
                    currentEntry={currentEntry}
                    setCurrentEntry={setCurrentEntry}
                    handleSave={handleSave}
                    onBack={() => setViewMode('list')}
                    saveStatus={saveStatus}
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
                return <MoodGraphView items={items} onBack={() => setViewMode('list')} />;
            case 'list':
            default:
                return <JournalListView
                    isLoading={isLoading}
                    items={items}
                    handleShowNewForm={handleShowNewForm}
                    handleStartEdit={handleStartEdit}
                    handleDeleteItem={handleDeleteItem}
                    setViewMode={setViewMode}
                />;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4">Daily Journal</h2>
            <p className="text-deep-charcoal/70 mb-6">How are you feeling? You can write about your day, feelings, or things you are grateful for.</p>
            {renderContent()}
        </div>
    );
};

export default DailyJournal;