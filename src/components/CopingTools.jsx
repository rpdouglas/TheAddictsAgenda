import React from 'react';
import { ArrowLeftIcon, ShieldIcon, ZapIcon } from '../utils/icons.jsx';

export const CopingTools = ({ onNavigate, onBack }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Coping Tools</h2>
                <p className="text-gray-600 mb-6">Choose a tool to help you navigate cravings and difficult emotions.</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => onNavigate('coping')}
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
            </div>
        </div>
    );
};