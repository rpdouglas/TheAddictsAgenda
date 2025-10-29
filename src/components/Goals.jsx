import React from 'react';
import { ArrowLeftIcon, StarIcon } from '../utils/icons.jsx';

/**
 * A placeholder component for the "My Tasks" feature.
 */
const Goals = ({ onBack }) => {
    return (
        <div className="bg-yellow-100 p-4 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            {/* --- Header --- */}
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <button onClick={onBack} className="flex items-center text-yellow-700 hover:text-yellow-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back</span>
                </button>
                <h2 className="text-xl font-bold text-yellow-800">My Tasks</h2>
                <div className="w-16"> {/* Spacer */} </div>
            </div>

            {/* --- Placeholder Content --- */}
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <StarIcon className="w-16 h-16 text-yellow-400 mb-4" />
                <h3 className="text-2xl font-bold text-yellow-800 mb-2">Feature Coming Soon!</h3>
                <p className="text-yellow-700 max-w-xs">
                    This task and goal-tracking feature is currently in development.
                </p>
            </div>
        </div>
    );
};

export default Goals;

