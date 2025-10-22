import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { ArrowLeftIcon, SparklesIcon, XIcon, CheckIcon } from '../utils/icons.jsx';
import { journalTemplates } from '../utils/data.js';

// --- Global Utility Components ---

export const Spinner = ({ small = false }) => ( 
    <div className={`flex justify-center items-center ${small ? '' : 'h-full'}`}>
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-teal-500 ${small ? 'h-6 w-6' : 'h-16 w-16'}`}></div>
    </div>
);

export const DebouncedTextarea = ({ value, onChange, placeholder, rows, isInput = false, isDisabled = false }) => {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e) => {
        setLocalValue(e.target.value);
    };

    useEffect(() => {
        if (value !== localValue) {
            setLocalValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (localValue === value) {
            return;
        }
        
        const handler = setTimeout(() => {
            onChange(localValue);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [localValue, onChange]);

    const commonProps = {
        value: localValue,
        onChange: handleChange,
        placeholder: placeholder,
        className: `w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 ${isInput ? '' : 'resize-none'} ${isDisabled ? 'bg-gray-100' : ''}`,
        disabled: isDisabled,
    };

    if (isInput) {
         return <input type="text" {...commonProps} />;
    } else {
        return <textarea rows={rows} {...commonProps} />;
    }
};

// --- Journal Helper ---

export const GeminiJournalHelper = ({ onInsertText, onClose }) => {
    const [prompt, setPrompt] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [result, setResult] = useState(''); 
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) { 
            setError('Please enter a topic or feeling.'); 
            return; 
        }
        setIsLoading(true); 
        setResult(''); 
        setError('');

        const systemPrompt = "You are a gentle and supportive journaling assistant for someone in recovery. Provide a brief, reflective paragraph (max 100 words) based on the user's prompt. Start the entry naturally, without greetings like 'Dear Journal'.";
        const apiKey = ""; // Placeholder, key will be provided at runtime
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        
        const payload = { 
            contents: [{ parts: [{ text: prompt }] }], 
            systemInstruction: { parts: [{ text: systemPrompt }] } 
        };

        try {
            const response = await fetch(apiUrl, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            
            const data = await response.json(); 
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) setResult(text); else throw new Error("No text returned.");
        } catch (e) { 
            console.error("Gemini API call failed:", e); 
            setError("Sorry, I couldn't generate a response right now."); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return ( 
        <div className="p-4 border-t-2 border-teal-100 mt-4 space-y-3">
            <p className="text-sm text-gray-600 font-semibold">Need help starting? Give the AI a topic.</p>
            <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="e.g., 'Feeling grateful' or 'Anxious about work'..." 
                className="w-full p-2 border border-gray-300 rounded-lg text-sm" 
                rows="2"
            />
            <button 
                onClick={handleGenerate} 
                disabled={isLoading} 
                className="w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 disabled:bg-gray-400 flex items-center justify-center"
            >
                {isLoading ? <Spinner small /> : 'Generate Idea'}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {result && ( 
                <div className="p-3 bg-gray-100 rounded-lg space-y-3"> 
                    <p className="text-gray-800 text-sm">{result}</p> 
                    <button 
                        onClick={() => { onInsertText(result); onClose(); }} 
                        className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
                    >
                        Use This Entry
                    </button> 
                </div> 
            )}
        </div> 
    );
};
