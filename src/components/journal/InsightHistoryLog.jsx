// src/components/journal/InsightHistoryLog.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../../utils/dataStore.js';
import { 
    SparklesIcon, 
    TrashIcon, 
    ShareIcon, 
    ChevronDown, 
    ChevronRightIcon, // FIXED: Updated from ChevronRight
    CalendarIcon,
    ClockIcon 
} from '../../utils/icons.jsx';

const InsightHistoryLog = ({ refreshTrigger }) => {
    const [insights, setInsights] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [expandedMonths, setExpandedMonths] = useState([]); // Tracks "Year-Month" keys
    
    // Load insights on mount or when triggered by a new save
    useEffect(() => {
        loadInsights();
    }, [refreshTrigger]);

    const loadInsights = async () => {
        const data = await DataStore.load(DataStore.KEYS.INSIGHTS) || [];
        // Sort descending by timestamp
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setInsights(data);
        
        // Auto-expand the most recent month if data exists
        if (data.length > 0) {
            const lastDate = new Date(data[0].timestamp);
            const key = `${lastDate.getFullYear()}-${lastDate.toLocaleString('default', { month: 'long' })}`;
            setExpandedMonths([key]);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this insight log?")) {
            const updated = insights.filter(i => i.id !== id);
            await DataStore.save(DataStore.KEYS.INSIGHTS, updated);
            setInsights(updated);
        }
    };

    const handleShare = async (item) => {
        const shareText = `Recovery Insight (${new Date(item.timestamp).toLocaleDateString()}): \n\n${item.text}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Recovery Insight', text: shareText });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            await navigator.clipboard.writeText(shareText);
            alert("Insight copied to clipboard!");
        }
    };

    const toggleExpand = (id) => {
        setExpandedIds(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleMonth = (yearMonthKey) => {
        setExpandedMonths(prev => 
            prev.includes(yearMonthKey) ? prev.filter(k => k !== yearMonthKey) : [...prev, yearMonthKey]
        );
    };

    // --- Grouping Logic ---
    const groupedData = insights.reduce((acc, item) => {
        const date = new Date(item.timestamp);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        
        if (!acc[year]) acc[year] = {};
        if (!acc[year][month]) acc[year][month] = {};
        if (!acc[year][month][day]) acc[year][month][day] = [];
        
        acc[year][month][day].push(item);
        return acc;
    }, {});

    if (insights.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-6">
                <SparklesIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No insights saved yet. Use the "Analyze" button in your Journal!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-8 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
                <SparklesIcon className="w-5 h-5 text-purple-600" /> Insight History Log
            </h3>

            {Object.keys(groupedData).sort((a, b) => b - a).map(year => (
                <div key={year} className="space-y-2">
                    {/* Year Header (Optional, mostly implicit if list is short, but good for structure) */}
                    
                    {Object.keys(groupedData[year]).map(month => {
                        const monthKey = `${year}-${month}`;
                        const isMonthOpen = expandedMonths.includes(monthKey);

                        return (
                            <div key={monthKey} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Month Header */}
                                <button 
                                    onClick={() => toggleMonth(monthKey)}
                                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <span className="font-bold text-gray-700 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                        {month} {year}
                                    </span>
                                    {isMonthOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
                                </button>

                                {/* Days List */}
                                {isMonthOpen && (
                                    <div className="divide-y divide-gray-50">
                                        {Object.keys(groupedData[year][month]).sort((a, b) => b - a).map(day => (
                                            <div key={day} className="p-3">
                                                <div className="text-xs font-bold text-gray-400 uppercase mb-2 pl-1">
                                                    {month} {day}
                                                </div>
                                                <div className="space-y-3">
                                                    {groupedData[year][month][day].map(item => {
                                                        const isExpanded = expandedIds.includes(item.id);
                                                        return (
                                                            <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-3 hover:shadow-md transition-shadow">
                                                                {/* Item Header */}
                                                                <div 
                                                                    className="flex justify-between items-center cursor-pointer"
                                                                    onClick={() => toggleExpand(item.id)}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                            {item.source || 'AI Analysis'}
                                                                        </span>
                                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                                            <ClockIcon className="w-3 h-3" />
                                                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRightIcon className="w-4 h-4 text-gray-400" />}
                                                                    </div>
                                                                </div>

                                                                {/* Content Preview / Full */}
                                                                <div className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap" onClick={() => !isExpanded && toggleExpand(item.id)}>
                                                                    {isExpanded ? item.text : (
                                                                        <span className="line-clamp-2 cursor-pointer text-gray-600">
                                                                            {item.text}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Expanded Actions */}
                                                                {isExpanded && (
                                                                    <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-50">
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); handleShare(item); }}
                                                                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1"
                                                                        >
                                                                            <ShareIcon className="w-3 h-3" /> Share
                                                                        </button>
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                                            className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                                                                        >
                                                                            <TrashIcon className="w-3 h-3" /> Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default InsightHistoryLog;