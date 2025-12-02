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
        <button onClick={handleCancelEdit} className="flex items-center text-blue-600 hover:text-blue-700 mb-4 font-semibold flex-shrink-0">
            <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Entries List</span>
        </button>
        <form onSubmit={handleSaveEntry} className="mb-2 space-y-4">

            {isEditing && (
                <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">
                        Editing Entry from: {new Date(items.find(i => i.id === editItemId)?.timestamp).toLocaleString()}
                    </p>
                </div>
            )}

            {!isEditing && (
                <div className="flex gap-2">
                    <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="flex-grow p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        {journalTemplates.map(template => (
                            <option key={template.id} value={template.id} disabled={!template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                    <button type="button" onClick={handleApplyTemplate} disabled={!selectedTemplateId} className="flex-shrink-0 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1 transition-colors">
                        <CheckIcon className="w-4 h-4" /> Apply
                    </button>
                </div>
            )}

            <DebouncedTextarea
                value={newItemText}
                onChange={setNewItemText}
                placeholder="Write your entry..."
                rows="10"
                className="w-full p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 resize-y min-h-[150px]"
            />

            <div className="p-3 border border-light-stone/50 rounded-lg space-y-2">
                 <label htmlFor="mood-slider" className="block text-sm font-semibold text-deep-charcoal/80">
                    Today's Mood: <span className="font-bold text-blue-600">{currentMood === 0 ? 'Not Set' : `${currentMood} / 10`}</span>
                 </label>
                 <input
                    id="mood-slider"
                    type="range"
                    min="0"
                    max="10"
                    value={currentMood}
                    onChange={(e) => setCurrentMood(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-light-stone/50 rounded-lg appearance-none cursor-pointer"
                 />
            </div>

            <div className="p-3 border border-light-stone/50 rounded-lg space-y-3">
                <label className="block text-sm font-semibold text-deep-charcoal/80">Tags</label>
                <div className="flex flex-wrap gap-2">
                    {currentEntryTags.map(tag => (
                        <div key={tag} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            <span>{tag}</span>
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-blue-800 hover:text-blue-900"><XIcon className="w-3 h-3"/></button>
                        </div>
                    ))}
                </div>
                 <div className="flex gap-2">
                    <input type="text" list="all-tags-list" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInputKeyDown} placeholder="Add a new tag..." className="flex-grow p-2 border border-light-stone rounded-lg shadow-sm text-sm" />
                    <datalist id="all-tags-list">
                        {allTags.map(tag => <option key={tag} value={tag} />)}
                    </datalist>
                    <button type="button" onClick={handleAddTag} className="bg-light-stone/50 text-deep-charcoal/80 font-semibold px-4 rounded-lg text-sm hover:bg-light-stone/70">Add</button>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button type="button" onClick={handleCancelEdit} className="flex-grow bg-gray-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
                    {isEditing ? 'Discard Changes' : 'Cancel'}
                </button>
                <button type="submit" className="flex-grow bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                    {isEditing ? 'Save Changes' : 'Add New Entry'}
                </button>
            </div>
        </form>

        <button onClick={() => setShowGeminiHelper(!showGeminiHelper)} className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold mt-4">
            <SparklesIcon className="w-5 h-5"/> {showGeminiHelper ? 'Close AI Helper' : 'Get Idea with AI'}
        </button>
        {showGeminiHelper && <GeminiJournalHelper onInsertText={(text) => setNewItemText(text)} onClose={() => setShowGeminiHelper(false)} />}
    </>
);

export default JournalForm;