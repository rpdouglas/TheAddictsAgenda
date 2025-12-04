// src/components/journal/JournalList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { EditIcon, TrashIcon, ChevronDown, ChevronUp, SearchIcon, FilterIcon, XIcon } from '../../utils/icons.jsx';
import { Spinner } from '../common.jsx';

const JournalListView = ({ 
    items, 
    onEdit, 
    onDelete, 
    searchQuery, 
    setSearchQuery, 
    filterTag, 
    setFilterTag, 
    allTags,
    isLoading 
}) => {
    const [expandedMonths, setExpandedMonths] = useState({});

    // 1. Clear filters helper
    const clearFilters = () => {
        setSearchQuery('');
        setFilterTag('All');
    };

    // 2. Filter Logic (Search Text + Dropdown Tag)
    const filteredItems = useMemo(() => {
        if (!items) return [];
        
        let result = items;

        // A. Apply Text Search (from Input or Word Cloud)
        if (searchQuery && searchQuery.trim()) {
            const lowerTerm = searchQuery.toLowerCase();
            result = result.filter(item =>
                (item.text && item.text.toLowerCase().includes(lowerTerm)) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowerTerm)))
            );
        }

        // B. Apply Tag Filter (from Dropdown)
        if (filterTag && filterTag !== 'All') {
            result = result.filter(item => item.tags && item.tags.includes(filterTag));
        }

        return result;
    }, [items, searchQuery, filterTag]);

    // 3. Group Filtered Items by Month
    const groupedItems = useMemo(() => {
        const groups = {};
        filteredItems.forEach(item => {
            const date = new Date(item.timestamp);
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });
        return groups;
    }, [filteredItems]);

    // 4. Default Expansion: Open most recent month if data exists
    useEffect(() => {
        if (Object.keys(groupedItems).length > 0) {
            const firstMonth = Object.keys(groupedItems)[0];
            setExpandedMonths(prev => {
                // Only set if empty to avoid overriding user interaction
                if (Object.keys(prev).length === 0) return { [firstMonth]: true };
                return prev;
            });
        }
    }, [groupedItems]);

    const toggleMonth = (month) => {
        setExpandedMonths(prev => ({
            ...prev,
            [month]: !prev[month]
        }));
    };

    // --- RENDER CARD HELPER ---
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
                        onClick={() => onEdit(item)} 
                        className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg bg-white shadow-sm border border-light-stone/50 transition-colors" 
                        title="Edit"
                    >
                        <EditIcon className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(item.id)} 
                        className="text-hopeful-coral hover:text-red-700 p-1.5 rounded-lg bg-white shadow-sm border border-light-stone/50 transition-colors" 
                        title="Delete"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <p className="mt-2 text-deep-charcoal/80 whitespace-pre-wrap text-sm leading-relaxed">{item.text}</p>
            
            <div className="mt-3 flex flex-wrap gap-2 items-center">
                {item.mood > 0 && (
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
                        Mood: {item.mood}/10
                    </span>
                )}
                {item.weather && (
                    <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                        {item.weather}
                    </span>
                )}
                {item.tags?.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold bg-orange-50 text-orange-700 px-2 py-1 rounded-full border border-orange-100">
                        #{tag}
                    </span>
                ))}
            </div>
        </li>
    );

    return (
        <div className="flex-grow flex flex-col overflow-hidden mt-4">
            
            {/* --- CONTROLS: SEARCH & FILTER --- */}
            <div className="flex flex-col gap-3 mb-4 flex-shrink-0 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex gap-2">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search entries..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-8 p-2 rounded-lg border border-light-stone text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <SearchIcon className="w-4 h-4"/>
                        </div>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600">
                                <XIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Tag Filter Dropdown */}
                    <div className="relative min-w-[120px]">
                        <div className="absolute left-2 top-2.5 text-gray-500 pointer-events-none">
                            <FilterIcon className="w-4 h-4" />
                        </div>
                        <select
                            value={filterTag}
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="w-full pl-8 p-2 rounded-lg border border-light-stone text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50 appearance-none cursor-pointer font-medium text-gray-700"
                        >
                            <option value="All">All Tags</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active Filter Indicator */}
                {(searchQuery || filterTag !== 'All') && (
                    <div className="flex justify-between items-center bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        <span className="text-xs font-bold text-blue-700">
                            Showing {filteredItems.length} result{filteredItems.length !== 1 && 's'}
                        </span>
                        <button onClick={clearFilters} className="text-xs text-blue-500 hover:text-blue-700 font-semibold hover:underline">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* --- LIST CONTENT --- */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? <Spinner /> : (items.length > 0 ? (
                    <>
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-10 flex flex-col items-center opacity-60">
                                <SearchIcon className="w-12 h-12 text-gray-300 mb-2"/>
                                <p className="text-gray-500 font-medium">No matching entries found.</p>
                                <button onClick={clearFilters} className="mt-2 text-blue-500 text-sm font-bold">Clear Search</button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.keys(groupedItems).map(month => (
                                    <div key={month} className="border border-light-stone/50 rounded-xl overflow-hidden bg-white shadow-sm">
                                        <button 
                                            onClick={() => toggleMonth(month)}
                                            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none group"
                                        >
                                            <span className="font-bold text-deep-charcoal text-sm uppercase tracking-wider">{month}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                                    {groupedItems[month].length}
                                                </span>
                                                <div className={`text-gray-400 transition-transform duration-200 ${expandedMonths[month] ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="w-5 h-5"/>
                                                </div>
                                            </div>
                                        </button>
                                        
                                        {/* Collapsible Content */}
                                        {expandedMonths[month] && (
                                            <ul className="p-2 bg-light-stone/10 border-t border-light-stone/20 animate-fade-in">
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
                        <p className="text-deep-charcoal/60">No journal entries yet.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JournalListView;