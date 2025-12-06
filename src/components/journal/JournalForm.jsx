// src/components/journal/JournalForm.jsx
import React, { useState, useEffect } from 'react';
import { CheckIcon, XIcon, SparklesIcon, CloudIcon, ChevronDown, ChevronUp } from '../../utils/icons.jsx';
import { DebouncedTextarea, GeminiJournalHelper } from '../common.jsx';
import { journalTemplates } from '../../utils/data.js';

const JournalForm = ({
    isEditing, editItemId, items, handleCancelEdit, handleSaveEntry,
    newItemText, setNewItemText, currentMood, setCurrentMood,
    weather, setWeather, 
    selectedTemplateId: propTemplateId, setSelectedTemplateId: propSetSelectedTemplateId, handleApplyTemplate: propHandleApplyTemplate,
    currentEntryTags, tagInput, setTagInput, handleTagInputKeyDown,
    handleAddTag, handleRemoveTag, allTags, showGeminiHelper, setShowGeminiHelper
}) => {
    // Local state for template if not passed from parent
    const [localTemplateId, setLocalTemplateId] = useState('');
    const [isFetchingWeather, setIsFetchingWeather] = useState(false);
    
    // State for collapsible drawer
    const [showDetails, setShowDetails] = useState(false);

    // Use props if available, otherwise local
    const selectedTemplateId = propTemplateId !== undefined ? propTemplateId : localTemplateId;
    const setSelectedTemplateId = propSetSelectedTemplateId || setLocalTemplateId;

    const onApplyTemplate = () => {
        const template = journalTemplates.find(t => t.id === selectedTemplateId);
        if (template) {
            setNewItemText(prev => (prev ? prev + '\n\n' : '') + template.template);
        }
    };

    // --- WEATHER FETCHING LOGIC ---
    const fetchWeather = () => {
        // Check for HTTP restriction (common in Dev Bridge setups)
        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.warn("Weather Auto-Fetch skipped: Geolocation requires HTTPS or Localhost.");
            // Optional: You could set a default or just let the user type manually
            return;
        }

        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            return;
        }

        setIsFetchingWeather(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
                    );
                    const data = await response.json();
                    
                    if (data.current_weather) {
                        const code = data.current_weather.weathercode;
                        const temp = Math.round(data.current_weather.temperature);
                        
                        // Simple WMO Code Decoder
                        let condition = 'Unknown';
                        if (code === 0) condition = 'Clear Sky';
                        else if (code <= 3) condition = 'Partly Cloudy';
                        else if (code <= 48) condition = 'Foggy';
                        else if (code <= 67) condition = 'Drizzle/Rain';
                        else if (code <= 77) condition = 'Snow';
                        else if (code <= 82) condition = 'Showers';
                        else if (code <= 99) condition = 'Thunderstorm';

                        setWeather(`${condition}, ${temp}°C`);
                    }
                } catch (error) {
                    console.error("Weather fetch failed:", error);
                } finally {
                    setIsFetchingWeather(false);
                }
            },
            (error) => {
                console.warn("Location permission denied or unavailable:", error);
                setIsFetchingWeather(false);
            }
        );
    };

    // Attempt auto-fetch on mount ONLY if it's a new entry and weather is empty
    useEffect(() => {
        if (!isEditing && !weather) {
            fetchWeather();
        }
    }, [isEditing]); 

    return (
        <>
            {/* Status Bar - Only visible when editing */}
            {isEditing && (
                <div className="flex justify-end mb-4">
                    <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded">
                        Editing: {new Date(items.find(i => i.id === editItemId)?.timestamp).toLocaleDateString()}
                    </span>
                </div>
            )}

            <form onSubmit={handleSaveEntry} className="space-y-4">
                
                {/* 1. COLLAPSIBLE DRAWER: Mood & Weather ONLY */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
                    
                    {/* Drawer Header / Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Entry Details</span>
                            
                            {/* Separator */}
                            {(currentMood > 0 || weather || isFetchingWeather) && (
                                <span className="text-gray-300 font-light">|</span>
                            )}
                            
                            {/* Mood Badge */}
                            {currentMood > 0 && (
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    Mood: {currentMood}/10
                                </span>
                            )}
                            
                            {/* Weather Badge */}
                            {isFetchingWeather ? (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                    Finding Weather...
                                </span>
                            ) : weather ? (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                                    {weather}
                                </span>
                            ) : null}
                        </div>
                        
                        <div className="text-gray-400">
                            {showDetails ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                        </div>
                    </button>

                    {/* Drawer Content */}
                    {showDetails && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 animate-fade-in">
                            <div className="flex flex-col md:flex-row gap-4">
                                
                                {/* ITEM 1: Mood Slider */}
                                <div className="flex-1">
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

                                {/* ITEM 2: Weather Input */}
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-deep-charcoal/80 mb-2">
                                        Local Weather
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <input
                                                type="text"
                                                value={weather}
                                                onChange={(e) => setWeather(e.target.value)}
                                                placeholder="e.g. Sunny, 22°C"
                                                className="w-full pl-9 p-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                            <div className="absolute left-2.5 top-2.5 text-gray-400">
                                                <CloudIcon className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={fetchWeather}
                                            disabled={isFetchingWeather}
                                            className="bg-white border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-3 rounded-lg shadow-sm transition-all flex items-center justify-center min-w-[40px]"
                                            title="Auto-fetch current weather"
                                        >
                                            {isFetchingWeather ? (
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <CloudIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. WRITING AREA & TOOLBAR */}
                <div className="relative">
                    
                    {/* NEW TOOLBAR: Templates (Left) & AI (Right) */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-2">
                        
                        {/* LEFT: Template Selector */}
                        {!isEditing && (
                            <div className="flex gap-2 items-center flex-1 max-w-sm">
                                <select
                                    value={selectedTemplateId}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                    className="flex-grow p-1.5 border border-gray-300 rounded-lg text-xs shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    {journalTemplates.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    type="button" 
                                    onClick={onApplyTemplate} 
                                    disabled={!selectedTemplateId} 
                                    className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors"
                                    title="Apply Template"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* RIGHT: AI Helper Toggle */}
                        <button 
                            type="button"
                            onClick={() => setShowGeminiHelper(!showGeminiHelper)} 
                            className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-purple-50 self-end sm:self-auto"
                        >
                            <SparklesIcon className="w-4 h-4"/> 
                            {showGeminiHelper ? 'Close AI Helper' : 'AI Ideas'}
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
};

export default JournalForm;