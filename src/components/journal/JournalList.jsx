// src/components/journal/JournalList.jsx
import React, { useState } from 'react';
import { EditIcon, TrashIcon, CalendarIcon, ShareIcon } from '../../utils/icons.jsx';

const JournalList = ({ items, onEdit, onDelete, filterTag, setFilterTag, searchQuery, setSearchQuery, allTags }) => {
    
    // State to handle feedback when copying to clipboard (on devices without native share)
    const [copiedId, setCopiedId] = useState(null);

    const filteredItems = items.filter(item => {
        const matchesTag = filterTag === 'All' || (item.tags && item.tags.includes(filterTag));
        const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesTag && matchesSearch;
    });

    const handleShare = async (item) => {
        const dateStr = new Date(item.timestamp).toLocaleDateString();
        const moodStr = item.mood > 0 ? `Mood: ${item.mood}/10` : 'No Mood Recorded';
        
        // Option 2: Formatted Recovery Update
        const shareText = `Journal Entry: ${dateStr}\n${moodStr}\n\n${item.text}\n\nShared from My Recovery Toolkit`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Journal Entry - ${dateStr}`,
                    text: shareText,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for desktop/unsupported browsers
            try {
                await navigator.clipboard.writeText(shareText);
                setCopiedId(item.id);
                setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
            } catch (error) {
                console.error('Failed to copy:', error);
                alert('Failed to copy to clipboard');
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3">
                <input 
                    type="text" 
                    placeholder="Search entries..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                
                <select 
                    value={filterTag} 
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 min-w-[120px]"
                >
                    <option value="All">All Tags</option>
                    {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>

            {/* List */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                    <p>No entries found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            
                            {/* Header: Date & Mood */}
                            <div className="flex justify-between items-start mb-3 border-b border-gray-50 pb-2">
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {item.mood > 0 && (
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                        item.mood >= 7 ? 'bg-green-100 text-green-700' :
                                        item.mood >= 4 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        Mood: {item.mood}/10
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="prose prose-sm max-w-none mb-4 text-deep-charcoal leading-relaxed whitespace-pre-wrap">
                                {item.text}
                            </div>
                            
                            {/* Weather (if present) */}
                            {item.weather && (
                                <div className="mb-3 text-xs text-gray-500 flex items-center gap-1">
                                    <span>🌤️ Weather: {item.weather}</span>
                                </div>
                            )}

                            {/* Footer: Tags & Actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                                <div className="flex flex-wrap gap-1">
                                    {item.tags && item.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
                                    {/* Share Button */}
                                    <button 
                                        onClick={() => handleShare(item)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-teal-600 hover:text-teal-800 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                        title="Share Entry"
                                    >
                                        {copiedId === item.id ? (
                                            <span className="text-green-600 font-bold text-xs animate-fade-in">Copied!</span>
                                        ) : (
                                            <>
                                                <ShareIcon className="w-4 h-4" />
                                                <span className="sm:hidden">Share</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Edit Button */}
                                    <button 
                                        onClick={() => onEdit(item)} 
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                        <span className="sm:hidden">Edit</span>
                                    </button>
                                    
                                    {/* Delete Button */}
                                    <button 
                                        onClick={() => onDelete(item.id)} 
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        <span className="sm:hidden">Delete</span>
                                    </button>
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