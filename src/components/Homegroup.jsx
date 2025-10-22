import React from 'react';
import { ArrowLeftIcon } from '../utils/icons.jsx';

export const Homegroup = ({ onBack }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Meetings</span>
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Homegroup Management</h2>
            <p className="text-gray-600">This is your Homegroup Management page. You can add details, contacts, or notes related to your homegroup here.</p>
        </div>
    );
};