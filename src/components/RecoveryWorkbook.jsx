import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DataStore from '../utils/dataStore.js';
import { workbookData } from '../utils/data.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, ChevronDown, ChevronUp, CheckCircleIcon, SparklesIcon } from '../utils/icons.jsx';
import { model } from '../firebase.jsx';

// --- Sub-Components ---

const WorkbookQuestion = ({ questionText, questionKey, initialResponses }) => {
    const [response, setResponse] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const isInitialLoad = useRef(true);

    useEffect(() => {
        setResponse(initialResponses[questionKey] || '');
        isInitialLoad.current = true;
    }, [questionKey, initialResponses]);

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
                setSaveStatus('Saved');
            } catch (error) {
                console.error("Error saving workbook response:", error);
                setSaveStatus('Error');
            }
        }, 1500);
        return () => clearTimeout(delayDebounceFn);
    }, [response, questionKey, initialResponses]);

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

const CollapsibleWorkbookSection = ({ section, stepId, initialResponses }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const contentRef = useRef(null);
    
    const keyPrefix = `${stepId}-${section.title.charAt(0)}`; 
    
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = isCollapsed ? '0px' : `${contentRef.current.scrollHeight}px`;
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
                style={{ maxHeight: '0px', transition: 'max-height 0.4s ease-in-out' }}
                className="overflow-hidden bg-white"
            >
                <div className="p-4">
                    {section.questions.map((question, qIndex) => {
                        const questionKey = `${keyPrefix}-${qIndex + 1}`;
                        return (
                            <WorkbookQuestion
                                key={questionKey}
                                questionText={question}
                                questionKey={questionKey}
                                initialResponses={initialResponses}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const WorkbookTopic = ({ topic, onBack, initialResponses }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold flex-shrink-0"><ArrowLeftIcon /><span className="ml-2">Back to Topics</span></button>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{topic.title}</h3>
            
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
                            initialResponses={initialResponses}
                        />
                    ))
                ) : (
                    <WorkbookQuestion questionText={topic.prompt} questionKey={topic.id} initialResponses={initialResponses} />
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

const InsightsModal = ({ onClose, isLoading, insights }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg space-y-4 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center flex-shrink-0">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <SparklesIcon className="text-teal-500 w-6 h-6"/> AI-Powered Insights
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                        <Spinner />
                        <p className="mt-4 text-gray-600">Analyzing your workbook entries...</p>
                    </div>
                ) : (
                    <div className="text-gray-700 space-y-4 whitespace-pre-wrap">
                        {insights.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                    </div>
                )}
            </div>
            <div className="flex-shrink-0">
                <button onClick={onClose} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                    Close
                </button>
            </div>
        </div>
    </div>
);

export const RecoveryWorkbook = () => {
    const [activeCategory, setActiveCategory] = useState(null); 
    const [selectedTopic, setSelectedTopic] = useState(null); 
    const [workbookResponses, setWorkbookResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    
    const [showInsightsModal, setShowInsightsModal] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [aiInsights, setAiInsights] = useState('');

    useEffect(() => {
        const loadWorkbookData = async () => {
            setIsLoading(true);
            const loadedData = await DataStore.load(DataStore.KEYS.WORKBOOK) || {};
            setWorkbookResponses(loadedData);
            setIsLoading(false);
        };
        loadWorkbookData();
    }, []);

    const completedTopicIds = useMemo(() => {
        const completed = new Set();
        Object.values(workbookData).forEach(category => {
            if (category && category.topics) {
                category.topics.forEach(topic => {
                    let topicHasContent = false;
                    if (topic.sections) {
                        for (const section of topic.sections) {
                            for (let i = 0; i < section.questions.length; i++) {
                                const key = `${topic.id}-${section.title.charAt(0)}-${i + 1}`;
                                if (workbookResponses[key] && workbookResponses[key].trim().length > 0) {
                                    topicHasContent = true;
                                    break;
                                }
                            }
                            if (topicHasContent) break;
                        }
                    } else if (workbookResponses[topic.id] && workbookResponses[topic.id].trim().length > 0) {
                        topicHasContent = true;
                    }
                    if (topicHasContent) completed.add(topic.id);
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
        const allTopics = Object.values(workbookData).flatMap(c => c.topics || []);
        const completed = allTopics.filter(t => completedTopicIds.includes(t.id)).length;
        const total = allTopics.length;
        return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }, [completedTopicIds]);

    const handleGenerateInsights = async () => {
        setIsGeneratingInsights(true);
        setShowInsightsModal(true);
        setAiInsights('');

        const allResponsesText = Object.entries(workbookResponses)
            .filter(([, value]) => value && value.trim().length > 0)
            .map(([key, value]) => `Entry ID: ${key}\nUser's Answer: "${value}"`)
            .join('\n---\n');

        if (allResponsesText.length === 0) {
            setAiInsights("You haven't written any workbook responses yet. Write some answers, and then I can provide insights!");
            setIsGeneratingInsights(false);
            return;
        }

        const prompt = `You are an AI assistant for a recovery application called "The Addict's Agenda." Your role is to provide compassionate, encouraging, and insightful reflections based on a user's workbook entries. Do not give medical advice. Focus on identifying themes, patterns, and opportunities for growth based on recovery principles. The user has provided the following workbook answers:\n\n${allResponsesText}\n\nBased on these entries, provide a few paragraphs of gentle, insightful feedback. Identify 2-3 key themes and suggest which recovery principles or workbook sections might be helpful to focus on next. Frame your response as a supportive guide.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            setAiInsights(text);
        } catch (error) {
            console.error("Error generating AI insights:", error);
            setAiInsights("Sorry, I was unable to generate insights at this time. Please check your connection or API key and try again.");
        } finally {
            setIsGeneratingInsights(false);
        }
    };
    
    if (isLoading) return <Spinner />;
    if (selectedTopic) return <WorkbookTopic topic={selectedTopic} onBack={() => setSelectedTopic(null)} initialResponses={workbookResponses} />;
    if (activeCategory) return <WorkbookCategory category={activeCategory} onSelectTopic={setSelectedTopic} onBack={() => setActiveCategory(null)} completedTopicIds={completedTopicIds} />;
    
    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in"> 
            {showInsightsModal && (
                <InsightsModal 
                    onClose={() => setShowInsightsModal(false)}
                    isLoading={isGeneratingInsights}
                    insights={aiInsights}
                />
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Recovery Workbook</h2> 
            <p className="text-gray-600 mb-6">Track your progress through the exercises.</p> 
            <div className="mb-6"> 
                <div className="flex justify-between items-center mb-1"> 
                    <span className="text-sm font-semibold text-gray-600">Overall Progress</span> 
                    <span className="text-sm font-semibold text-teal-600">{overallCompletion.percentage}%</span> 
                </div> 
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${overallCompletion.percentage}%` }}></div>
                </div> 
            </div> 
            <div className="mt-6 mb-4 border-t pt-6">
                <button
                    onClick={handleGenerateInsights}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                >
                    <SparklesIcon className="w-5 h-5"/> Get AI Insights on Your Work
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">Analyzes your completed entries to find themes and patterns in your recovery journey.</p>
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