// src/components/Goals.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import { PlusIcon, TrashIcon, CheckCircleIcon, ClockIcon, CalendarIcon, ArrowLeftIcon } from '../utils/icons.jsx'; 
import { logDailyAction } from '../utils/journalLogger.js';
import TaskItem from './TaskItem.jsx'; 
import CollapsibleSection from './CollapsibleSection.jsx'; // Import Collapse Component

// Helper function to check if the new completion is consecutive
const isConsecutive = (lastCompletedISO) => {
    if (!lastCompletedISO) return false;
    
    const lastDate = new Date(lastCompletedISO);
    const today = new Date();
    
    // Normalize dates to midnight for accurate comparison
    const nowDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    
    // Calculate difference in milliseconds
    const diffTime = nowDay.getTime() - lastDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // Consecutive means 1 day difference (completed yesterday)
    return diffDays === 1;
};


const Goals = ({ onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [recurrenceType, setRecurrenceType] = useState('none'); 
    const [showHistory, setShowHistory] = useState(false); 
    const [dueDate, setDueDate] = useState(''); 


    // Utility function to clone a recurring task for the next cycle
    const cloneTaskForRecurrence = (task, newStreak) => {
        // NEW LOGIC: Calculate next due date for the cloned task
        let nextDueDate = task.dueDate;
        if (task.dueDate && task.recurrence === 'daily') {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            nextDueDate = tomorrow.toISOString().split('T')[0];
        } else if (task.dueDate && task.recurrence === 'weekly') {
             const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            nextDueDate = nextWeek.toISOString().split('T')[0];
        }

        return {
            ...task,
            id: DataStore.generateId(), // New unique ID
            completed: false, // Ready for the next cycle
            createdAt: new Date().toISOString(), 
            lastCompleted: null, 
            streakCount: newStreak, 
            dueDate: nextDueDate, // Apply the newly calculated due date
        };
    };
    
    // Load tasks from storage on mount
    useEffect(() => {
        const loadTasks = async () => {
            setIsLoading(true);
            const storedTasks = await DataStore.load(DataStore.KEYS.GOALS) || [];
            
            // FIX: Ensure all loaded tasks have necessary properties initialized
            const initializedTasks = storedTasks.map(t => ({
                ...t,
                recurrence: t.recurrence ?? 'none', 
                streakCount: t.streakCount ?? 0,
                lastCompleted: t.lastCompleted ?? null,
                dueDate: t.dueDate ?? '' 
            }));
            
            setTasks(Array.isArray(initializedTasks) ? initializedTasks : []);
            setIsLoading(false);
        };
        loadTasks();
    }, []);

    // Save tasks whenever they change
    const saveTasks = async (updatedTasks) => {
        setTasks(updatedTasks);
        await DataStore.save(DataStore.KEYS.GOALS, updatedTasks);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const task = {
            id: DataStore.generateId(),
            text: newTask.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            recurrence: recurrenceType, 
            dueDate: dueDate || '', 
            streakCount: 0, 
            lastCompleted: null, 
        };

        const updatedTasks = [task, ...tasks];
        await saveTasks(updatedTasks);
        setNewTask('');
        setRecurrenceType('none'); 
        setDueDate(''); 
    };

    // Handle In-Place Editing of Task Text
    const handleEditTask = async (taskId, newText) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, text: newText } : t
        );
        await saveTasks(updatedTasks);
    };

    // NEW: Handle Editing of Task Properties (Due Date, Recurrence)
    const handleEditProperties = async (taskId, properties) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, ...properties } : t
        );
        await saveTasks(updatedTasks);
    };

    // Handle marking a completed task as incomplete (from history)
    const handleMarkIncomplete = async (taskId) => {
        const taskToReactivate = tasks.find(t => t.id === taskId);
        if (!taskToReactivate) return;

        // 1. Reset the task's completion status and history properties
        const reactivatedTask = {
            ...taskToReactivate,
            completed: false,
            completedAt: null,
            // Restore recurrence status from the original completed instance
            recurrence: taskToReactivate.recurrence || 'none', 
            // Reset streak/lastCompleted (new streak starts when they complete it again)
            streakCount: 0,
            lastCompleted: null,
        };

        // 2. Remove the old completed version and add the active version back to the list
        const filteredTasks = tasks.filter(t => t.id !== taskId);
        
        // 3. Save the new list (active tasks should always come first)
        await saveTasks([reactivatedTask, ...filteredTasks]);
        
        if (showHistory) {
            setShowHistory(false);
        }
    };


    const toggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newCompletedStatus = !task.completed;
        let updatedTasks = tasks;
        
        // Only run logic if marking AS COMPLETE
        if (newCompletedStatus) {
            await logDailyAction(task.text, 'todolist'); // Log to Journal
            
            // Handle Recurrence and Streak Logic (Only for 'daily' and 'weekly' tasks)
            if (task.recurrence === 'daily' || task.recurrence === 'weekly') {
                const nowISO = new Date().toISOString();
                let newStreak = task.streakCount;
                const completedToday = task.lastCompleted && new Date(task.lastCompleted).toDateString() === new Date().toDateString();

                // 1. Calculate New Streak 
                if (task.recurrence === 'daily') {
                    if (isConsecutive(task.lastCompleted)) {
                        newStreak += 1;
                    } else if (!task.lastCompleted && !completedToday) {
                        newStreak = 1;
                    } else if (!completedToday) {
                        newStreak = 1; 
                    }
                }
                if (task.recurrence === 'weekly') {
                    newStreak = (task.lastCompleted && !completedToday) ? (task.streakCount + 1) : 1; 
                }

                // 2. Clone for Next Recurrence
                const clonedTask = cloneTaskForRecurrence(task, newStreak);
                
                // A. Mark the original task as completed and update history properties
                const completedTask = { 
                    ...task, 
                    completed: true, 
                    // CRITICAL: We MUST save the original recurrence type here so it can be restored on Mark Incomplete.
                    originalRecurrence: task.recurrence, 
                    recurrence: 'none', 
                    completedAt: nowISO, 
                    streakCount: newStreak, 
                    lastCompleted: nowISO, 
                };
                
                // B. Replace the original task with the completed version in the list
                updatedTasks = updatedTasks.map(t => t.id === taskId ? completedTask : t);
                
                // C. Add the new, active instance to the top of the list
                updatedTasks = [clonedTask, ...updatedTasks];

            } else {
                // Standard toggle (for single-use tasks)
                updatedTasks = tasks.map(t => 
                    t.id === taskId ? { ...t, completed: newCompletedStatus, completedAt: newCompletedStatus ? new Date().toISOString() : null } : t
                );
            }
        } else {
             // If marking INCOMPLETE, standard toggle
            updatedTasks = tasks.map(t => 
                t.id === taskId ? { ...t, completed: newCompletedStatus, completedAt: null } : t
            );
        }
        
        await saveTasks(updatedTasks);
    };

    const deleteTask = async (taskId) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        await saveTasks(updatedTasks);
    };

    const allActiveTasks = tasks.filter(t => !t.completed);
    
    // GROUPING LOGIC
    // 1. Recurring Tasks: Any task with a recurrence type other than 'none'
    const recurringTasks = allActiveTasks.filter(t => t.recurrence !== 'none');
    
    // 2. Action Items & Tasks: All other active tasks (recurrence is 'none')
    const actionItems = allActiveTasks.filter(t => t.recurrence === 'none');


    // Separate completed tasks logic for the History View
    const completedTasks = tasks.filter(t => t.completed && t.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // Group completed tasks by date for History View
    const groupedCompletedTasks = completedTasks.reduce((acc, task) => {
        const dateKey = new Date(task.completedAt).toDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(task);
        return acc;
    }, {});


    const renderHistoryView = () => {
        return (
            <div className="space-y-6">
                {Object.entries(groupedCompletedTasks).map(([dateKey, dailyTasks]) => (
                    <div key={dateKey} className="border-l-4 border-yellow-300 pl-3">
                        <h3 className="text-sm font-bold text-yellow-700 uppercase tracking-wider mb-2">{dateKey}</h3>
                        <ul className="space-y-2">
                            {dailyTasks.map(task => (
                                <li key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-yellow-100">
                                    <div className="flex items-center gap-3">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700 line-through">{task.text}</span>
                                    </div>
                                    <div className="flex space-x-3 items-center">
                                        {/* Display streak in history view */}
                                        {task.streakCount > 0 && (
                                            <span className="text-sm font-bold text-orange-500 flex items-center">
                                                🔥 {task.streakCount}
                                            </span>
                                        )}
                                        {/* Mark Incomplete Button */}
                                        <button 
                                            onClick={() => handleMarkIncomplete(task.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Mark as Incomplete / Reactivate"
                                        >
                                            <ArrowLeftIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };
    

    return (
        <div className="bg-yellow-50 p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            {/* --- Header --- */}
            <div className="flex flex-col items-center mb-6 flex-shrink-0"> 
                
                {/* Title first */}
                <h2 className="text-2xl font-bold text-yellow-800 mb-2">
                    {showHistory ? 'Completion History' : 'My To-Do List'}
                </h2>
                
                {/* Button second, ensuring it is centered and has the icon */}
                <button 
                    onClick={() => setShowHistory(!showHistory)} 
                    className="flex items-center text-yellow-700 hover:text-yellow-800 font-semibold transition-colors text-sm"
                >
                    <ClockIcon className="w-5 h-5 mr-1" />
                    {showHistory ? 'Back to Active Tasks' : 'View Completion History'}
                </button>
            </div>
            
            {/* Render history view if active */}
            {showHistory && completedTasks.length > 0 && (
                <div className="flex-grow overflow-y-auto pr-2">
                    {renderHistoryView()}
                </div>
            )}
            
            {/* Render active tasks view if history is not active */}
            {!showHistory && (
                <>
                    {/* --- Input Area --- */}
                    <form onSubmit={handleAddTask} className="flex flex-col gap-3 mb-6 flex-shrink-0"> 
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-grow p-3 rounded-lg border border-yellow-200 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            />
                            <button 
                                type="submit" 
                                disabled={!newTask.trim()}
                                className="bg-yellow-500 text-white font-bold p-3 rounded-lg shadow-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <PlusIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Recurrence and Due Date Selector Group */}
                        <div className="flex space-x-3">
                            {/* Recurrence Selector */}
                            <div className="flex-1 flex items-center bg-white p-2 rounded-lg border border-yellow-100 shadow-sm text-sm">
                                <label htmlFor="recurrence" className="text-gray-700 font-medium mr-2 whitespace-nowrap">Recur:</label>
                                <select
                                    id="recurrence"
                                    value={recurrenceType}
                                    onChange={(e) => setRecurrenceType(e.target.value)}
                                    className="p-1 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-400 bg-white w-full"
                                >
                                    <option value="none">None</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                            
                            {/* NEW: Due Date Selector */}
                            <div className="flex-1 flex items-center bg-white p-2 rounded-lg border border-yellow-100 shadow-sm text-sm">
                                <label htmlFor="dueDate" className="text-gray-700 font-medium mr-2 whitespace-nowrap">Due:</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="p-1 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-400 bg-white w-full"
                                />
                            </div>
                        </div>
                    </form>
                    
                    {/* Task Lists Grouped and Collapsible */}
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        
                        {/* 1. RECURRING PRACTICES SECTION (Default Open) */}
                        {recurringTasks.length > 0 && (
                            <CollapsibleSection 
                                title="Recurring Practices" 
                                taskCount={recurringTasks.length} 
                                defaultOpen={true}
                                titleClass="text-teal-700" 
                            >
                                <ul className="space-y-2 mt-4">
                                    {recurringTasks.map(task => (
                                        <TaskItem 
                                            key={task.id} 
                                            task={task} 
                                            onToggle={toggleTask} 
                                            onDelete={deleteTask} 
                                            onEdit={handleEditTask} 
                                            onEditProperties={handleEditProperties} // Passed property handler
                                        />
                                    ))}
                                </ul>
                            </CollapsibleSection>
                        )}
                        
                        {/* 2. ACTION ITEMS & ONE-TIME TASKS (Default Closed) */}
                        {actionItems.length > 0 && (
                            <CollapsibleSection 
                                title="Action Items & Tasks" 
                                taskCount={actionItems.length} 
                                defaultOpen={false}
                                titleClass="text-yellow-800"
                            >
                                <ul className="space-y-2 mt-4">
                                    {actionItems.map(task => (
                                        <TaskItem 
                                            key={task.id} 
                                            task={task} 
                                            onToggle={toggleTask} 
                                            onDelete={deleteTask} 
                                            onEdit={handleEditTask} 
                                            onEditProperties={handleEditProperties} // Passed property handler
                                        />
                                    ))}
                                </ul>
                            </CollapsibleSection>
                        )}

                        {/* Empty State */}
                        {allActiveTasks.length === 0 && !isLoading && (
                            <div className="text-center py-10 text-yellow-700/60">
                                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No active tasks yet. Get started!</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Empty History State */}
            {showHistory && completedTasks.length === 0 && (
                <div className="text-center py-10 text-yellow-700/60 flex-grow">
                    <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No completed task history yet!</p>
                </div>
            )}
        </div>
    );
};

export default Goals;