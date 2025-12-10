// src/components/RecoveryWorkbook.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataStore from '../utils/dataStore.js';
import { workbookData } from '../utils/data.js';
import { Spinner } from './common.jsx';
// FIX: Using the resilient AI function for model fallback
import { generateContentWithFallback } from '../firebase.jsx';

// Import Refactored Components
import WorkbookMenu from './workbook/WorkbookMenu.jsx';
import WorkbookCategoryDetail from './workbook/WorkbookCategoryDetail.jsx';
import WorkbookTopicDetail from './workbook/WorkbookTopicDetail.jsx';
import WorkbookSmartTool from './workbook/WorkbookSmartTool.jsx';
import WorkbookInsightsModal from './workbook/WorkbookInsightsModal.jsx';


const RecoveryWorkbook = () => {
    const [activeCategory, setActiveCategory] = useState(null); 
    const [selectedTopic, setSelectedTopic] = useState(null); 
    const [workbookResponses, setWorkbookResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    
    const [showInsightsModal, setShowInsightsModal] = useState(false);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [aiInsights, setAiInsights] = useState('');
    const [aiActions, setAiActions] = useState([]);

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

    // --- Navigation Logic ---
    const handleNextTopic = () => {
        if (!activeCategory || !selectedTopic) return;
        const currentIndex = activeCategory.topics.findIndex(t => t.id === selectedTopic.id);
        if (currentIndex < activeCategory.topics.length - 1) {
            setSelectedTopic(activeCategory.topics[currentIndex + 1]);
            const container = document.querySelector('.overflow-y-auto');
            if (container) container.scrollTop = 0;
        }
    };

    const handlePreviousTopic = () => {
        if (!activeCategory || !selectedTopic) return;
        const currentIndex = activeCategory.topics.findIndex(t => t.id === selectedTopic.id);
        if (currentIndex > 0) {
            setSelectedTopic(activeCategory.topics[currentIndex - 1]);
            const container = document.querySelector('.overflow-y-auto');
            if (container) container.scrollTop = 0;
        }
    };

    const getCurrentTopicIndex = () => {
        if (!activeCategory || !selectedTopic) return -1;
        return activeCategory.topics.findIndex(t => t.id === selectedTopic.id);
    };
    
    const currentIndex = getCurrentTopicIndex();
    const hasNext = activeCategory && currentIndex < (activeCategory.topics.length - 1);
    const hasPrevious = activeCategory && currentIndex > 0;


    // --- Completion Logic ---
    const completedTopicIds = useMemo(() => {
        const completed = new Set();
        Object.values(workbookData).forEach(category => {
            if (category && category.topics) {
                category.topics.forEach(topic => {
                    let isComplete = true; 
                    if (topic.sections) {
                        for (const section of topic.sections) {
                            for (let i = 0; i < section.questions.length; i++) {
                                const key = `${topic.id}-${section.id}-${i + 1}`;
                                const response = workbookResponses[key];
                                if (!response || response.trim().length === 0) {
                                    isComplete = false;
                                    break; 
                                }
                            }
                            if (!isComplete) break; 
                        }
                    } else {
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

    // --- AI Generation ---
    const handleGenerateInsights = async () => {
        setIsGeneratingInsights(true);
        setShowInsightsModal(true);
        setAiInsights('');
        setAiActions([]);

        const allResponsesText = Object.entries(workbookResponses)
            .filter(([, value]) => value && value.trim().length > 0)
            .map(([key, value]) => `Entry ID: ${key}\nUser's Answer: "${value}"`)
            .join('\n---\n');

        if (allResponsesText.length === 0) {
            setAiInsights("You haven't written any workbook responses yet. Write some answers, and then I can provide insights!");
            setIsGeneratingInsights(false);
            return;
        }

        const prompt = `You are an AI assistant for "My Recovery Toolkit." Provide insightful reflections based on the user's workbook entries below. Focus on identifying themes and opportunities for growth.
        
        Entries:
        ${allResponsesText}

        IMPORTANT: At the very end of your response, provide a section titled "SUGGESTED_ACTIONS" followed by exactly 3 short, concrete, actionable bullet points (no bolding, no markdown) to support their recovery.
        
        Example end format:
        SUGGESTED_ACTIONS
        - Discuss Step 1 with sponsor
        - Practice daily self-compassion
        - Attend a new meeting`;
        
        // Ensure some logging is happening
        console.log("AI DEBUG (Input Data Length):", allResponsesText.length);
        console.log("AI DEBUG (Final Prompt):", prompt.substring(0, 500) + '... (truncated)');


       try {
            const result = await generateContentWithFallback(prompt); 
            
            // FIX: Correctly extract the nested text from the successful API result, matching the AITestTool logic.
            const responseText = result.text?.trim() ?? '';
            
            // 2. Parse Response (Using the successful string-splitting method)
            const parts = responseText.split('SUGGESTED_ACTIONS');
            const mainText = parts[0].trim();
            const actionText = parts.length > 1 ? parts[1].trim() : '';
            
            const extractedActions = actionText
                .split('\n')
                .map(line => line.replace(/^-/, '').trim())
                .filter(line => line.length > 0)
                .slice(0, 3);

            setAiInsights(mainText);
            setAiActions(extractedActions);
        } catch (error) {
            // CRITICAL FIX: Use console.error and include 'debugger' to force visibility.
            // When debugging, this will automatically pause execution.
            debugger; 
            console.error("!! AI CRITICAL FAILURE !! (Check Firebase logs for details) Error Object:", error);
            
            // Provide a neutral message to the user advising them to check the console.
            setAiInsights("The AI service encountered a failure. Please open your Developer Console (F12) and look for the '!! AI CRITICAL FAILURE !!' error to find the technical details.");
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    const handleSaveActionPlan = async (actionsToSave) => {
        const currentJournal = await DataStore.load(DataStore.KEYS.JOURNAL) || [];
        const allTags = await DataStore.load(DataStore.KEYS.JOURNAL_TAGS) || [];
        const currentGoals = await DataStore.load(DataStore.KEYS.GOALS) || [];

        // NEW LOGIC: Calculate default due date (7 days from now)
        const today = new Date();
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);
        const defaultDueDate = sevenDaysFromNow.toISOString().split('T')[0]; // YYYY-MM-DD

        const formattedList = actionsToSave.map(a => `- ${a}`).join('\n');
        const newEntry = {
            id: DataStore.generateId(),
            text: `AI Action Plan (Workbook Insights):\n\n${formattedList}`,
            mood: 0,
            tags: ['actionitems', 'workbook'],
            timestamp: new Date().toISOString()
        };
        await DataStore.save(DataStore.KEYS.JOURNAL, [newEntry, ...currentJournal]);
        
        const newTags = ['actionitems', 'workbook'].filter(t => !allTags.includes(t));
        if (newTags.length > 0) {
            await DataStore.save(DataStore.KEYS.JOURNAL_TAGS, [...allTags, ...newTags].sort());
        }

        let updatedGoals = [...currentGoals];
        for (const actionText of actionsToSave) {
            
            // NEW TASK OBJECT TEMPLATE for AI actions
            // Includes default recurrence: 'none' and the calculated 7-day due date
            const newGoalTemplate = {
                id: DataStore.generateId(),
                text: actionText,
                completed: false,
                createdAt: new Date().toISOString(),
                recurrence: 'none', 
                dueDate: defaultDueDate, 
                streakCount: 0,
                lastCompleted: null,
                tags: ['actionitems'] // Explicitly tag as action item
            };

            const existingGoalIndex = updatedGoals.findIndex(g => g.text.toLowerCase() === actionText.toLowerCase());
            
            if (existingGoalIndex !== -1) {
                if (window.confirm(`"${actionText}" exists in To-Do list.\nClick OK to reset/reactivate it, or Cancel to duplicate.`)) {
                    updatedGoals[existingGoalIndex] = {
                        ...updatedGoals[existingGoalIndex],
                        completed: false,
                        // Reset properties upon reactivating existing goal
                        recurrence: 'none', 
                        dueDate: defaultDueDate,
                        createdAt: new Date().toISOString()
                    };
                } else {
                    // Duplication uses the new template
                    updatedGoals.push(newGoalTemplate);
                }
            } else {
                // New goal uses the new template
                updatedGoals.push(newGoalTemplate);
            }
        }
        await DataStore.save(DataStore.KEYS.GOALS, updatedGoals);
    };
    
    if (isLoading) return <Spinner />;
    
    // --- View Routing ---
    if (selectedTopic) {
        if (selectedTopic.customComponent) {
            return <WorkbookSmartTool 
                        topic={selectedTopic} 
                        onBack={() => setSelectedTopic(null)} 
                        onNext={handleNextTopic}
                        onPrevious={handlePreviousTopic}
                        hasNext={hasNext}
                        hasPrevious={hasPrevious}
                    />;
        }
        return <WorkbookTopicDetail 
                    topic={selectedTopic} 
                    onBack={() => setSelectedTopic(null)} 
                    initialResponses={workbookResponses} 
                    onUpdate={handleResponseUpdate} 
                    onNext={handleNextTopic}
                    onPrevious={handlePreviousTopic}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
               />;
    }
    
    if (activeCategory) {
        return <WorkbookCategoryDetail 
                    category={activeCategory} 
                    onSelectTopic={setSelectedTopic} 
                    onBack={() => setActiveCategory(null)} 
                    completedTopicIds={completedTopicIds} 
               />;
    }
    
    return ( 
        <>
            {showInsightsModal && (
                <WorkbookInsightsModal 
                    onClose={() => setShowInsightsModal(false)}
                    isLoading={isGeneratingInsights}
                    insights={aiInsights}
                    actions={aiActions}
                    onSaveActions={handleSaveActionPlan}
                />
            )}
            <WorkbookMenu 
                workbookData={workbookData} 
                calculateCompletion={calculateCompletion} 
                overallCompletion={overallCompletion} 
                onSelectCategory={setActiveCategory}
                onGenerateInsights={handleGenerateInsights}
            />
        </>
    );
};

export default RecoveryWorkbook;