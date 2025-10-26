import React from 'react';
import { ArrowLeftIcon, CheckIcon, UsersIcon } from '../utils/icons.jsx'; // Added UsersIcon

export const Homegroup = ({ onBack, onNavigate }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Meetings</span>
            </button>
            
            <div className="text-center">
                <h2 className="text-2xl font-bold text-deep-charcoal mb-4">Homegroup Management</h2>
                <p className="text-deep-charcoal/70 mb-6">This is your central dashboard for homegroup-related activities.</p>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={() => onNavigate('meetingTracker')}
                    className="w-full bg-serene-teal text-white font-bold py-4 px-6 rounded-lg shadow-md hover:brightness-95 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <CheckIcon className="w-6 h-6"/> Launch Meeting Tracker
                </button>

                <button 
                    onClick={() => onNavigate('groupMembers')}
                    className="w-full bg-healing-green text-white font-bold py-4 px-6 rounded-lg shadow-md hover:brightness-95 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <UsersIcon className="w-6 h-6"/> Group Members
                </button>
            </div>
        </div>
    );
};