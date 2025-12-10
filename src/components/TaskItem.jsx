// src/components/TaskItem.jsx
import React, { useState } from 'react';
import { TrashIcon, CheckIcon, RepeatIcon, FireIcon, CalendarIcon, PenIcon } from '../utils/icons.jsx';

// Helper to determine if a task is overdue
const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    // Normalize date strings to midnight for comparison
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    return dueDay < todayDay;
};

// Function to check if a task is an AI Action Item for the priority accent
const isPriorityTask = (task) => {
    return task.tags?.includes('actionitems');
};

const TaskItem = React.memo(({ task, onToggle, onDelete, onEdit, onEditProperties }) => {
    const isCompleted = task.completed;
    const isRecurring = task.recurrence && task.recurrence !== 'none'; 
    const isDue = task.dueDate && !isCompleted; 
    const overdue = isDue && isOverdue(task.dueDate);
    const showStreak = isRecurring && task.recurrence === 'daily'; 
    
    // Manage in-place editing for task text and properties
    const [isEditingText, setIsEditingText] = useState(false);
    const [isEditingRecurrence, setIsEditingRecurrence] = useState(false);
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);

    const [editText, setEditText] = useState(task.text);
    
    // Priority accent based on source/status
    let priorityClass = 'border-l-4 border-yellow-200';
    if (overdue) {
        priorityClass = 'border-l-4 border-red-600 bg-red-50/50';
    } else if (isPriorityTask(task)) {
        priorityClass = 'border-l-4 border-red-500';
    } else if (isRecurring) {
        priorityClass = 'border-l-4 border-teal-500';
    } else {
        priorityClass = 'border-l-4 border-gray-300';
    }
    
    // Format due date for display
    const formattedDueDate = isDue ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

    const handleSaveEdit = () => {
        if (editText.trim() && editText !== task.text) {
            onEdit(task.id, editText.trim());
        }
        setIsEditingText(false);
    };

    const handleSaveProperty = (property, newValue) => {
        if (property === 'dueDate') {
            if (newValue !== task.dueDate) {
                onEditProperties(task.id, { dueDate: newValue });
            }
            setIsEditingDueDate(false);
        } else if (property === 'recurrence') {
            if (newValue !== task.recurrence) {
                onEditProperties(task.id, { recurrence: newValue });
            }
            setIsEditingRecurrence(false);
        }
    };
    
    if (isCompleted) {
        return (
            <li className="flex items-center justify-between p-3 bg-yellow-100/50 rounded-lg border border-yellow-100">
                <button 
                    onClick={() => onToggle(task.id)}
                    className="flex items-center gap-3 text-left flex-grow"
                >
                    <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-yellow-500 flex items-center justify-center text-white">
                        <CheckIcon className="w-3 h-3" />
                    </div>
                    <span className="text-gray-500 line-through">{task.text}</span>
                </button>
                <button 
                    onClick={() => onDelete(task.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Delete Task"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </li>
        );
    }
    
    // Active Task Rendering
    return (
        <li className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-yellow-100 group transition-all ${priorityClass}`}>
            
            {/* Left side: Checkbox and Text/Input */}
            <div className="flex items-center gap-3 text-left flex-grow">
                <button 
                    onClick={() => onToggle(task.id)}
                    className="flex-shrink-0"
                >
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-transparent hover:border-teal-500 transition-colors">
                        <CheckIcon className="w-3 h-3" />
                    </div>
                </button>

                {isEditingText ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                        }}
                        autoFocus
                        className="w-full text-deep-charcoal font-medium border-b border-yellow-400 focus:outline-none bg-yellow-50"
                    />
                ) : (
                    <span 
                        onClick={() => setIsEditingText(true)}
                        className="text-deep-charcoal font-medium flex-grow cursor-pointer"
                    >
                        {task.text}
                    </span>
                )}
            </div>
            
            {/* Right side: Auxiliary information */}
            <div className="flex space-x-1 ml-auto items-center">
                
                {!isEditingText && (
                    <button 
                        onClick={() => setIsEditingText(true)}
                        className="text-gray-300 hover:text-yellow-600 p-1 transition-colors opacity-0 group-hover:opacity-100"
                        title="Edit Task Text"
                    >
                        <PenIcon className="w-4 h-4" />
                    </button>
                )}
                
                {/* Due Date Badge - Abbreviated & Condensed */}
                {isDue && (
                    isEditingDueDate ? (
                        <input
                            type="date"
                            defaultValue={task.dueDate}
                            onBlur={(e) => handleSaveProperty('dueDate', e.target.value)}
                            autoFocus
                            className="text-[10px] font-bold w-20 p-0.5 rounded-md border border-yellow-400 focus:outline-none bg-yellow-50"
                        />
                    ) : (
                        <button
                            onClick={() => setIsEditingDueDate(true)}
                            // CHANGED: text-[10px], px-1.5, 'Late' instead of 'OVERDUE'
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center whitespace-nowrap transition-colors ${overdue ? 'bg-red-200 text-red-800 hover:bg-red-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Click to edit due date"
                        >
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {overdue ? 'Late' : formattedDueDate}
                        </button>
                    )
                )}

                {/* Streak Badge - Condensed */}
                {showStreak && (
                     <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-full flex items-center whitespace-nowrap">
                        <FireIcon className="w-3 h-3 mr-1" />
                        {task.streakCount} Day{task.streakCount > 1 ? 's' : ''}
                    </span>
                )}
                
                {/* Action Badge - Abbreviated & Condensed */}
                {isPriorityTask(task) && (
                    // CHANGED: text-[10px], px-1.5, 'Action' instead of 'Action Item'
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        Action
                    </span>
                )}
                
                {/* Recurrence Badge - Condensed */}
                {isRecurring && (
                    isEditingRecurrence ? (
                        <select
                            defaultValue={task.recurrence}
                            onBlur={(e) => handleSaveProperty('recurrence', e.target.value)}
                            autoFocus
                            className="text-[10px] font-bold w-16 p-0.5 rounded-md border border-teal-400 focus:outline-none bg-teal-50"
                        >
                            <option value="none">None</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Wkly</option>
                        </select>
                    ) : (
                        <button
                            onClick={() => setIsEditingRecurrence(true)}
                            // CHANGED: text-[10px], px-1.5
                            className="text-[10px] font-bold text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded-full flex items-center whitespace-nowrap hover:bg-teal-200 transition-colors"
                            title="Click to edit recurrence"
                        >
                            <RepeatIcon className="w-3 h-3 mr-1" />
                            {task.recurrence === 'daily' ? 'Daily' : 'Weekly'}
                        </button>
                    )
                )}
            </div>

            <button 
                onClick={() => onDelete(task.id)}
                className="text-gray-300 hover:text-red-500 p-1 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                title="Delete Task"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </li>
    );
});

TaskItem.displayName = 'TaskItem';
export default TaskItem;