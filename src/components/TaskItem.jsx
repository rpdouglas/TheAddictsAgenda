// src/components/TaskItem.jsx
import React, { useState } from 'react';
import { TrashIcon, CheckIcon, InfinityIcon, FireIcon, CalendarIcon } from '../utils/icons.jsx';

// Helper to parse "YYYY-MM-DD" explicitly as LOCAL midnight.
const parseLocalDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// Helper to determine if a task is overdue
const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = parseLocalDate(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    return due < today;
};

const isPriorityTask = (task) => {
    return task.tags?.includes('actionitems');
};

const TaskItem = React.memo(({ task, onToggle, onDelete, onEdit, onEditProperties }) => {
    const isCompleted = task.completed;
    const isRecurring = task.recurrence && task.recurrence !== 'none'; 
    const isDue = task.dueDate && !isCompleted; 
    const overdue = isDue && isOverdue(task.dueDate);
    const showStreak = isRecurring && task.recurrence === 'daily'; 
    
    const [isEditingText, setIsEditingText] = useState(false);
    const [isEditingRecurrence, setIsEditingRecurrence] = useState(false);
    const [isEditingDueDate, setIsEditingDueDate] = useState(false);

    const [editText, setEditText] = useState(task.text);
    
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
    
    const localDueDate = parseLocalDate(task.dueDate);
    const formattedDueDate = localDueDate ? localDueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

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
    
    // Shared Badge Style: Vertical Layout, Fixed Size
    const badgeBaseClass = "flex flex-col justify-center items-center h-9 w-14 rounded-md transition-colors text-[9px] font-bold leading-none gap-0.5 shadow-sm border border-transparent hover:border-gray-300";

    if (isCompleted) {
        return (
            <li className="w-full flex items-center pl-3 py-3 pr-[1px] md:pr-3 bg-yellow-100/50 rounded-lg border border-yellow-100">
                <button 
                    onClick={() => onToggle(task.id)}
                    className="flex-1 flex items-center gap-3 text-left overflow-hidden pr-2"
                >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 border-2 border-yellow-500 flex items-center justify-center text-white">
                        <CheckIcon className="w-3 h-3" />
                    </div>
                    <span className="text-gray-500 line-through truncate">{task.text}</span>
                </button>
                <button 
                    onClick={() => onDelete(task.id)}
                    // FIX: Removed opacity-0 so it is visible on mobile
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 p-1 ml-auto"
                    title="Delete Task"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </li>
        );
    }
    
    // Active Task Rendering
    return (
        <li className={`w-full flex items-center pl-3 py-3 pr-[1px] md:pr-3 bg-white rounded-lg shadow-sm border border-yellow-100 group transition-all ${priorityClass}`}>
            
            {/* Left Block: Checkbox and Text */}
            <div className="flex-1 flex items-center gap-3 text-left overflow-hidden pr-2">
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
                        className="text-deep-charcoal font-medium cursor-pointer break-words"
                    >
                        {task.text}
                    </span>
                )}
            </div>
            
            {/* Right Block: Badges & Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                
                {/* Due Date Badge */}
                {isDue && (
                    isEditingDueDate ? (
                        <input
                            type="date"
                            defaultValue={task.dueDate}
                            onBlur={(e) => handleSaveProperty('dueDate', e.target.value)}
                            autoFocus
                            className="h-9 w-14 text-[9px] p-0 rounded-md border border-yellow-400 focus:outline-none bg-yellow-50 text-center"
                        />
                    ) : (
                        <button
                            onClick={() => setIsEditingDueDate(true)}
                            className={`${badgeBaseClass} ${overdue ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-50 text-gray-600'}`}
                            title="Click to edit due date"
                        >
                            <CalendarIcon className="w-3 h-3" />
                            <span>{overdue ? 'Late' : formattedDueDate}</span>
                        </button>
                    )
                )}

                {/* Streak Badge */}
                {showStreak && (
                     <div className={`${badgeBaseClass} bg-orange-50 text-orange-600 border-orange-100`}>
                        <FireIcon className="w-3 h-3" />
                        <span>{task.streakCount} Day{task.streakCount > 1 ? 's' : ''}</span>
                    </div>
                )}
                
                {/* Action Badge */}
                {isPriorityTask(task) && (
                    <div className={`${badgeBaseClass} bg-red-50 text-red-600 border-red-100`}>
                        <CheckIcon className="w-3 h-3" />
                        <span>Action</span>
                    </div>
                )}
                
                {/* Recurrence Badge */}
                {isRecurring && (
                    isEditingRecurrence ? (
                        <select
                            defaultValue={task.recurrence}
                            onBlur={(e) => handleSaveProperty('recurrence', e.target.value)}
                            autoFocus
                            className="h-9 w-14 text-[9px] p-0 rounded-md border border-teal-400 focus:outline-none bg-teal-50 text-center"
                        >
                            <option value="none">None</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Wkly</option>
                        </select>
                    ) : (
                        <button
                            onClick={() => setIsEditingRecurrence(true)}
                            className={`${badgeBaseClass} bg-teal-50 text-teal-700 border-teal-100`}
                            title="Click to edit recurrence"
                        >
                            <InfinityIcon className="w-3 h-3" />
                            <span>{task.recurrence === 'daily' ? 'Daily' : 'Weekly'}</span>
                        </button>
                    )
                )}

                {/* Delete Button */}
                <button 
                    onClick={() => onDelete(task.id)}
                    // FIX: Removed opacity-0 group-hover:opacity-100
                    className="text-gray-300 hover:text-red-500 p-1 transition-colors ml-1"
                    title="Delete Task"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </li>
    );
});

TaskItem.displayName = 'TaskItem';
export default TaskItem;