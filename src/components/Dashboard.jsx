import React, { useState, useEffect, useMemo } from 'react';
import DataStore from '../utils/dataStore.js'; // UPDATED: Import the unified DataStore
import { Spinner } from './common.jsx';
import { RECOVERY_FACTS } from '../utils/data.js';
import { BookOpenIcon, TargetIcon, ClipboardListIcon, ShieldIcon, LibraryIcon, MapPinIcon, XIcon, CalendarIcon } from '../utils/icons.jsx';

// --- Sub-Components ---

const SobrietyTracker = ({ startDate }) => {
    const calculateTimeSober = () => {
        const diff = new Date().getTime() - new Date(startDate).getTime();
        if (diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(diff / 86400000),
            hours: Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000)
        };
    };

    const [timeSober, setTimeSober] = useState(calculateTimeSober());

    useEffect(() => {
        const timer = setInterval(() => setTimeSober(calculateTimeSober()), 1000);
        return () => clearInterval(timer);
    }, [startDate]);

    const timeUnits = [
        { label: 'Days', value: timeSober.days },
        { label: 'Hours', value: timeSober.hours },
        { label: 'Minutes', value: timeSober.minutes },
        { label: 'Seconds', value: timeSober.seconds }
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-deep-charcoal/60 mb-4">You are on your path</h3>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {timeUnits.map(unit => (
                    <div key={unit.label} className="flex flex-col items-center bg-soft-linen p-2 sm:p-3 rounded-lg">
                        <span className="text-3xl sm:text-4xl font-bold text-serene-teal">{String(unit.value).padStart(2, '0')}</span>
                        <span className="text-xs sm:text-sm text-deep-charcoal/70 uppercase tracking-wider">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WelcomeTip = ({ onDismiss }) => (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded-xl shadow-md flex justify-between items-start mb-6">
        <div className="flex-grow pr-4">
            <p className="font-bold text-blue-800 mb-1">Welcome Tip: Recovery Jargon</p>
            <p className="text-sm text-blue-700">
                You'll see terms like **HALT** (Hungry, Angry, Lonely, Tired) and **Inventory** (self-reflection). Don't worry if they're new—the Workbook and Journal are here to guide you.
            </p>
        </div>
        <button
            onClick={onDismiss}
            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-200 transition-colors flex-shrink-0"
            aria-label="Dismiss welcome tip"
        >
            <XIcon/>
        </button>
    </div>
);


// --- Main Component ---

export const Dashboard = ({ onNavigate, sobrietyStartDate }) => {
    const randomFact = useMemo(() => RECOVERY_FACTS[Math.floor(Math.random() * RECOVERY_FACTS.length)], []);
    
    const [isTipDismissed, setIsTipDismissed] = useState(true);
    const [isLoadingTip, setIsLoadingTip] = useState(true);

    useEffect(() => {
        const loadTipStatus = async () => {
            setIsLoadingTip(true);
            const dismissed = await DataStore.load(DataStore.KEYS.WELCOME_TIP); // UPDATED
            setIsTipDismissed(dismissed);
            setIsLoadingTip(false);
        };
        loadTipStatus();
    }, []);

    const handleDismissTip = async () => {
        await DataStore.save(DataStore.KEYS.WELCOME_TIP, true); // UPDATED
        setIsTipDismissed(true);
    };

    const menuItems = [
        { view: 'journal', label: 'Daily Journal', icon: <BookOpenIcon /> },
        { view: 'reflection', label: 'Daily Reflection', icon: <CalendarIcon /> },
        { view: 'goals', label: 'My Goals', icon: <TargetIcon /> },
        { view: 'coping', label: 'Coping Cards', icon: <ShieldIcon /> },
        { view: 'workbook', label: 'Recovery Workbook', icon: <ClipboardListIcon /> },
        { view: 'literature', label: 'Recovery Literature', icon: <LibraryIcon /> },
        { view: 'finder', label: 'Meeting Management', icon: <MapPinIcon /> },
        { view: 'challenge', label: '90 Day Challenge', icon: <ClipboardListIcon /> },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            {!isLoadingTip && !isTipDismissed && <WelcomeTip onDismiss={handleDismissTip} />}
            
            <div className="text-center p-3 bg-hopeful-coral/10 rounded-xl shadow-sm border border-hopeful-coral/30">
                <p className="text-sm font-medium text-deep-charcoal italic">Recovery Insight: {randomFact}</p>
            </div>

            <SobrietyTracker startDate={sobrietyStartDate} />

            <div className="grid grid-cols-2 gap-4">
                {menuItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-serene-teal/10 transition-all transform hover:-translate-y-1 text-center h-full"
                    >
                        <div className="text-teal-500 mb-2">{item.icon}</div>
                        <span className="text-sm font-semibold text-deep-charcoal/80">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export const SobrietyDataSetup = ({ onDateSet }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    const handleSave = async () => {
        const newStartDate = new Date(date);
        await onDateSet(newStartDate); 
        await DataStore.save(DataStore.KEYS.WELCOME_TIP, false); // UPDATED
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-pure-white/60 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">Welcome</h2>
            <p className="text-deep-charcoal/70 mb-6 text-center">Let's start your journey. Please select your sobriety start date.</p>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full max-w-xs p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-serene-teal"
            />
            <button
                onClick={handleSave}
                className="mt-6 bg-serene-teal text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95 transition-transform transform hover:scale-105"
            >
                Begin Journey
            </button>
        </div>
    );
};