// src/components/journal/WordCloudView.jsx
import React, { useMemo } from 'react';
import { TagIcon, SearchIcon } from '../../utils/icons.jsx';

// Common English stop words to exclude from the cloud
const STOP_WORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", 
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", 
    "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", 
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", 
    "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", 
    "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", 
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", 
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", 
    "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", 
    "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves",
    "just", "like", "will", "going", "feel", "feeling", "today", "day", "days" // Context specific fillers
]);

const WordCloudView = ({ items, onWordClick }) => {
    
    // 1. Process Text Data
    const wordData = useMemo(() => {
        // Create a single string from all entries
        let textBlob = items.map(item => item.text || "").join(" ");
        
        // --- TEMPLATE CLEANING ---
        // Remove specific prompt phrases so words aren't over-counted from the template structure
        textBlob = textBlob
            .replace(/Today I am grateful for:?/gi, "") // Remove gratitude prompt
            .replace(/Meeting Reflection/gi, "")        // Remove meeting header
            .replace(/Meeting Name\/Topic:?/gi, "");    // Remove meeting name prompt

        // Regex to match words (alphanumeric, min 3 chars)
        const rawWords = textBlob.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        
        const counts = {};
        let maxCount = 0;

        rawWords.forEach(word => {
            if (!STOP_WORDS.has(word)) {
                counts[word] = (counts[word] || 0) + 1;
                if (counts[word] > maxCount) maxCount = counts[word];
            }
        });

        // Convert to array and sort by frequency
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1]) // Descending order
            .slice(0, 50) // Top 50 words
            .map(([text, count]) => ({ text, count, relative: count / maxCount }));
    }, [items]);

    // 2. Helper to determine font size class based on relative frequency
    const getSizeClass = (relative) => {
        if (relative > 0.8) return 'text-4xl font-black text-blue-900';
        if (relative > 0.6) return 'text-3xl font-bold text-blue-800';
        if (relative > 0.4) return 'text-2xl font-bold text-blue-700';
        if (relative > 0.2) return 'text-xl font-semibold text-blue-600';
        return 'text-sm font-medium text-blue-400';
    };

    if (wordData.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mt-6">
                <TagIcon className="w-8 h-8 text-gray-300 mx-auto mb-2"/>
                <p className="text-gray-500 text-sm">Write more entries to generate your word cloud.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <TagIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Recurring Themes</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 items-baseline">
                {wordData.map((wordObj) => (
                    <button
                        key={wordObj.text}
                        onClick={() => onWordClick(wordObj.text)}
                        className={`transition-all duration-300 hover:scale-110 hover:text-orange-500 cursor-pointer ${getSizeClass(wordObj.relative)}`}
                        title={`${wordObj.count} occurrences`}
                    >
                        {wordObj.text}
                    </button>
                ))}
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
                <SearchIcon className="w-3 h-3"/> Tap any word to view related entries
            </p>
        </div>
    );
};

export default WordCloudView;