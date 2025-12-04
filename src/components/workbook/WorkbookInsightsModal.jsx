// src/components/workbook/WorkbookInsightsModal.jsx
import React, { useState } from 'react';
import { SparklesIcon, PlusIcon, CheckIcon, CheckCircleIcon } from '../../utils/icons.jsx';
import { Spinner } from '../common.jsx';

const WorkbookInsightsModal = ({ onClose, isLoading, insights, actions = [], onSaveActions }) => {
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
                        <SparklesIcon className="text-pink-500 w-6 h-6"/> AI-Powered Insights
                    </h3>
                    <button onClick={onClose} className="text-deep-charcoal/60 hover:text-deep-charcoal text-2xl">&times;</button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                            <Spinner />
                            <p className="mt-4 text-deep-charcoal/70">Analyzing your workbook entries...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-deep-charcoal/80 space-y-4 whitespace-pre-wrap">
                                {insights.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                            </div>

                            {/* Action Items Section (Shopping Cart) */}
                            {actions && actions.length > 0 && (
                                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                                    <h4 className="font-bold text-pink-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" /> Suggested Actions
                                    </h4>
                                    
                                    {!isSaved ? (
                                        <>
                                            <ul className="space-y-2 mb-4">
                                                {actions.map((action, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 p-2 hover:bg-pink-100/50 rounded transition-colors cursor-pointer" onClick={() => toggleAction(idx)}>
                                                        <div className="pt-0.5">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={selectedIndices.includes(idx)}
                                                                onChange={() => toggleAction(idx)}
                                                                className="w-4 h-4 text-pink-600 rounded border-gray-300 focus:ring-pink-500 cursor-pointer"
                                                            />
                                                        </div>
                                                        <span className={`text-sm ${selectedIndices.includes(idx) ? 'text-pink-900 font-medium' : 'text-gray-600'}`}>{action}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={handleSave}
                                                disabled={selectedIndices.length === 0}
                                                className="w-full bg-pink-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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

export default WorkbookInsightsModal;