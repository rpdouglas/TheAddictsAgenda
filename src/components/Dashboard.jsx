import React, { useState, useEffect, useMemo } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner } from './common.jsx';
import { RECOVERY_FACTS, copingStrategies } from '../utils/data.js';
import { BookOpenIcon, TargetIcon, LifeBuoyIcon, ClipboardListIcon, ShieldIcon, LibraryIcon, SettingsIcon, MapPinIcon, PhoneIcon, XIcon } from '../utils/icons.jsx';

// Map string icon names to imported JSX components
const iconMap = {
    MapPinIcon: MapPinIcon,
    PhoneIcon: PhoneIcon,
    ShieldIcon: ShieldIcon,
};
const allCopingCards = copingStrategies.map(card => ({
    ...card,
    icon: iconMap[card.icon] || ShieldIcon
}));


// --- Sub-Components ---

const SobrietyTracker = ({ startDate }) => {
    const calculateTimeSober = () => {
        const diff = new Date().getTime() - new Date(startDate).getTime();
        if (diff < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) };
    };
    const [timeSober, setTimeSober] = useState(calculateTimeSober());
    useEffect(() => { const timer = setInterval(() => setTimeSober(calculateTimeSober()), 1000); return () => clearInterval(timer); }, [startDate]);
    const timeUnits = [ { label: 'Days', value: timeSober.days }, { label: 'Hours', value: timeSober.hours }, { label: 'Minutes', value: timeSober.minutes }, { label: 'Seconds', value: timeSober.seconds } ];
    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-gray-500 mb-4">You are on your path</h3>
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {timeUnits.map(unit => ( 
                    <div key={unit.label} className="flex flex-col items-center bg-gray-100 p-2 sm:p-3 rounded-lg">
                        <span className="text-3xl sm:text-4xl font-bold text-teal-600">{String(unit.value).padStart(2, '0')}</span>
                        <span className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider">{unit.label}</span>
                    </div> 
                ))}
            </div>
        </div> 
    );
};

const WelcomeTip = ({ onDismiss }) => {
    return (
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
};


// --- Main Component ---

export const Dashboard = ({ onNavigate, sobrietyStartDate }) => {
    const randomFact = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * RECOVERY_FACTS.length);
        return RECOVERY_FACTS[randomIndex];
    }, []);
    
    const [isTipDismissed, setIsTipDismissed] = useState(LocalDataStore.load(LocalDataStore.KEYS.WELCOME_TIP));

    const handleDismissTip = () => {
        LocalDataStore.save(LocalDataStore.KEYS.WELCOME_TIP, 'true');
        setIsTipDismissed(true);
    };

    const menuItems = [
        { view: 'journal', label: 'Daily Journal', icon: <BookOpenIcon /> },
        { view: 'goals', label: 'My Goals', icon: <TargetIcon /> },
        { view: 'coping', label: 'Coping Cards', icon: <ShieldIcon /> },
        { view: 'workbook', label: 'Recovery Workbook', icon: <ClipboardListIcon /> },
        { view: 'literature', label: 'Recovery Literature', icon: <LibraryIcon /> },
        { view: 'finder', label: 'Meeting Finder', icon: <MapPinIcon /> },
        { view: 'resources', label: 'S.O.S. Resources', icon: <LifeBuoyIcon /> },
    ];

    return ( 
        <div className="animate-fade-in space-y-6">
            {/* Display Welcome Tip if not dismissed */}
            {!isTipDismissed && <WelcomeTip onDismiss={handleDismissTip} />}
            
            {/* Display Random Fact */}
            <div className="text-center p-3 bg-yellow-50 rounded-xl shadow-sm border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 italic">Recovery Insight: {randomFact}</p>
            </div>

            <SobrietyTracker startDate={sobrietyStartDate} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map(item => ( 
                    <button key={item.view} onClick={() => onNavigate(item.view)} className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-teal-50 transition-all transform hover:-translate-y-1">
                        <div className="text-teal-500 mr-4">{item.icon}</div><span className="text-lg font-semibold text-gray-700">{item.label}</span>
                    </button> 
                ))}
            </div>
        </div> 
    );
};

export const SobrietyDataSetup = ({ onDateSet }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const handleSave = () => {
        const newStartDate = new Date(date);
        LocalDataStore.save(LocalDataStore.KEYS.SOBRIETY, newStartDate.toISOString());
        LocalDataStore.save(LocalDataStore.KEYS.WELCOME_TIP, 'false');
        onDateSet(newStartDate);
    };
    return ( 
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gray-50 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
            <p className="text-gray-600 mb-6 text-center">Let's start your journey. Please select your sobriety start date.</p>
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full max-w-xs p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
            />
            <button 
                onClick={handleSave} 
                className="mt-6 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-transform transform hover:scale-105"
            >
                Begin Journey
            </button>
        </div> 
    );
};
