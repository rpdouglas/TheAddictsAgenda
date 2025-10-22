import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { workbookData } from '../utils/data.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, ChevronDown, ChevronUp, CheckCircleIcon } from '../utils/icons.jsx';

// --- Sub-Components ---

const WorkbookQuestion = ({ questionText, questionKey }) => {
    const [response, setResponse] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const isInitialLoad = useRef(true);

    useEffect(() => {
        const data = LocalDataStore.load(LocalDataStore.KEYS.WORKBOOK) || {};
        setResponse(data[questionKey] || '');
        setSaveStatus('Initial Load');
    }, [questionKey]);

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        setSaveStatus('Saving...');
        
        const delayDebounceFn = setTimeout(() => {
            try {
                const data = LocalDataStore.load(LocalDataStore.KEYS.WORKBOOK) || {};
                const updatedData = { ...data, [questionKey]: response };
                LocalDataStore.save(LocalDataStore.KEYS.WORKBOOK, updatedData);
                setSaveStatus('Saved');
            } catch (error) {
                console.error("Error saving workbook response:", error);
                setSaveStatus('Error');
            }
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [response, questionKey]);

    return (
        <div className="mb-4 pb-2">
            <p className="workbook-question text-gray-800">{questionText}</p>
            <textarea 
                value={response} 
                onChange={(e) => setResponse(e.target.value)} 
                placeholder="Write your answer here..." 
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 resize-y min-h-[100px] text-sm"
                rows="4"
            />
            <p className="text-right text-xs text-gray-500 mt-1 h-4">{saveStatus === 'Saved' ? 'Saved' : (saveStatus === 'Saving...' ? 'Saving...' : '\u00A0')}</p>
        </div>
    );
};

const CollapsibleWorkbookSection = ({ section, stepId }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const contentRef = useRef(null);
    
    const keyPrefix = `${stepId}-${section.title.charAt(0)}`; 
    
    useEffect(() => {
        if (!isCollapsed && contentRef.current) {
            contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
        }
    }, [isCollapsed]);

    return (
        <div className="mb-4 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex justify-between items-center p-4 font-bold text-lg transition-colors ${isCollapsed ? 'bg-gray-50 hover:bg-gray-100 text-gray-700' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
            >
                {section.title}
                {isCollapsed ? <ChevronDown /> : <ChevronUp />}
            </button>
            
            <div 
                ref={contentRef}
                style={{
                    maxHeight: isCollapsed ? '0' : '9999px',
                    transition: 'max-height 0.4s ease-in-out',
                }}
                className="overflow-hidden p-4 bg-white"
            >
                {section.questions.map((question, qIndex) => {
                    const questionKey = `${keyPrefix}-${qIndex + 1}`;
                    return (
                        <WorkbookQuestion
                            key={questionKey}
                            questionText={question}
                            questionKey={questionKey}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const WorkbookTopic = ({ topic, onBack }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold flex-shrink-0"><ArrowLeftIcon /><span className="ml-2">Back to Topics</span></button>
            
            <h3 className="2xl font-bold text-gray-800 mb-2">{topic.title}</h3>
            
            {topic.quote && (
                <div className="step-quote">
                    {topic.quote}
                </div>
            )}

            <div className="overflow-y-auto flex-grow pr-2">
                {topic.sections ? (
                    topic.sections.map((section, secIndex) => (
                        <CollapsibleWorkbookSection 
                            key={secIndex} 
                            section={section} 
                            stepId={topic.id} 
                        />
                    ))
                ) : (
                    // Fallback for General Topics
                    <WorkbookQuestion questionText={topic.prompt} questionKey={topic.id} />
                )}
            </div>
        </div>
    );
};

const WorkbookCategory = ({ category, onSelectTopic, onBack, completedTopicIds }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold"><ArrowLeftIcon /><span className="ml-2">Back to Workbook Sections</span></button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h2>
        <p className="text-gray-600 mb-6">{category.description}</p>
        <ul className="space-y-3">
            {category.topics.map(topic => (
                <li key={topic.id}>
                    <button onClick={() => onSelectTopic(topic)} className="w-full text-left p-4 bg-gray-50 hover:bg-teal-50 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">{topic.title}</h3>
                        {completedTopicIds.includes(topic.id) && <CheckCircleIcon className="text-green-500 w-5 h-5"/>}
                    </button>
                </li>
            ))}
        </ul>
    </div>
);


// --- Main Workbook Component ---

export const RecoveryWorkbook = () => {
    const [activeCategory, setActiveCategory] = useState(null); 
    const [selectedTopic, setSelectedTopic] = useState(null); 
    const [workbookResponses, setWorkbookResponses] = useState({});

    useEffect(() => {
        const loadedData = LocalDataStore.load(LocalDataStore.KEYS.WORKBOOK) || {};
        setWorkbookResponses(loadedData);
        
        const handleStorageChange = (e) => {
            if (e.key === LocalDataStore.KEYS.WORKBOOK) {
                setWorkbookResponses(LocalDataStore.load(LocalDataStore.KEYS.WORKBOOK) || {});
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const completedTopicIds = useMemo(() => {
        const completed = new Set();
        
        Object.values(workbookData).forEach(category => {
            if (category && category.topics) {
                category.topics.forEach(topic => {
                    let topicHasContent = false;
                    
                    if (topic.sections) {
                        topic.sections.forEach(section => {
                            section.questions.forEach((_, index) => {
                                const key = `${topic.id}-${section.title.charAt(0)}-${index + 1}`;
                                if (workbookResponses[key] && workbookResponses[key].trim().length > 0) {
                                    topicHasContent = true;
                                }
                            });
                        });
                    } else if (workbookResponses[topic.id] && workbookResponses[topic.id].trim().length > 0) {
                        topicHasContent = true;
                    }

                    if (topicHasContent) {
                        completed.add(topic.id);
                    }
                });
            }
        });

        return Array.from(completed);

    }, [workbookResponses]);

    const calculateCompletion = useCallback((key) => {
        const topics = workbookData[key]?.topics || [];
        const completed = topics.filter(t => completedTopicIds.includes(t.id)).length;
        const total = topics.length;
        return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }, [completedTopicIds]);

    const overallCompletion = useMemo(() => {
        const allTopics = Object.values(workbookData).flatMap(c => c.topics);
        const completed = allTopics.filter(t => completedTopicIds.includes(t.id)).length;
        const total = allTopics.length;
        return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }, [completedTopicIds]);
    
    if (selectedTopic && selectedTopic.sections) return <WorkbookTopic topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
    if (selectedTopic) return <WorkbookTopic topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
    if (activeCategory) return <WorkbookCategory category={activeCategory} onSelectTopic={setSelectedTopic} onBack={() => setActiveCategory(null)} completedTopicIds={completedTopicIds} />;
    
    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in"> 
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Recovery Workbook</h2> 
            <p className="text-gray-600 mb-6">Track your progress.</p> 
            <div className="mb-6"> 
                <div className="flex justify-between items-center mb-1"> 
                    <span className="text-sm font-semibold text-gray-600">Overall Progress</span> 
                    <span className="text-sm font-semibold text-teal-600">{overallCompletion.percentage}%</span> 
                </div> 
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${overallCompletion.percentage}%` }}></div>
                </div> 
            </div> 
            <ul className="space-y-4"> 
                {Object.keys(workbookData).map(key => { 
                    const category = workbookData[key]; 
                    if (!category) return null; 
                    const { completed, total, percentage } = calculateCompletion(key); 
                    return ( 
                        <li key={key}> 
                            <button onClick={() => setActiveCategory(category)} className="w-full text-left p-4 bg-gray-50 hover:bg-teal-50 rounded-lg shadow-sm"> 
                                <h3 className="font-semibold text-gray-800 text-lg">{category.title}</h3> 
                                <p className="text-gray-600 mt-1 text-sm">{category.description}</p> 
                                <div className="mt-3"> 
                                    <div className="flex justify-between items-center mb-1"> 
                                        <span className="text-xs font-semibold text-gray-500">{completed} / {total} Completed</span> 
                                        <span className="text-xs font-semibold text-teal-600">{percentage}%</span> 
                                    </div> 
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div> 
                                </div> 
                            </button> 
                        </li> 
                    ); 
                })} 
            </ul> 
        </div> 
    );
};
