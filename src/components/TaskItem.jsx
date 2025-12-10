// src/components/TaskItem.jsx
import React from 'react';
import { TrashIcon, CheckIcon, RepeatIcon, FireIcon } from '../utils/icons.jsx'; // ADDED FireIcon

// Function to check if a task is an AI Action Item for the priority accent
const isPriorityTask = (task) => {
    return task.tags?.includes('actionitems');
};

const TaskItem = React.memo(({ task, onToggle, onDelete }) => {
    const isCompleted = task.completed;
    const isRecurring = task.recurrence && task.recurrence !== 'none'; 
    const showStreak = isRecurring && task.streakCount > 0 && task.recurrence === 'daily'; // Only show streak for daily recurrence
    
    // Priority accent based on source (Approach 1 from previous step)
    let priorityClass = 'border-l-4 border-yellow-200';
    if (isPriorityTask(task)) {
        priorityClass = 'border-l-4 border-red-500'; // Red for Action Item
    } else if (isRecurring) {
        priorityClass = 'border-l-4 border-teal-500'; // Teal for Recurring
    }
    
    if (isCompleted) {
        // Completed items now rely on the history view or are quickly cleaned up by the recurring logic
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
            <button 
                onClick={() => onToggle(task.id)}
                className="flex items-center gap-3 text-left flex-grow"
            >
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-transparent hover:border-teal-500 transition-colors">
                    <CheckIcon className="w-3 h-3" />
                </div>
                <span className="text-deep-charcoal font-medium">{task.text}</span>
                
                {/* Display tags/recurrence status */}
                <div className="flex space-x-2 ml-auto">
                    {showStreak && (
                         <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full flex items-center">
                            <FireIcon className="w-3 h-3 mr-1" />
                            {task.streakCount} Day{task.streakCount > 1 ? 's' : ''}
                        </span>
                    )}
                    {isPriorityTask(task) && (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            Action Item
                        </span>
                    )}
                    {isRecurring && (
                        <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full flex items-center">
                            <RepeatIcon className="w-3 h-3 mr-1" />
                            {task.recurrence === 'daily' ? 'Daily' : 'Weekly'}
                        </span>
                    )}
                </div>
            </button>
            <button 
                onClick={() => onDelete(task.id)}
                className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Task"
            >
                <TrashIcon className="w-4 h-4" />
            </button>
        </li>
    );
});

TaskItem.displayName = 'TaskItem';
export default TaskItem;