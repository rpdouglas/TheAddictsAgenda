// src/components/Goals.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckCircleIcon, CheckIcon } from '../utils/icons.jsx';
import { logDailyAction } from '../utils/journalLogger.js';

const Goals = ({ onBack }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isLoading, setIsLoading] = useState(true);

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

        const task = {
            id: DataStore.generateId(),
            text: newTask.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        const updatedTasks = [task, ...tasks];
        await saveTasks(updatedTasks);
        setNewTask('');
    };

    const toggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newCompletedStatus = !task.completed;

        const updatedTasks = tasks.map(t => 
            t.id === taskId ? { ...t, completed: newCompletedStatus } : t
        );
        
        // 1. Save Task Update
        await saveTasks(updatedTasks);

        // 2. Log to Journal if marking AS COMPLETE
        if (newCompletedStatus) {
            console.log("Task completed, attempting to log to journal...");
            await logDailyAction(task.text, 'todolist');
        }
    };

    const deleteTask = async (taskId) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        await saveTasks(updatedTasks);
    };

    const activeTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="bg-yellow-50 p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            {/* --- Header --- */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <button onClick={onBack} className="flex items-center text-yellow-700 hover:text-yellow-800 font-semibold transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
                </button>
                <h2 className="text-2xl font-bold text-yellow-800">My To-Do List</h2>
            </div>

            {/* --- Input Area --- */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
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
            </form>

            {/* --- Task Lists --- */}
            <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                
                {/* Active Tasks */}
                {activeTasks.length > 0 && (
                    <ul className="space-y-2">
                        {activeTasks.map(task => (
                            <li key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-yellow-100 group">
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className="flex items-center gap-3 text-left flex-grow"
                                >
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-transparent hover:border-yellow-500 transition-colors">
                                        <CheckIcon className="w-3 h-3" />
                                    </div>
                                    <span className="text-deep-charcoal font-medium">{task.text}</span>
                                </button>
                                <button 
                                    onClick={() => deleteTask(task.id)}
                                    className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete Task"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </li>
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

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-yellow-700/70 uppercase tracking-wider mb-2">Completed</h3>
                        <ul className="space-y-2 opacity-75">
                            {completedTasks.map(task => (
                                <li key={task.id} className="flex items-center justify-between p-3 bg-yellow-100/50 rounded-lg border border-yellow-100">
                                    <button 
                                        onClick={() => toggleTask(task.id)}
                                        className="flex items-center gap-3 text-left flex-grow"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-yellow-500 flex items-center justify-center text-white">
                                            <CheckIcon className="w-3 h-3" />
                                        </div>
                                        <span className="text-gray-500 line-through">{task.text}</span>
                                    </button>
                                    <button 
                                        onClick={() => deleteTask(task.id)}
                                        className="text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;