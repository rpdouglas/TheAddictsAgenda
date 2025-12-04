// src/components/journal/JournalModals.jsx
import React, { useState } from 'react';
import { SparklesIcon, FilterIcon, PlusIcon, CheckIcon, CheckCircleIcon, TrashIcon } from '../../utils/icons.jsx';
import { Spinner } from '../common.jsx';

// --- 1. DEFAULT EXPORT: Delete Confirmation Modal ---
// This matches the import in DailyJournal.jsx
const JournalModals = ({ showDeleteModal, setShowDeleteModal, confirmDelete }) => {
    if (!showDeleteModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                    <div className="bg-red-100 p-2 rounded-full">
                        <TrashIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Entry?</h3>
                </div>
                
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Are you sure you want to permanently delete this journal entry? 
                    <br/><br/>
                    <span className="font-bold text-red-500">This action cannot be undone.</span>
                </p>
                
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-bold text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm shadow-md transition-transform transform active:scale-95"
                    >
                        Yes, Delete It
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JournalModals;


// --- 2. NAMED EXPORT: Results Modal (Action Plan / Shopping Cart) ---
export const InsightsModal = ({ onClose, isLoading, insights, actions = [], onSaveActions }) => {
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    const toggleAction = (index) => {
        if (selectedIndices.includes(index)) {
            setSelectedIndices(selectedIndices.filter(i => i !== index));
        } else {
            setSelectedIndices([...selectedIndices, index]);
        }
    };

    const handleSave = () => {
        const actionsToSave = selectedIndices.map(i => actions[i]);
        onSaveActions(actionsToSave);
        setIsSaved(true);
    };

    return (
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
                        <div className="space-y-6">
                            {/* Main Analysis Text */}
                            <div className="text-deep-charcoal/80 space-y-4 whitespace-pre-wrap text-sm leading-relaxed">
                                {insights.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                            </div>

                            {/* Action Items Section (Shopping Cart Style) */}
                            {actions && actions.length > 0 && (
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <h4 className="font-bold text-blue-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" /> Suggested Actions
                                    </h4>
                                    
                                    {!isSaved ? (
                                        <>
                                            <ul className="space-y-2 mb-4">
                                                {actions.map((action, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 p-2 hover:bg-blue-100/50 rounded transition-colors cursor-pointer" onClick={() => toggleAction(idx)}>
                                                        <div className="pt-0.5">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedIndices.includes(idx)}
                                                                onChange={() => toggleAction(idx)}
                                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                            />
                                                        </div>
                                                        <span className={`text-sm ${selectedIndices.includes(idx) ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={handleSave}
                                                disabled={selectedIndices.length === 0}
                                                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                            >
                                                <PlusIcon className="w-4 h-4" /> Save Action Plan ({selectedIndices.length})
                                            </button>
                                        </>
                                    ) : (
                                        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center text-sm font-bold flex items-center justify-center gap-2">
                                            <CheckIcon className="w-5 h-5" /> Action Plan Saved!
                                        </div>
                                    )}
                                </div>
                            )}
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
};

// --- 3. NAMED EXPORT: Configuration Modal ---
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

                <div className="flex-justify-end gap-2 pt-2 border-t border-light-stone/30">
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