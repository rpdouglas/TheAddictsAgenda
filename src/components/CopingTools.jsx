import React from 'react';
import { ArrowLeftIcon, ShieldIcon, ZapIcon, GameIcon, PuzzleIcon } from '../utils/icons.jsx'; 

const CopingTools = ({ onNavigate, onBack }) => {

    const tools = [
        {
            label: 'Coping Cards',
            icon: <ShieldIcon className="w-8 h-8" />,
            view: 'coping-cards',
            color: 'blue',
            description: 'Quick affirmations and strategies to manage cravings.'
        },
        {
            label: 'Breathing Exercise',
            icon: <ZapIcon className="w-8 h-8" />,
            view: 'breathing-exercises',
            color: 'teal',
            description: 'A guided exercise to calm your mind and body.'
        },
        {
            label: 'Recovery Jeopardy',
            icon: <GameIcon className="w-8 h-8" />,
            view: 'recovery-jeopardy',
            color: 'orange',
            description: 'Test your recovery knowledge in a fun trivia game.'
        },
        {
            label: 'Recovery Simulator',
            icon: <PuzzleIcon className="w-8 h-8" />, 
            view: 'recovery-simulator',
            color: 'green',
            description: 'Navigate challenges in this interactive life simulator.'
        }
    ];

    const colorVariants = {
        teal: 'bg-serene-teal/10 text-serene-teal',
        blue: 'bg-blue-100 text-blue-600',
        pink: 'bg-pink-100 text-pink-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        green: 'bg-green-100 text-green-600', 
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-red-600 hover:text-red-700 mb-4 font-semibold flex-shrink-0">
                <ArrowLeftIcon /><span className="ml-2">Back to Dashboard</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">Coping Tools</h2>
            <p className="text-deep-charcoal/70 mb-6">Tools to help you through cravings and difficult moments.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 overflow-y-auto flex-grow">
                {tools.map((tool) => (
                    <button
                        key={tool.view}
                        onClick={() => onNavigate(tool.view)}
                        className={`p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-shadow ${colorVariants[tool.color] || 'bg-gray-100 text-gray-800'}`}
                    >
                        <div className="mb-2">
                            {tool.icon}
                        </div>
                        <span className="font-semibold text-sm">{tool.label}</span>
                        <p className="text-xs text-deep-charcoal/60 mt-1">{tool.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CopingTools;