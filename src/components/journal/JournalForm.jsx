// src/components/journal/JournalForm.jsx
import React from 'react';
import { ArrowLeftIcon, CheckIcon, XIcon, SparklesIcon } from '../../utils/icons.jsx';
import { DebouncedTextarea, GeminiJournalHelper } from '../common.jsx';
import { journalTemplates } from '../../utils/data.js';

const JournalForm = ({
    isEditing, editItemId, items, handleCancelEdit, handleSaveEntry,
    newItemText, setNewItemText, currentMood, setCurrentMood,
    selectedTemplateId, setSelectedTemplateId, handleApplyTemplate,
    currentEntryTags, tagInput, setTagInput, handleTagInputKeyDown,
    handleAddTag, handleRemoveTag, allTags, showGeminiHelper, setShowGeminiHelper
}) => (
    <>
        {/* Navigation & Status */}
        <div className="flex items-center justify-between mb-4">
            <button onClick={handleCancelEdit} className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back</span>
            </button>
            {isEditing && (
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded">
                    Editing: {new Date(items.find(i => i.id === editItemId)?.timestamp).toLocaleDateString()}
                </span>
            )}
        </div>

        <form onSubmit={handleSaveEntry} className="space-y-4">
            
            {/* 1. CONTROL HEADER: Mood & Template */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                
                {/* Mood Slider (Left) */}
                <div>
                    <label htmlFor="mood-slider" className="flex justify-between text-sm font-bold text-deep-charcoal/80 mb-2">
                        <span>Check-in: How are you?</span>
                        <span className={`px-2 rounded-full text-xs flex items-center ${currentMood > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                            {currentMood > 0 ? `${currentMood}/10` : 'Set Mood'}
                        </span>
                    </label>
                    <input
                        id="mood-slider"
                        type="range"
                        min="0"
                        max="10"
                        value={currentMood}
                        onChange={(e) => setCurrentMood(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                </div>

                {/* Template Selector (Right) */}
                {!isEditing && (
                    <div className="flex flex-col justify-between">
                        <label className="block text-sm font-bold text-deep-charcoal/80 mb-2">Use a Template</label>
                        <div className="flex gap-2">
                            <select
                                value={selectedTemplateId}
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                                className="flex-grow p-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500"
                            >
                                {journalTemplates.map(template => (
                                    <option key={template.id} value={template.id} disabled={!template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={handleApplyTemplate} 
                                disabled={!selectedTemplateId} 
                                className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2 px-3 rounded-lg shadow-sm transition-colors"
                                title="Apply Template"
                            >
                                <CheckIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. WRITING AREA */}
            <div className="relative">
                {/* AI Helper Toggle (Toolbar) */}
                <div className="flex justify-end mb-1">
                    <button 
                        type="button"
                        onClick={() => setShowGeminiHelper(!showGeminiHelper)} 
                        className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors py-1 px-2 rounded hover:bg-purple-50"
                    >
                        <SparklesIcon className="w-4 h-4"/> 
                        {showGeminiHelper ? 'Close AI Helper' : 'Need writing ideas?'}
                    </button>
                </div>

                {/* AI Helper Content (Conditional) */}
                {showGeminiHelper && (
                    <div className="mb-3 animate-fade-in border-b border-purple-100 pb-3">
                        <GeminiJournalHelper onInsertText={(text) => setNewItemText(prev => prev + (prev ? '\n\n' : '') + text)} onClose={() => setShowGeminiHelper(false)} />
                    </div>
                )}

                <DebouncedTextarea
                    value={newItemText}
                    onChange={setNewItemText}
                    placeholder="Write your entry here..."
                    className="w-full p-4 border border-light-stone rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 resize-y min-h-[200px] text-base leading-relaxed bg-white"
                />
            </div>

            {/* 3. TAGGING FOOTER */}
            <div className="bg-white border border-gray-100 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-grow flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Tags:</span>
                    {currentEntryTags.length === 0 && <span className="text-xs text-gray-400 italic">No tags added</span>}
                    {currentEntryTags.map(tag => (
                        <div key={tag} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-bold border border-blue-100">
                            <span>#{tag}</span>
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-blue-400 hover:text-red-500">
                                <XIcon className="w-3 h-3"/>
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <input 
                        type="text" 
                        list="all-tags-list" 
                        value={tagInput} 
                        onChange={(e) => setTagInput(e.target.value)} 
                        onKeyDown={handleTagInputKeyDown} 
                        placeholder="Add tag..." 
                        className="flex-grow sm:w-32 p-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500" 
                    />
                    <datalist id="all-tags-list">
                        {allTags.map(tag => <option key={tag} value={tag} />)}
                    </datalist>
                    <button type="button" onClick={handleAddTag} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded text-sm transition-colors">
                        Add
                    </button>
                </div>
            </div>

            {/* 4. ACTION BAR */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={handleCancelEdit} className="text-gray-500 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    {isEditing ? 'Update Entry' : 'Save Entry'}
                </button>
            </div>
        </form>
    </>
);

export default JournalForm;