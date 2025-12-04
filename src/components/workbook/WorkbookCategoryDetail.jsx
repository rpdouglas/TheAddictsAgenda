// src/components/workbook/WorkbookCategoryDetail.jsx
import React from 'react';
import { ArrowLeftIcon, CheckCircleIcon } from '../../utils/icons.jsx';

const WorkbookCategoryDetail = ({ category, onSelectTopic, onBack, completedTopicIds }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <button onClick={onBack} className="flex items-center text-pink-600 hover:text-pink-700 mb-4 font-semibold">
                <ArrowLeftIcon /><span className="ml-2">Back to Workbook Sections</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">{category.title}</h2>
            <p className="text-deep-charcoal/70 mb-6">{category.description}</p>
            <ul className="space-y-3">
                {category.topics.map(topic => (
                    <li key={topic.id}>
                        <button onClick={() => onSelectTopic(topic)} className="w-full text-left p-4 bg-pure-white/60 hover:bg-pink-100 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 flex items-center justify-between group">
                            <div>
                                <h3 className="font-semibold text-deep-charcoal group-hover:text-pink-900 transition-colors">{topic.title}</h3>
                                {/* Show basic completion status for sections without progress bars in main view */}
                                {topic.customComponent && (
                                    <span className="text-xs text-gray-500 font-medium">Interactive Tool</span>
                                )}
                            </div>
                            {completedTopicIds.includes(topic.id) && <CheckCircleIcon className="text-green-500 w-6 h-6"/>}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WorkbookCategoryDetail;