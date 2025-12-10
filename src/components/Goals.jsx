// src/components/Goals.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import { PlusIcon, TrashIcon, CheckCircleIcon, ClockIcon } from '../utils/icons.jsx'; // ADDED ClockIcon
import { logDailyAction } from '../utils/journalLogger.js';
import TaskItem from './TaskItem.jsx'; 

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
    // We check against 1 because if they completed it today, the toggleTask logic handles the streak,
    // and if they've completed it already, we don't increment the streak until tomorrow.
    return diffDays === 1;
};


const Goals = ({ onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [recurrenceType, setRecurrenceType] = useState('none'); 
    // NEW: State for history view toggle
    const [showHistory, setShowHistory] = useState(false); 


    // Utility function to clone a recurring task for the next cycle
    const cloneTaskForRecurrence = (task, newStreak) => {
        return {
            ...task,
            id: DataStore.generateId(), // New unique ID
            completed: false, // Ready for the next cycle
            // Reset dates, keep new streak count
            createdAt: new Date().toISOString(), 
            lastCompleted: null, 
            streakCount: newStreak, // Pass the calculated streak
        };
    };
    
    // Load tasks from storage on mount
    useEffect(() => {
        const loadTasks = async () => {
            setIsLoading(true);
            const storedTasks = await DataStore.load(DataStore.KEYS.GOALS) || [];
            setTasks(Array.isArray(storedTasks) ? storedTasks : []);
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

        // NEW: Initialize streakCount and lastCompleted
        const task = {
            id: DataStore.generateId(),
            text: newTask.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            recurrence: recurrenceType, 
            streakCount: 0, // Initialize streak
            lastCompleted: null, // Initialize last completion date
        };

        const updatedTasks = [task, ...tasks];
        await saveTasks(updatedTasks);
        setNewTask('');
        setRecurrenceType('none'); 
    };

    const toggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newCompletedStatus = !task.completed;
        let updatedTasks = tasks;
        
        // Only run logic if marking AS COMPLETE
        if (newCompletedStatus) {
            await logDailyAction(task.text, 'todolist'); // Log to Journal
            
            // Handle Recurrence and Streak Logic (Currently only for 'daily')
            if (task.recurrence === 'daily') {
                const nowISO = new Date().toISOString();
                let newStreak = task.streakCount;
                const completedToday = task.lastCompleted && new Date(task.lastCompleted).toDateString() === new Date().toDateString();

                // 1. Calculate New Streak
                if (isConsecutive(task.lastCompleted)) {
                    // Completed yesterday, continue streak
                    newStreak += 1;
                } else if (!task.lastCompleted && !completedToday) {
                    // First completion
                    newStreak = 1;
                } else if (!completedToday) {
                    // Missed a day
                    newStreak = 1; 
                } else {
                    // Already completed today, keep current streak (will be incremented tomorrow)
                    newStreak = task.streakCount;
                }

                // 2. Clone for Next Recurrence
                const clonedTask = cloneTaskForRecurrence(task, newStreak);
                
                // A. Mark the original task as completed and update history properties
                const completedTask = { 
                    ...task, 
                    completed: true, 
                    recurrence: 'none', // Remove recurrence property from completed instance
                    completedAt: nowISO, // Mark completion time
                    streakCount: newStreak, // Final streak achieved for this instance
                    lastCompleted: nowISO, // Last time it was completed (for history)
                };
                
                // B. Replace the original task with the completed version in the list
                updatedTasks = updatedTasks.map(t => t.id === taskId ? completedTask : t);
                
                // C. Add the new, active instance to the top of the list
                updatedTasks = [clonedTask, ...updatedTasks];

            } else {
                // Standard toggle (for non-recurring or weekly recurrence toggle)
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

    const activeTasks = tasks.filter(t => !t.completed);
    
    // NEW: Separate completed tasks logic for the History View
    const completedTasks = tasks.filter(t => t.completed && t.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    // NEW: Group completed tasks by date for History View
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
                                    {/* Display streak in history view */}
                                    {task.streakCount > 0 && (
                                        <span className="text-sm font-bold text-orange-500 flex items-center">
                                            🔥 {task.streakCount}
                                        </span>
                                    )}
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
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                 <button 
                    onClick={() => setShowHistory(!showHistory)} 
                    className="flex items-center text-yellow-700 hover:text-yellow-800 font-semibold transition-colors text-sm"
                >
                    <ClockIcon className="w-5 h-5 mr-1" />
                    {showHistory ? 'Back to Active Tasks' : 'View Completion History'}
                </button>
                <h2 className="text-2xl font-bold text-yellow-800">{showHistory ? 'Completion History' : 'My To-Do List'}</h2>
                <div className="w-44"></div> {/* Spacer for alignment */}
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
                        
                        {/* Recurrence Selector */}
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-yellow-100 shadow-sm text-sm">
                            <label htmlFor="recurrence" className="text-gray-700 font-medium mr-2">Recurrence Type:</label>
                            <select
                                id="recurrence"
                                value={recurrenceType}
                                onChange={(e) => setRecurrenceType(e.target.value)}
                                className="p-1 border border-gray-300 rounded-md focus:ring-yellow-400 focus:border-yellow-400 bg-white"
                            >
                                <option value="none">None (Single Task)</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly (No streak tracking)</option>
                            </select>
                        </div>
                    </form>
                    
                    {/* Active Task Lists */}
                    <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                        
                        {/* Active Tasks */}
                        {activeTasks.length > 0 && (
                            <ul className="space-y-2">
                                {/* Use memoized TaskItem component */}
                                {activeTasks.map(task => (
                                    <TaskItem 
                                        key={task.id} 
                                        task={task} 
                                        onToggle={toggleTask} 
                                        onDelete={deleteTask} 
                                    />
                                ))}
                            </ul>
                        )}

                        {/* Empty State */}
                        {tasks.length === 0 && !isLoading && (
                            <div className="text-center py-10 text-yellow-700/60">
                                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No tasks yet. Stay organized!</p>
                            </div>
                        )}
                        
                        {/* Note: Completed tasks are no longer rendered in this view to encourage focus */}
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