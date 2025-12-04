// src/components/workbook/WorkbookComponents.jsx
import React, { useState, useEffect, useRef } from 'react';
import DataStore from '../../utils/dataStore.js';
import { ChevronDown, ChevronUp } from '../../utils/icons.jsx';

export const WorkbookQuestion = ({ questionText, questionKey, initialResponses, onUpdate }) => {
    const [response, setResponse] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const isInitialLoad = useRef(true);

    useEffect(() => {
        setResponse(initialResponses[questionKey] || '');
        isInitialLoad.current = true;
    }, [questionKey]); 

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }
        
        if (response === (initialResponses[questionKey] || '')) {
            return;
        }

        setSaveStatus('Saving...');
        const delayDebounceFn = setTimeout(async () => {
            try {
                const currentWorkbookData = await DataStore.load(DataStore.KEYS.WORKBOOK) || {};
                const updatedData = { ...currentWorkbookData, [questionKey]: response };
                await DataStore.save(DataStore.KEYS.WORKBOOK, updatedData);
                
                onUpdate(questionKey, response);
                
                setSaveStatus('Saved');
            } catch (error) {
                console.error("Error saving workbook response:", error);
                setSaveStatus('Error');
            }
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [response, questionKey, onUpdate, initialResponses]);

    return (
        <div className="mb-6">
            <p className="font-semibold text-deep-charcoal mb-2 text-sm leading-relaxed">{questionText}</p>
            <div className="relative">
                <textarea 
                    value={response} 
                    onChange={(e) => setResponse(e.target.value)} 
                    placeholder="Write your answer here..." 
                    className="w-full p-4 border border-light-stone rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-y min-h-[120px] text-sm bg-white transition-all"
                />
                <div className="absolute bottom-3 right-3">
                    <p className={`text-xs font-bold transition-opacity duration-300 ${saveStatus === 'Saved' ? 'text-green-600 opacity-100' : (saveStatus === 'Saving...' ? 'text-pink-500 opacity-100' : 'opacity-0')}`}>
                        {saveStatus === 'Saved' ? 'Saved' : 'Saving...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const CollapsibleWorkbookSection = ({ section, stepId, initialResponses, onUpdate }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const contentRef = useRef(null);
    
    const keyPrefix = `${stepId}-${section.id}`; 
    
    const totalQuestions = section.questions.length;
    const completedQuestions = section.questions.filter((_, idx) => {
        const key = `${keyPrefix}-${idx + 1}`;
        return initialResponses[key] && initialResponses[key].trim().length > 0;
    }).length;

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = isCollapsed ? '0px' : `${contentRef.current.scrollHeight}px`;
        }
    }, [isCollapsed]);

    return (
        <div className="mb-4 border border-light-stone/50 rounded-xl shadow-sm overflow-hidden bg-white">
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex justify-between items-center p-4 transition-colors ${isCollapsed ? 'bg-white hover:bg-gray-50' : 'bg-pink-50'}`}
            >
                <div className="text-left">
                    <span className="font-bold text-deep-charcoal block">{section.title}</span>
                    <span className="text-xs text-deep-charcoal/60 font-medium">
                        {completedQuestions} / {totalQuestions} Answered
                    </span>
                </div>
                <div className={`p-2 rounded-full ${isCollapsed ? 'bg-gray-100 text-gray-400' : 'bg-pink-200 text-pink-700'}`}>
                    {isCollapsed ? <ChevronDown /> : <ChevronUp />}
                </div>
            </button>
            
            <div 
                ref={contentRef}
                style={{ maxHeight: '0px', transition: 'max-height 0.4s ease-in-out' }}
                className="overflow-hidden bg-white"
            >
                <div className="p-4 border-t border-light-stone/30">
                    {section.questions.map((question, qIndex) => {
                        const questionKey = `${keyPrefix}-${qIndex + 1}`;
                        return (
                            <WorkbookQuestion
                                key={questionKey}
                                questionText={question}
                                questionKey={questionKey}
                                initialResponses={initialResponses}
                                onUpdate={onUpdate}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};