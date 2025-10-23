import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FirestoreDataStore } from '../utils/storage.js'; 
import { ArrowLeftIcon, SparklesIcon, XIcon, CheckIcon } from '../utils/icons.jsx';
import { journalTemplates } from '../utils/data.js';

// --- Global Utility Components ---

export const Spinner = ({ small = false }) => ( 
    <div className={`flex justify-center items-center ${small ? '' : 'h-full'}`}>
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-teal-500 ${small ? 'h-6 w-6' : 'h-16 w-16'}`}></div>
    </div>
);

export const DebouncedTextarea = ({ value, onChange, placeholder, rows, isInput = false, isDisabled = false }) => {
    // ... (rest of the component is unchanged)
};

// --- Journal Helper ---

export const GeminiJournalHelper = ({ onInsertText, onClose }) => {
    // ... (rest of the component is unchanged)
}