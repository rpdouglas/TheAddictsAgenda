// src/components/Goals.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import { PlusIcon, TrashIcon, CheckCircleIcon, ClockIcon, CalendarIcon, ArrowLeftIcon } from '../utils/icons.jsx'; 
import { logDailyAction } from '../utils/journalLogger.js';
import TaskItem from './TaskItem.jsx'; 
import CollapsibleSection from './CollapsibleSection.jsx'; 

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
        let nextDueDate = task.dueDate;
        
        // FIX: Robust "Next Day" calculation using explicit local time construction.
        // This avoids UTC conversion errors that cause dates to "lag" by a day.
        const now = new Date();
        
        if (task.dueDate && task.recurrence === 'daily') {
            // Create date for Tomorrow (Local Midnight)
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            
            // Format manually to YYYY-MM-DD to enforce local persistence
            const y = tomorrow.getFullYear();
            const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
            const d = String(tomorrow.getDate()).padStart(2, '0');
            nextDueDate = `${y}-${m}-${d}`;
            
        } else if (task.dueDate && task.recurrence === 'weekly') {
            // Create date for Next Week (Local Midnight)
            const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
            
            const y = nextWeek.getFullYear();
            const m = String(nextWeek.getMonth() + 1).padStart(2, '0');
            const d = String(nextWeek.getDate()).padStart(2, '0');
            nextDueDate = `${y}-${m}-${d}`;
        }

        return {
            ...task,
            id: DataStore.generateId(), 
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
            
            // Ensure all loaded tasks have necessary properties initialized
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

    const handleEditTask = async (taskId, newText) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, text: newText } : t
        );
        await saveTasks(updatedTasks);
    };

    const handleEditProperties = async (taskId, properties) => {
        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, ...properties } : t
        );
        await saveTasks(updatedTasks);
    };

    const handleMarkIncomplete = async (taskId) => {
        const taskToReactivate = tasks.find(t => t.id === taskId);
        if (!taskToReactivate) return;

        const reactivatedTask = {
            ...taskToReactivate,
            completed: false,
            completedAt: null,
            recurrence: taskToReactivate.originalRecurrence || 'none', // Restore original
            streakCount: 0,
            lastCompleted: null,
        };

        const filteredTasks = tasks.filter(t => t.id !== taskId);
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
        
        if (newCompletedStatus) {
            await logDailyAction(task.text, 'todolist'); 
            
            if (task.recurrence === 'daily' || task.recurrence === 'weekly') {
                const nowISO = new Date().toISOString();
                let newStreak = task.streakCount;
                const completedToday = task.lastCompleted && new Date(task.lastCompleted).toDateString() === new Date().toDateString();

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

                const clonedTask = cloneTaskForRecurrence(task, newStreak);
                
                const completedTask = { 
                    ...task, 
                    completed: true, 
                    originalRecurrence: task.recurrence, 
                    recurrence: 'none', 
                    completedAt: nowISO, 
                    streakCount: newStreak, 
                    lastCompleted: nowISO, 
                };
                
                updatedTasks = updatedTasks.map(t => t.id === taskId ? completedTask : t);
                updatedTasks = [clonedTask, ...updatedTasks];

            } else {
                updatedTasks = tasks.map(t => 
                    t.id === taskId ? { ...t, completed: newCompletedStatus, completedAt: newCompletedStatus ? new Date().toISOString() : null } : t
                );
            }
        } else {
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
    const recurringTasks = allActiveTasks.filter(t => t.recurrence !== 'none');
    const actionItems = allActiveTasks.filter(t => t.recurrence === 'none');


    const completedTasks = tasks.filter(t => t.completed && t.completedAt).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

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
                                        {task.streakCount > 0 && (
                                            <span className="text-sm font-bold text-orange-500 flex items-center">
                                                🔥 {task.streakCount}
                                            </span>
                                        )}
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
            {/* Header */}
            <div className="flex flex-col items-center mb-6 flex-shrink-0"> 
                <h2 className="text-2xl font-bold text-yellow-800 mb-2">
                    {showHistory ? 'Completion History' : 'My To-Do List'}
                </h2>
                <button 
                    onClick={() => setShowHistory(!showHistory)} 
                    className="flex items-center text-yellow-700 hover:text-yellow-800 font-semibold transition-colors text-sm"
                >
                    <ClockIcon className="w-5 h-5 mr-1" />
                    {showHistory ? 'Back to Active Tasks' : 'View Completion History'}
                </button>
            </div>
            
            {showHistory && completedTasks.length > 0 && (
                <div className="flex-grow overflow-y-auto pr-2">
                    {renderHistoryView()}
                </div>
            )}
            
            {!showHistory && (
                <>
                    {/* Input Area */}
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
                        
                        <div className="flex space-x-3">
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
                    
                    {/* Task Lists */}
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        
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
                                            onEditProperties={handleEditProperties} 
                                        />
                                    ))}
                                </ul>
                            </CollapsibleSection>
                        )}
                        
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
                                            onEditProperties={handleEditProperties} 
                                        />
                                    ))}
                                </ul>
                            </CollapsibleSection>
                        )}

                        {allActiveTasks.length === 0 && !isLoading && (
                            <div className="text-center py-10 text-yellow-700/60">
                                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No active tasks yet. Get started!</p>
                            </div>
                        )}
                    </div>
                </>
            )}

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