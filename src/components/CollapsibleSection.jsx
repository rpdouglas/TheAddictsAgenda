// src/components/CollapsibleSection.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from '../utils/icons.jsx';

const CollapsibleSection = ({ title, children, taskCount, defaultOpen = true, titleClass = '' }) => {
    // Manages the open/closed state for this specific section instance
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggle = () => setIsOpen(!isOpen);

    // Dynamic height is controlled via CSS transition classes.
    // The max-height trick provides the animation for height change.
    const containerClasses = `overflow-hidden transition-all duration-300 ease-in-out`;
    const contentStyle = isOpen ? { maxHeight: '1000px', opacity: 1 } : { maxHeight: '0', opacity: 0 };

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
            {/* Header Button: Always visible, toggles the section */}
            <button
                onClick={toggle}
                className="w-full flex items-center justify-between p-4 focus:outline-none bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
            >
                {/* Title and Count */}
                <h3 className={`text-lg font-bold flex items-center ${titleClass}`}>
                    {title}
                    <span className="ml-3 text-sm font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        {taskCount}
                    </span>
                </h3>

                {/* Chevron Icon: Rotates with state */}
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {/* Collapsible Content Area */}
            <div 
                className={containerClasses} 
                style={contentStyle}
            >
                <div className="p-4 pt-0">
                    {/* Render the TaskItem list provided by the parent */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CollapsibleSection;