import React from 'react';
import { ArrowLeftIcon, CheckIcon, UsersIcon } from '../utils/icons.jsx'; // Added UsersIcon

export const Homegroup = ({ onBack, onNavigate }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Meetings</span>
            </button>
            
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Homegroup Management</h2>
                <p className="text-gray-600 mb-6">This is your central dashboard for homegroup-related activities.</p>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={() => onNavigate('meetingTracker')}
                    className="w-full bg-teal-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <CheckIcon className="w-6 h-6"/> Launch Meeting Tracker
                </button>

                <button 
                    onClick={() => onNavigate('groupMembers')}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <UsersIcon className="w-6 h-6"/> Group Members
                </button>
            </div>
        </div>
    );
};