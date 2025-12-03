// src/components/RecoveryWorkbook.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import DataStore from '../utils/dataStore.js';
import { workbookData } from '../utils/data.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, ChevronDown, ChevronUp, CheckCircleIcon, SparklesIcon, DownloadIcon } from '../utils/icons.jsx';
import { model } from '../firebase.jsx';
import jsPDF from 'jspdf';

// IMPORT CUSTOM TOOLS (UPDATED: Added missing tools)
import { 
    SmartGoalTool, 
    CBATool, 
    ABCTool, 
    UrgeLogTool, 
    LifestyleBalanceTool,
    SelfCompassionTool,
    FiveQuestionsTool,
    DentsTool,
    PersonifyTool,
    BoundariesTool
} from './SmartRecoveryTools.jsx';

// --- Sub-Components ---

const WorkbookQuestion = ({ questionText, questionKey, initialResponses, onUpdate }) => {
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
        <div className="mb-4 pb-2">
            <p className="workbook-question text-deep-charcoal">{questionText}</p>
            <textarea 
                value={response} 
                onChange={(e) => setResponse(e.target.value)} 
                placeholder="Write your answer here..." 
                className="w-full p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-pink-500 resize-y min-h-[100px] text-sm"
                rows="4"
            />
            <p className="text-right text-xs text-deep-charcoal/60 mt-1 h-4">{saveStatus === 'Saved' ? 'Saved' : (saveStatus === 'Saving...' ? 'Saving...' : '\u00A0')}</p>
        </div>
    );
};

const CollapsibleWorkbookSection = ({ section, stepId, initialResponses, onUpdate }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const contentRef = useRef(null);
    
    const keyPrefix = `${stepId}-${section.id}`; 
    
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = isCollapsed ? '0px' : `${contentRef.current.scrollHeight}px`;
        }
    }, [isCollapsed]);

    return (
        <div className="mb-4 border border-light-stone/50 rounded-lg shadow-sm overflow-hidden">
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex justify-between items-center p-4 font-bold text-lg transition-colors ${isCollapsed ? 'bg-pure-white/60 hover:bg-soft-linen text-deep-charcoal/80' : 'bg-pink-600 text-white hover:bg-pink-700'}`}
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
                                onUpdate={onUpdate}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const WorkbookTopic = ({ topic, onBack, initialResponses, onUpdate }) => {
    
    // --- CHECK FOR CUSTOM COMPONENT (UPDATED) ---
    const renderCustomTool = () => {
        switch (topic.customComponent) {
            case 'SmartGoalTool': return <SmartGoalTool />;
            case 'CBATool': return <CBATool />;
            case 'ABCTool': return <ABCTool />;
            case 'UrgeLogTool': return <UrgeLogTool />;
            case 'LifestyleBalanceTool': return <LifestyleBalanceTool />;
            // New Tools Added:
            case 'SelfCompassionTool': return <SelfCompassionTool />;
            case 'FiveQuestionsTool': return <FiveQuestionsTool />;
            case 'DentsTool': return <DentsTool />;
            case 'PersonifyTool': return <PersonifyTool />;
            case 'BoundariesTool': return <BoundariesTool />;
            default: return null;
        }
    };

    // Render Custom Tool View
    if (topic.customComponent) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
                <div className="flex justify-between items-start mb-4 flex-shrink-0">
                    <button onClick={onBack} className="flex items-center text-pink-600 hover:text-pink-700 font-semibold">
                        <ArrowLeftIcon /><span className="ml-2">Back</span>
                    </button>
                </div>
                <h3 className="text-2xl font-bold text-deep-charcoal mb-4 flex-shrink-0">{topic.title}</h3>
                <div className="overflow-y-auto flex-grow pr-2">
                    {renderCustomTool()}
                </div>
            </div>
        );
    }

    // --- STANDARD RENDER LOGIC ---
    const handleExportPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const maxTextWidth = pageWidth - (margin * 2);
        let yPos = 20;

        doc.setFontSize(18);
        doc.text(topic.title, margin, yPos);
        yPos += 15;

        if (topic.quote) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'italic');
            const splitQuote = doc.splitTextToSize(`"${topic.quote}"`, maxTextWidth);
            doc.text(splitQuote, margin, yPos);
            yPos += (splitQuote.length * 7) + 10;
            doc.setFont(undefined, 'normal');
        }

        const addContent = (question, key) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(11);
            doc.setTextColor(50); 
            const splitQ = doc.splitTextToSize(question, maxTextWidth);
            doc.text(splitQ, margin, yPos);
            yPos += (splitQ.length * 6) + 2;

            const answer = initialResponses[key] || "(No answer provided)";
            doc.setFontSize(10);
            doc.setTextColor(0); 
            const splitA = doc.splitTextToSize(answer, maxTextWidth - 5);
            doc.text(splitA, margin + 5, yPos); 
            yPos += (splitA.length * 6) + 10; 
        };

        if (topic.sections) {
            topic.sections.forEach(section => {
                const keyPrefix = `${topic.id}-${section.id}`;
                
                if (yPos > 270) { doc.addPage(); yPos = 20; }
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(section.title, margin, yPos);
                doc.setFont(undefined, 'normal');
                yPos += 10;

                section.questions.forEach((q, i) => {
                    const key = `${keyPrefix}-${i + 1}`;
                    addContent(q, key);
                });
            });
        } else {
            addContent(topic.prompt, topic.id);
        }

        doc.save(`${topic.title.replace(/\s+/g, '_')}_Workbook.pdf`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
                <button onClick={onBack} className="flex items-center text-pink-600 hover:text-pink-700 font-semibold"><ArrowLeftIcon /><span className="ml-2">Back</span></button>
                <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 bg-gray-100 text-deep-charcoal text-sm font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Download this topic as a PDF"
                >
                    <DownloadIcon className="w-4 h-4" /> Export PDF
                </button>
            </div>
            
            <h3 className="text-2xl font-bold text-deep-charcoal mb-2 flex-shrink-0">{topic.title}</h3>
            
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
                            onUpdate={onUpdate}
                        />
                    ))
                ) : (
                    <WorkbookQuestion 
                        questionText={topic.prompt} 
                        questionKey={topic.id} 
                        initialResponses={initialResponses} 
                        onUpdate={onUpdate}
                    />
                )}
            </div>
        </div>
    );
};

const WorkbookCategory = ({ category, onSelectTopic, onBack, completedTopicIds }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
        <button onClick={onBack} className="flex items-center text-pink-600 hover:text-pink-700 mb-4 font-semibold"><ArrowLeftIcon /><span className="ml-2">Back to Workbook Sections</span></button>
        <h2 className="text-2xl font-bold text-deep-charcoal mb-2">{category.title}</h2>
        <p className="text-deep-charcoal/70 mb-6">{category.description}</p>
        <ul className="space-y-3">
            {category.topics.map(topic => (
                <li key={topic.id}>
                    <button onClick={() => onSelectTopic(topic)} className="w-full text-left p-4 bg-pure-white/60 hover:bg-pink-100 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 flex items-center justify-between">
                        <h3 className="font-semibold text-deep-charcoal">{topic.title}</h3>
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
                <h3 className="text-xl font-bold text-deep-charcoal flex items-center gap-2">
                    <SparklesIcon className="text-pink-500 w-6 h-6"/> AI-Powered Insights
                </h3>
                <button onClick={onClose} className="text-deep-charcoal/60 hover:text-deep-charcoal text-2xl">&times;</button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                        <Spinner />
                        <p className="mt-4 text-deep-charcoal/70">Analyzing your workbook entries...</p>
                    </div>
                ) : (
                    <div className="text-deep-charcoal/80 space-y-4 whitespace-pre-wrap">
                        {insights.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                    </div>
                )}
            </div>
            <div className="flex-shrink-0">
                <button onClick={onClose} className="w-full bg-light-stone/50 text-deep-charcoal/80 font-semibold py-2 px-4 rounded-lg hover:bg-light-stone/70">
                    Close
                </button>
            </div>
        </div>
    </div>
);

const RecoveryWorkbook = () => {
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

    const handleResponseUpdate = (key, value) => {
        setWorkbookResponses(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // --- UPDATED LOGIC FOR 100% COMPLETION ---
    const completedTopicIds = useMemo(() => {
        const completed = new Set();
        Object.values(workbookData).forEach(category => {
            if (category && category.topics) {
                category.topics.forEach(topic => {
                    let isComplete = true; // Assume complete

                    if (topic.sections) {
                        // Complex Topic (e.g., Steps): Check EVERY question in EVERY section
                        for (const section of topic.sections) {
                            for (let i = 0; i < section.questions.length; i++) {
                                const key = `${topic.id}-${section.id}-${i + 1}`;
                                const response = workbookResponses[key];
                                // If ANY question is missing/empty, fail completion
                                if (!response || response.trim().length === 0) {
                                    isComplete = false;
                                    break; 
                                }
                            }
                            if (!isComplete) break; // Fail fast
                        }
                    } else {
                        // Simple Topic: Check single prompt
                        // For custom tools, we currently don't track detailed completion in this loop
                        // so we assume they are 'incomplete' or handle it differently.
                        // For now, only text-based topics are checked for completion string.
                        if (!topic.customComponent) {
                             const response = workbookResponses[topic.id];
                             if (!response || response.trim().length === 0) {
                                isComplete = false;
                             }
                        }
                    }

                    if (isComplete && !topic.customComponent) {
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

        const prompt = `You are an AI assistant for a recovery application called "My Recovery Toolkit." Your role is to provide compassionate, encouraging, and insightful reflections based on a user's workbook entries. Do not give medical advice. Focus on identifying themes, patterns, and opportunities for growth based on recovery principles. The user has provided the following workbook answers:\n\n${allResponsesText}\n\nBased on these entries, provide a few paragraphs of gentle, insightful feedback. Identify 2-3 key themes and suggest which recovery principles or workbook sections might be helpful to focus on next. Frame your response as a supportive guide.`;

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
    if (selectedTopic) return <WorkbookTopic 
                                topic={selectedTopic} 
                                onBack={() => setSelectedTopic(null)} 
                                initialResponses={workbookResponses} 
                                onUpdate={handleResponseUpdate} 
                              />;
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
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">Recovery Workbook</h2> 
            <p className="text-deep-charcoal/70 mb-6">Track your progress through the exercises.</p> 
            <div className="mb-6"> 
                <div className="flex justify-between items-center mb-1"> 
                    <span className="text-sm font-semibold text-deep-charcoal/70">Overall Progress</span> 
                    <span className="text-sm font-semibold text-pink-600">{overallCompletion.percentage}%</span> 
                </div> 
                <div className="w-full bg-light-stone/50 rounded-full h-2.5">
                    <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${overallCompletion.percentage}%` }}></div>
                </div> 
            </div> 
            <div className="mt-6 mb-4 border-t pt-6">
                <button
                    onClick={handleGenerateInsights}
                    className="w-full flex items-center justify-center gap-2 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:brightness-95 transition-colors"
                >
                    <SparklesIcon className="w-5 h-5"/> Get AI Insights on Your Work
                </button>
                <p className="text-xs text-deep-charcoal/60 text-center mt-2">Analyzes your completed entries to find themes and patterns in your recovery journey.</p>
            </div>
            <ul className="space-y-4"> 
                {Object.keys(workbookData).map(key => { 
                    const category = workbookData[key]; 
                    if (!category) return null; 
                    const { completed, total, percentage } = calculateCompletion(key); 
                    return ( 
                        <li key={key}> 
                            <button onClick={() => setActiveCategory(category)} className="w-full text-left p-4 bg-pure-white/60 hover:bg-pink-100 rounded-lg shadow-sm"> 
                                <h3 className="font-semibold text-deep-charcoal text-lg">{category.title}</h3> 
                                <p className="text-deep-charcoal/70 mt-1 text-sm">{category.description}</p> 
                                <div className="mt-3"> 
                                    <div className="flex justify-between items-center mb-1"> 
                                        <span className="text-xs font-semibold text-deep-charcoal/60">{completed} / {total} Completed</span> 
                                        <span className="text-xs font-semibold text-pink-600">{percentage}%</span> 
                                    </div> 
                                    <div className="w-full bg-light-stone/50 rounded-full h-1.5">
                                        <div className="bg-pink-600 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
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

export default RecoveryWorkbook;