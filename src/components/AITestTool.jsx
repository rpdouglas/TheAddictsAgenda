// src/components/AITestTool.jsx
import React, { useState } from 'react';
import { generateContentWithFallback } from '../firebase.jsx'; // <-- UPDATED IMPORT
import { Spinner } from './common.jsx';

const AITestTool = ({ onBack }) => {
    const [promptText, setPromptText] = useState('Write a single, encouraging sentence about starting a new habit.');
    const [resultText, setResultText] = useState('Click "Run Test" to generate AI content.');
    // Removed [modelList, setModelList] state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRunTest = async () => {
        setIsLoading(true);
        setError(null);
        setResultText('Generating...');

        const testPrompt = promptText.trim() || 'Default test prompt.';

        try {
            // 1. Call the universal AI function with a simple, safe prompt.
            const result = await generateContentWithFallback(testPrompt);

            // 2. Safely extract the nested text property from the successful result object
            const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? 
                                 'Successfully received a response object, but could not extract text from the candidates array.';
            
            setResultText(responseText);
            
            // CRITICAL LOG: Force the successful result object to be logged as an error
            console.error("!! AI Test Success - Raw Result Object (CRITICAL) !!", result);

        } catch (err) {
            // 3. Catch any error thrown by generateContentWithFallback
            const errorMessage = `Content API ERROR: ${err.message}`;
            setError(errorMessage);
            setResultText('Test Failed. Check Console for "AI Test Failure" details.');
            
            // This is the CRITICAL log to catch the specific error
            console.error("AI Test Failure - Full Error:", err);

        } finally {
            setIsLoading(false);
        }
    };
    
    // Removed renderModelTable function
    // Removed handleListModels function

    return (
        <div className="p-4 space-y-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-teal-700 border-b pb-2">Gemini API Test Tool</h2>

            <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your test prompt here..."
            />

            {/* BUTTONS: Only Content Generation remains */}
            <div className='flex space-x-2'>
                <button
                    onClick={handleRunTest} // Renamed handler to handleRunTest
                    disabled={isLoading}
                    // Adjusted class to be full width since the other button is gone
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                >
                    {isLoading ? <Spinner /> : 'Run Test'}
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    <p className="font-bold">Error:</p>
                    <p className="text-sm break-all">{error}</p>
                </div>
            )}

            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="font-bold text-gray-700">Result / Output:</p>
                <p className="whitespace-pre-wrap text-gray-600">{resultText}</p>
            </div>
            
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-teal-600 mt-4">
                &larr; Back to Settings
            </button>
        </div>
    );
};

export default AITestTool;