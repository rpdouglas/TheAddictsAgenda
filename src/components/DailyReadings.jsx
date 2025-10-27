import React from 'react';
import { ArrowLeftIcon, BookOpenIcon, SunIcon } from '../utils/icons.jsx';

const DailyReadings = ({ onBack, onNavigate }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-6">Daily Readings</h2>
            
            <div className="space-y-4">
                <button
                    onClick={() => onNavigate('reflection')}
                    className="w-full flex items-center gap-4 p-4 bg-soft-linen rounded-lg shadow-sm hover:shadow-md hover:bg-serene-teal/10 transition-all text-left"
                >
                    <div className="bg-serene-teal/20 p-3 rounded-full">
                        <BookOpenIcon className="w-6 h-6 text-serene-teal" />
                    </div>
                    <div>
                        <h3 className="font-bold text-deep-charcoal">Daily Reflections</h3>
                        <p className="text-sm text-deep-charcoal/70">Readings from AA literature for daily inspiration.</p>
                    </div>
                </button>
                <button
                    onClick={() => onNavigate('just-for-today')}
                    className="w-full flex items-center gap-4 p-4 bg-soft-linen rounded-lg shadow-sm hover:shadow-md hover:bg-hopeful-coral/10 transition-all text-left"
                >
                    <div className="bg-hopeful-coral/20 p-3 rounded-full">
                        <SunIcon className="w-6 h-6 text-hopeful-coral" />
                    </div>
                    <div>
                        <h3 className="font-bold text-deep-charcoal">Just for Today</h3>
                        <p className="text-sm text-deep-charcoal/70">Daily meditations from the NA Just for Today book.</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default DailyReadings;