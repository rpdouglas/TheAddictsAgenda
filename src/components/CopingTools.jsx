import React from 'react';
// 1. Removed PuzzlePieceIcon to see if the icon name was the issue.
import { ArrowLeftIcon, ShieldIcon, ZapIcon, UsersIcon, GridIcon } from '../utils/icons.jsx'; 

const CopingTools = ({ onNavigate, onBack }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Coping Tools</h2>
                <p className="text-gray-600 mb-6">Choose a tool to help you navigate cravings and difficult emotions.</p>
            </div>

            {/* Added overflow-y-auto in case the list grows */}
            <div className="space-y-4 overflow-y-auto">
                <button
                    onClick={() => onNavigate('coping-cards')}
                    className="w-full bg-teal-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <ShieldIcon className="w-6 h-6"/> Coping Cards
                </button>

                <button
                    onClick={() => onNavigate('breathing-exercises')}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <ZapIcon className="w-6 h-6"/> Breathing Exercises
                </button>

                <button
                    onClick={() => onNavigate('yoga')}
                    className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <UsersIcon className="w-6 h-6"/> Yoga Poses
                </button>
                 <button
                    onClick={() => onNavigate('recovery-games')}
                    className="w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <GridIcon className="w-6 h-6"/> Recovery Games
                </button>

                {/* 2. This is the new button for your game */}
                {/* 3. Used GridIcon as a placeholder to fix the import error */}
                <button
                    onClick={() => onNavigate('recovery-simulator')}
                    className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                    <GridIcon className="w-6 h-6"/> Recovery Simulator
                </button>
            </div>
        </div>
    );
};

export default CopingTools;

