import React from 'react';
import { SparklesIcon, TrendingUpIcon, EditIcon, TrashIcon } from '../../utils/icons.jsx';
import { Spinner } from '../common.jsx';

const JournalListView = ({ isLoading, items, handleShowNewForm, handleStartEdit, handleDeleteItem, setViewMode, onOpenAnalysisConfig }) => (
    <div className="flex-grow overflow-y-auto pr-2 -mr-2 mt-4">
        <div className="flex gap-2 mb-6">
            <button
                onClick={handleShowNewForm}
                className="flex-grow bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
                Add New Entry
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
        {isLoading ? <Spinner /> : (items.length > 0 ? (
            <ul className="space-y-4">
                {items.map(item => (
                    <li key={item.id} className="p-4 bg-pure-white/60 rounded-lg shadow-sm transition-colors hover:bg-soft-linen">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-deep-charcoal font-semibold">{new Date(item.timestamp).toLocaleDateString()}</p>
                                <p className="text-sm text-deep-charcoal/60">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                                <button onClick={() => handleStartEdit(item)} className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 p-2 rounded-lg bg-white shadow-sm border border-light-stone/50">
                                    <EditIcon className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => handleDeleteItem(item.id)} className="text-hopeful-coral hover:text-red-700 text-sm font-semibold flex items-center gap-1 p-2 rounded-lg bg-white shadow-sm border border-light-stone/50">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <p className="mt-3 text-deep-charcoal/80 whitespace-pre-wrap">{item.text}</p>
                         {(item.tags && item.tags.length > 0 || item.mood) && (
                            <div className="mt-3 flex flex-wrap gap-2 items-center">
                                {item.mood && (
                                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Mood: {item.mood}/10
                                    </span>
                                )}
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center py-10">
                <p className="text-deep-charcoal/60">No journal entries yet. Tap below to start.</p>
                <button
                    onClick={handleShowNewForm}
                    className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    Start Your First Entry
                </button>
            </div>
        ))}
    </div>
);

export default JournalListView;