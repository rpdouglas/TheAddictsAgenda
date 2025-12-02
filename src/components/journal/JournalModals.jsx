import React, { useState } from 'react';
import { SparklesIcon, FilterIcon } from '../../utils/icons.jsx';
import { Spinner } from '../common.jsx';

// --- Results Modal ---
export const InsightsModal = ({ onClose, isLoading, insights }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg space-y-4 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center flex-shrink-0">
                <h3 className="text-xl font-bold text-deep-charcoal flex items-center gap-2">
                    <SparklesIcon className="text-blue-600 w-6 h-6"/> AI Journal Analysis
                </h3>
                <button onClick={onClose} className="text-deep-charcoal/60 hover:text-deep-charcoal text-2xl">&times;</button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                        <Spinner />
                        <p className="mt-4 text-deep-charcoal/70">Reading your entries to find patterns...</p>
                    </div>
                ) : (
                    <div className="text-deep-charcoal/80 space-y-4 whitespace-pre-wrap">
                        {insights.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                    </div>
                )}
            </div>
            <div className="flex-shrink-0">
                <button onClick={onClose} className="w-full bg-light-stone/50 text-deep-charcoal/80 font-semibold py-2 px-4 rounded-lg hover:bg-light-stone/70">
                    Close
                </button>
            </div>
        </div>
    </div>
);

// --- Configuration Modal ---
export const AnalysisConfigModal = ({ isOpen, onClose, onAnalyze, allTags }) => {
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedTags, setSelectedTags] = useState([]);

    if (!isOpen) return null;

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-deep-charcoal flex items-center gap-2">
                        <FilterIcon className="text-blue-600 w-6 h-6"/> Filter Analysis
                    </h3>
                    <button onClick={onClose} className="text-deep-charcoal/60 hover:text-deep-charcoal text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-deep-charcoal/80 mb-2">Date Range</label>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <span className="text-xs text-deep-charcoal/60 block mb-1">From</span>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border border-light-stone rounded-lg text-sm" />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs text-deep-charcoal/60 block mb-1">To</span>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border border-light-stone rounded-lg text-sm" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-deep-charcoal/80 mb-2">Filter by Tags (Optional)</label>
                        <div className="max-h-32 overflow-y-auto border border-light-stone rounded-lg p-2 flex flex-wrap gap-2">
                            {allTags.length > 0 ? (
                                allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                                            selectedTags.includes(tag) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-deep-charcoal border-light-stone hover:bg-gray-100'
                                        }`}
                                    >
                                        {tag} {selectedTags.includes(tag) && '✓'}
                                    </button>
                                ))
                            ) : (
                                <p className="text-xs text-deep-charcoal/60 italic p-1">No tags created yet.</p>
                            )}
                        </div>
                        <p className="text-xs text-deep-charcoal/60 mt-1">
                            {selectedTags.length === 0 ? "Analyzing all entries in range." : `Analyzing only entries with: ${selectedTags.join(', ')}`}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-light-stone/30">
                    <button onClick={onClose} className="px-4 py-2 text-deep-charcoal/70 font-semibold hover:text-deep-charcoal">Cancel</button>
                    <button 
                        onClick={() => onAnalyze(startDate, endDate, selectedTags)} 
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <SparklesIcon className="w-4 h-4" /> Start Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};