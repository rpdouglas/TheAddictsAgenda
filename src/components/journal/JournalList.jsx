// src/components/journal/JournalList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { SparklesIcon, TrendingUpIcon, EditIcon, TrashIcon, ChevronDown, ChevronUp } from '../../utils/icons.jsx';
import { Spinner } from '../common.jsx';

const JournalListView = ({ isLoading, items, handleShowNewForm, handleStartEdit, handleDeleteItem, setViewMode, onOpenAnalysisConfig }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedMonths, setExpandedMonths] = useState({});

    // 1. Group Items by Month (Memoized)
    // We assume 'items' are already sorted by date (descending) from the parent component
    const groupedItems = useMemo(() => {
        const groups = {};
        items.forEach(item => {
            const date = new Date(item.timestamp);
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        return groups;
    }, [items]);

    // 2. Set default expanded state (Open most recent month on load)
    useEffect(() => {
        if (items.length > 0) {
            const mostRecentDate = new Date(items[0].timestamp);
            const key = mostRecentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            
            // Only set default if we haven't set any state yet (to prevent collapsing while user is interacting)
            setExpandedMonths(prev => Object.keys(prev).length === 0 ? { [key]: true } : prev);
        }
    }, [items]);

    // 3. Search Filter Logic
    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return null;
        const lowerTerm = searchTerm.toLowerCase();
        return items.filter(item =>
            item.text.toLowerCase().includes(lowerTerm) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerTerm)))
        );
    }, [items, searchTerm]);

    const toggleMonth = (month) => {
        setExpandedMonths(prev => ({
            ...prev,
            [month]: !prev[month]
        }));
    };

    // Helper to render individual entry cards
    const renderEntry = (item) => (
        <li key={item.id} className="p-4 bg-pure-white/60 rounded-lg shadow-sm transition-colors hover:bg-soft-linen mb-3 last:mb-0 border border-light-stone/20">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-deep-charcoal font-semibold text-sm">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-deep-charcoal/60">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                    <button 
                        onClick={() => handleStartEdit(item)} 
                        className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg bg-white shadow-sm border border-light-stone/50 transition-colors" 
                        title="Edit"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => handleDeleteItem(item.id)} 
                        className="text-hopeful-coral hover:text-red-700 p-1.5 rounded-lg bg-white shadow-sm border border-light-stone/50 transition-colors" 
                        title="Delete"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <p className="mt-2 text-deep-charcoal/80 whitespace-pre-wrap text-sm leading-relaxed">{item.text}</p>
            
            {(item.tags?.length > 0 || item.mood > 0) && (
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                    {item.mood > 0 && (
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
                            Mood: {item.mood}/10
                        </span>
                    )}
                    {item.tags?.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </li>
    );

    return (
        <div className="flex-grow flex flex-col overflow-hidden mt-4">
            {/* Controls Header */}
            <div className="flex flex-col gap-3 mb-4 flex-shrink-0">
                <div className="flex gap-2">
                    <button
                        onClick={handleShowNewForm}
                        className="flex-grow bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Write New Entry
                    </button>
                    <button
                        onClick={onOpenAnalysisConfig}
                        className="flex-shrink-0 bg-white border border-light-stone text-blue-600 font-bold py-3 px-4 rounded-lg shadow-md hover:bg-soft-linen transition-colors"
                        title="Get AI Analysis"
                    >
                        <SparklesIcon className="w-5 h-5"/>
                    </button>
                     <button
                        onClick={() => setViewMode('graph')}
                        className="flex-shrink-0 bg-white border border-light-stone text-deep-charcoal/80 font-bold py-3 px-4 rounded-lg shadow-md hover:bg-soft-linen transition-colors"
                        title="View Mood Graph"
                    >
                        <TrendingUpIcon className="w-5 h-5"/>
                    </button>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search journal entries by text or tag..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 rounded-lg border border-light-stone shadow-inner text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? <Spinner /> : (items.length > 0 ? (
                    <>
                        {/* --- VIEW MODE 1: SEARCH RESULTS --- */}
                        {searchTerm.trim() ? (
                            searchResults.length > 0 ? (
                                <ul className="space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">
                                        Found {searchResults.length} matching {searchResults.length === 1 ? 'entry' : 'entries'}
                                    </p>
                                    {searchResults.map(renderEntry)}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No matches found for "{searchTerm}"</p>
                                </div>
                            )
                        ) : (
                            /* --- VIEW MODE 2: MONTHLY GROUPS --- */
                            <div className="space-y-4">
                                {Object.keys(groupedItems).map(month => (
                                    <div key={month} className="border border-light-stone/50 rounded-xl overflow-hidden bg-white shadow-sm">
                                        <button 
                                            onClick={() => toggleMonth(month)}
                                            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
                                        >
                                            <span className="font-bold text-deep-charcoal text-lg">{month}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">
                                                    {groupedItems[month].length}
                                                </span>
                                                {expandedMonths[month] ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                                            </div>
                                        </button>
                                        
                                        {/* Collapsible Content */}
                                        {expandedMonths[month] && (
                                            <ul className="p-2 bg-light-stone/10 border-t border-light-stone/20">
                                                {groupedItems[month].map(renderEntry)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-deep-charcoal/60">No journal entries yet. Tap above to start.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JournalListView;