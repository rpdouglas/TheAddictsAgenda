import React, { useState, useEffect } from 'react';
import { SparklesIcon, XIcon, CheckIcon } from '../utils/icons.jsx';

// --- Global Utility Components ---

export const Spinner = ({ small = false }) => ( 
    <div className={`flex justify-center items-center ${small ? '' : 'h-full'}`}>
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-teal-500 ${small ? 'h-6 w-6' : 'h-16 w-16'}`}></div>
    </div>
);

export const DebouncedTextarea = ({ value: propValue, onChange, delay = 300, ...props }) => {
    const [localValue, setLocalValue] = useState(propValue);

    // This effect syncs the component if the value is changed externally 
    // (e.g., by applying a journal template).
    useEffect(() => {
        if (propValue !== localValue) {
            setLocalValue(propValue);
        }
    }, [propValue]);

    // This effect calls the parent's onChange function after a delay (debounce)
    // to update the main state, but it doesn't trigger a re-render while typing.
    useEffect(() => {
        const handler = setTimeout(() => {
            if (localValue !== propValue) {
                onChange(localValue);
            }
        }, delay);

        // Cleanup the timeout on each keystroke or when the component unmounts
        return () => {
            clearTimeout(handler);
        };
    }, [localValue, propValue, onChange, delay]);

    return (
        <textarea
            {...props}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
        />
    );
};


// --- Journal Helper ---

export const GeminiJournalHelper = ({ onInsertText, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [idea, setIdea] = useState('');

    const popularPrompts = [
        "What's a challenge I'm facing?",
        "What am I grateful for today?",
        "A difficult feeling I'm sitting with.",
        "How can I practice self-compassion?",
    ];

    const generateIdea = async (currentPrompt) => {
        if (!currentPrompt.trim()) return;
        setIsLoading(true);
        setIdea('');
        // In a real app, this would be an API call to a generative model.
        // We'll simulate it here.
        await new Promise(res => setTimeout(res, 1500));
        const simulatedResponse = `Reflecting on "${currentPrompt}", here are some thoughts to explore:\n\n1. What is the core emotion behind this? Is it fear, anger, or sadness?\n2. Where do I feel this in my body?\n3. What is one small, kind action I can take for myself in this moment?`;
        setIdea(simulatedResponse);
        setIsLoading(false);
    };

    const handleGenerateClick = () => {
        generateIdea(prompt);
    };

    const handlePromptClick = (p) => {
        setPrompt(p);
        generateIdea(p);
    };

    const handleInsert = () => {
        onInsertText(idea);
        onClose();
    };

    return (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 animate-fade-in space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-teal-500" />
                    AI Journal Helper
                </h4>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <p className="text-sm text-gray-600">
                Use a prompt to get a personalized reflection idea from AI.
            </p>
            <div className="space-y-2">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A resentment I'm holding onto"
                        className="w-full p-2 border rounded-lg text-sm"
                    />
                    <button
                        onClick={handleGenerateClick}
                        disabled={isLoading}
                        className="bg-teal-600 text-white font-semibold px-4 rounded-lg text-sm hover:bg-teal-700 disabled:bg-gray-400"
                    >
                        {isLoading ? '...' : 'Go'}
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {popularPrompts.map(p => (
                        <button
                            key={p}
                            onClick={() => handlePromptClick(p)}
                            className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full hover:bg-teal-200"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && <Spinner small />}

            {idea && (
                <div className="p-3 bg-white border rounded-md space-y-3">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{idea}</p>
                    <button
                        onClick={handleInsert}
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center gap-2"
                    >
                        <CheckIcon className="w-4 h-4" /> Insert into Journal
                    </button>
                </div>
            )}
        </div>
    );
};