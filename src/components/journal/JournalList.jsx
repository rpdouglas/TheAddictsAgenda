// src/components/journal/JournalList.jsx
import React, { useState } from 'react';
import { EditIcon, TrashIcon, CalendarIcon, ShareIcon, SparklesIcon, SearchIcon, FilterIcon } from '../../utils/icons.jsx';

// --- SUB-COMPONENT: Active Date Badge (Now Corrected to Light Blue Style) ---
const DateBadge = ({ label, value, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Format for display (e.g., "Nov 12")
    const displayDate = value ? new Date(value + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : label;

    if (isEditing) {
        return (
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="h-9 w-14 text-[9px] p-0 rounded-md border border-blue-200 focus:outline-none bg-blue-50 text-blue-800 text-center shadow-sm"
            />
        );
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            // FIX: Changed from bg-blue-600 (Solid) to bg-blue-50 (Light Dashboard Style)
            className="flex flex-col justify-center items-center h-9 w-14 rounded-md transition-colors text-[9px] font-bold leading-none gap-0.5 shadow-sm border border-blue-100 hover:bg-blue-100 bg-blue-50 text-blue-700"
            title={`Change ${label}`}
        >
            <CalendarIcon className="w-3 h-3" />
            <span>{displayDate}</span>
        </button>
    );
};

// --- SUB-COMPONENT: Dynamic Mood Face ---
const MoodFace = ({ mood }) => {
    const safeMood = Math.max(0, Math.min(10, mood || 0));
    
    // Calculate Mouth Curve
    const controlY = 12 + (safeMood * 0.6);

    // Determine Color
    let colorClass = "text-red-500";
    if (safeMood >= 4) colorClass = "text-yellow-500";
    if (safeMood >= 7) colorClass = "text-green-500";

    return (
        <div className="flex items-center gap-1" title={`Mood: ${safeMood}/10`}>
            <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                className={`${colorClass} fill-current bg-white rounded-full`}
                style={{ fill: 'none' }} 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
                <path d={`M 8,15 Q 12,${controlY} 16,15`} />
            </svg>
            <span className={`text-xs font-bold ${colorClass}`}>{safeMood}/10</span>
        </div>
    );
};

const JournalList = ({ 
    items, 
    onEdit, 
    onDelete, 
    filterTag, 
    setFilterTag, 
    searchQuery, 
    setSearchQuery, 
    dateRange, 
    setDateRange, 
    onAnalyze, 
    allTags 
}) => {
    
    const [copiedId, setCopiedId] = useState(null);

    const handleShare = async (item) => {
        const dateStr = new Date(item.timestamp).toLocaleDateString();
        const moodStr = item.mood > 0 ? `Mood: ${item.mood}/10` : 'No Mood Recorded';
        const shareText = `Journal Entry: ${dateStr}\n${moodStr}\n\n${item.text}\n\nShared from My Recovery Toolkit`;

        if (navigator.share) {
            try {
                await navigator.share({ title: `Journal Entry - ${dateStr}`, text: shareText });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                setCopiedId(item.id);
                setTimeout(() => setCopiedId(null), 2000);
            } catch (error) {
                console.error('Failed to copy:', error);
                alert('Failed to copy to clipboard');
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-3">
                
                {/* Row 1: Filters Toolbar */}
                <div className="flex flex-row items-center gap-2">
                    {/* Date Badges */}
                    <div className="flex gap-1 flex-shrink-0">
                        <DateBadge 
                            label="Start" 
                            value={dateRange.start} 
                            onChange={(val) => setDateRange({...dateRange, start: val})} 
                        />
                        <DateBadge 
                            label="End" 
                            value={dateRange.end} 
                            onChange={(val) => setDateRange({...dateRange, end: val})} 
                        />
                    </div>

                    {/* Tag Selector */}
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <FilterIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <select 
                            value={filterTag} 
                            onChange={(e) => setFilterTag(e.target.value)}
                            className="pl-8 w-full h-9 border border-gray-300 rounded-lg text-xs bg-gray-50 appearance-none text-gray-700 font-medium focus:ring-2 focus:ring-blue-300"
                        >
                            <option value="All">All Tags</option>
                            {allTags.map(tag => (
                                <option key={tag} value={tag}>#{tag}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sparkle Button */}
                    <button 
                        onClick={onAnalyze}
                        className="flex flex-col justify-center items-center h-9 w-10 rounded-md shadow-sm border border-blue-100 hover:bg-blue-100 bg-blue-50 transition-colors flex-shrink-0"
                        title="Analyze visible entries with AI"
                    >
                        <SparklesIcon className="w-5 h-5 text-yellow-500" />
                    </button>
                </div>

                {/* Row 2: Search Bar */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search keywords..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full p-2 h-9 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-300"
                    />
                </div>
            </div>

            {/* List Results Text */}
            <div className="text-xs text-gray-500 text-right px-1">
                Showing {items.length} entr{items.length === 1 ? 'y' : 'ies'}
            </div>

            {/* List Rendering */}
            {items.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                    <p>No entries match your filters.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            
                            {/* Header: Date, Mood & Actions */}
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-t-xl border-b border-blue-100">
                                
                                {/* Left: Date */}
                                <div className="flex items-center gap-2 text-blue-800 text-sm font-bold">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                    <span className="text-blue-300 font-light hidden sm:inline">|</span>
                                    <span className="font-medium text-blue-600 hidden sm:inline">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                                {/* Right: Mood & Buttons */}
                                <div className="flex items-center gap-3">
                                    {/* Mood Face */}
                                    {item.mood > 0 && <MoodFace mood={item.mood} />}
                                    
                                    {/* Divider */}
                                    <div className="h-4 w-px bg-blue-200 mx-1"></div>

                                    {/* Action Buttons (Icon Only) */}
                                    <button 
                                        onClick={() => handleShare(item)}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1.5 rounded-full transition-colors relative"
                                        title="Share Entry"
                                    >
                                        <ShareIcon className="w-4 h-4" />
                                        {copiedId === item.id && (
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 rounded shadow-sm animate-fade-in">
                                                Copied
                                            </span>
                                        )}
                                    </button>

                                    <button 
                                        onClick={() => onEdit(item)} 
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-1.5 rounded-full transition-colors"
                                        title="Edit Entry"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    
                                    <button 
                                        onClick={() => onDelete(item.id)} 
                                        className="text-blue-600 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                                        title="Delete Entry"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content Body Wrapper */}
                            <div className="p-5">
                                {/* Content */}
                                <div className="prose prose-sm max-w-none mb-4 text-deep-charcoal leading-relaxed whitespace-pre-wrap">
                                    {item.text}
                                </div>
                                
                                {/* Footer: Tags & Weather Only */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-gray-50 mt-2">
                                    
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1">
                                        {item.tags && item.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Weather */}
                                    {item.weather && (
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <span>🌤️ {item.weather}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JournalList;