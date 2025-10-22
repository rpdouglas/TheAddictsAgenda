import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Changed imports to root-level assumption (dropping the './' or '../' prefix)
import { LocalDataStore, useAuth } from 'utils/storage.js';
import { APP_VERSIONS, copingStrategies } from 'utils/data.js';
import { SettingsIcon, ArrowLeftIcon, MapPinIcon, PhoneIcon, ShieldIcon, LockIcon, LifeBuoyIcon } from 'utils/icons.jsx';
import { Spinner } from 'components/common.jsx';

// Import all view components
import { Dashboard, SobrietyDataSetup } from 'components/Dashboard.jsx';
import { DailyJournal } from 'components/DailyJournal.jsx';
import { Goals } from 'components/Goals.jsx';
import { CopingCards } from 'components/CopingCards.jsx';
import { RecoveryWorkbook } from 'components/RecoveryWorkbook.jsx';
import { RecoveryLiterature } from 'components/RecoveryLiterature.jsx';
import { Resources, MeetingManagement } from 'components/Resources.jsx';
import { Settings } from 'components/Settings.jsx';
import { DailyReflection } from 'components/DailyReflection.jsx'; 
import { NinetyDayChallenge } from 'components/NinetyDayChallenge.jsx';
import { Homegroup } from 'components/Homegroup.jsx';
import MeetingTracker from 'components/MeetingTracker.jsx';

// Map string icon names to imported JSX components (Needed here to pass to child components if they expect icons)
const iconMap = {
    MapPinIcon: MapPinIcon,
    PhoneIcon: PhoneIcon,
    ShieldIcon: ShieldIcon,
};
const allCopingCards = copingStrategies.map(card => ({
    ...card,
    icon: iconMap[card.icon] || ShieldIcon
}));

// --- PIN Lock Screen Component ---

const PinLockScreen = ({ storedPin, onUnlock }) => {
    const [pinAttempt, setPinAttempt] = useState('');
    const [message, setMessage] = useState('');

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        setPinAttempt(value);
        setMessage('');
    };

    const handleUnlock = (e) => {
        e.preventDefault();
        if (pinAttempt === storedPin) {
            setMessage('Unlocked!');
            setTimeout(onUnlock, 50); // Small delay for effect
        } else {
            setMessage('Incorrect PIN. Please try again.');
            setPinAttempt('');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center space-y-6">
                <LockIcon className="w-10 h-10 mx-auto text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-800">Application Locked</h2>
                <p className="text-gray-600">Enter your PIN to access your recovery tools.</p>
                
                <form onSubmit={handleUnlock} className="space-y-4">
                    <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter PIN"
                        value={pinAttempt}
                        onChange={handlePinChange}
                        className="w-full p-4 text-center text-xl tracking-widest border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                        maxLength={6}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={pinAttempt.length < 4}
                        className="w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors disabled:bg-gray-400"
                    >
                        Unlock
                    </button>
                </form>
                {message && <p className={`text-sm font-medium ${message === 'Unlocked!' ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
            </div>
        </div>
    );
};

// --- Main Component ---
const App = () => {
    const { isAuthLoading } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [sobrietyStartDate, setSobrietyStartDate] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [journalTemplate, setJournalTemplate] = useState('');
    
    // --- PIN Lock State (NEW) ---
    const [storedPin, setStoredPin] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    // Load initial data and check for PIN on mount
    useEffect(() => {
        const loadedPin = LocalDataStore.load(LocalDataStore.KEYS.PIN);
        setStoredPin(loadedPin);
        
        // Lock the app if a PIN is set
        if (loadedPin && loadedPin.trim().length >= 4) {
            setIsLocked(true);
        }

        const storedDate = LocalDataStore.load(LocalDataStore.KEYS.SOBRIETY);
        if (storedDate && storedDate !== 'null') { 
            try {
                const dateObj = new Date(storedDate);
                if (!isNaN(dateObj.getTime())) {
                    setSobrietyStartDate(dateObj);
                } else {
                    console.error("Invalid date format in localStorage.");
                }
            } catch (e) {
                console.error("Error parsing sobriety date:", e);
                setSobrietyStartDate(null); 
            }
        }
        setIsDataLoading(false);
    }, []);
    
    // Function to handle successful unlock
    const handleUnlock = useCallback(() => {
        setIsLocked(false);
        // Reload pin just in case it was changed while locked (though unlikely)
        setStoredPin(LocalDataStore.load(LocalDataStore.KEYS.PIN)); 
    }, []);

    const handleJournalFromCopingCard = (card) => {
        const template = `Coping Card Reflection: "${card.title}"\n\n**Strategy:** ${card.description}\n\n**My Application Plan:** (How will I use this skill the next time I have a craving?)\n\n`;
        setJournalTemplate(template);
        setActiveView('journal');
    };
    
    const handleSobrietyDateUpdate = (newDate, journal) => {
        const newDateString = newDate.toISOString();
        LocalDataStore.save(LocalDataStore.KEYS.SOBRIETY, newDateString);
        setSobrietyStartDate(newDate);

        if (journal && sobrietyStartDate) {
            const template = `Sobriety Date Change Reflection (${new Date().toLocaleDateString()}):\n\n**Previous Date:** ${sobrietyStartDate.toLocaleDateString()}\n**New Date:** ${newDate.toLocaleDateString()}\n\nI am changing my date because:\n\nThis decision is important because:`;
            setJournalTemplate(template);
            setActiveView('journal');
        } else {
            setActiveView('dashboard');
        }
    };

    const renderContent = () => {
        if (isAuthLoading || isDataLoading) return <div className="h-full flex items-center justify-center"><Spinner /></div>;
        
        // If locked, render nothing but the lock screen.
        if (isLocked) return null;

        if (!sobrietyStartDate || isNaN(sobrietyStartDate.getTime())) return <SobrietyDataSetup onDateSet={setSobrietyStartDate} />;
        
        switch (activeView) {
            case 'dashboard': return <Dashboard onNavigate={setActiveView} sobrietyStartDate={sobrietyStartDate} />;
            case 'journal': return <DailyJournal journalTemplate={journalTemplate} setJournalTemplate={setJournalTemplate} />;
            case 'goals': return <Goals />;
            case 'coping': return <CopingCards onJournal={handleJournalFromCopingCard} />;
            case 'workbook': return <RecoveryWorkbook />;
            case 'literature': return <RecoveryLiterature />;
            case 'resources': return <Resources />;
            case 'settings': return <Settings 
                currentStartDate={sobrietyStartDate} 
                handleSobrietyDateUpdate={handleSobrietyDateUpdate}
                onBack={() => setActiveView('dashboard')}
            />;
            case 'finder': return <MeetingManagement onNavigate={setActiveView} onBack={() => setActiveView('dashboard')} />;
            case 'reflection': return <DailyReflection onBack={() => setActiveView('dashboard')} />;
            case 'challenge': return <NinetyDayChallenge onBack={() => setActiveView('dashboard')} onNavigate={setActiveView} setJournalTemplate={setJournalTemplate} />;
            case 'homegroup': return <Homegroup onBack={() => setActiveView('finder')} onNavigate={setActiveView} />;
            case 'meetingTracker': return <MeetingTracker onBack={() => setActiveView('homegroup')} />;
            default: return <Dashboard onNavigate={setActiveView} sobrietyStartDate={sobrietyStartDate} />;
        }
    };
    
    const headerTitle = useMemo(() => {
        const titles = { 
            dashboard: "The Addict's Agenda", 
            coping: "Coping Cards", 
            literature: "Recovery Literature", 
            journal: "Daily Journal", 
            goals: "My Goals", 
            workbook: "Recovery Workbook", 
            resources: "S.O.S. Resources", 
            settings: "Settings", 
            finder: "Meeting Management",
            reflection: "Daily Reflection",
            challenge: "90 Day Challenge",
            homegroup: "Homegroup",
            meetingTracker: "Meeting Tracker"
        };
        return titles[activeView] || "Recovery";
    }, [activeView]);


    const PageFooter = ({ activeView }) => {
        const getVersion = () => {
            const key = activeView.toUpperCase();
            let componentName = activeView.charAt(0).toUpperCase() + activeView.slice(1);
            let version = APP_VERSIONS[key] || APP_VERSIONS.DASHBOARD;
            
            if (key === 'DASHBOARD') componentName = "App Core";
            if (key === 'WORKBOOK') componentName = "Workbook";
            if (key === 'LITERATURE') componentName = "Literature";
            if (key === 'SETTINGS') componentName = "Settings";
            if (key === 'DAILYREFLECTION') componentName = "Daily Reflection"; 
    
            return { componentName, version };
        };
        
        const { componentName, version } = getVersion();
    
        return (
            <footer className="w-full max-w-2xl mx-auto flex-shrink-0 text-center py-2 text-xs text-gray-400 border-t border-gray-200 mt-2">
                Version: {componentName} v{version}
            </footer>
        );
    };


    return (
        <div className="bg-gray-100 h-screen w-full flex flex-col font-sans text-gray-800 p-2 sm:p-4">
            {/* NEW: Lock Screen Render */}
            {isLocked && storedPin && (
                <PinLockScreen 
                    storedPin={storedPin} 
                    onUnlock={handleUnlock} 
                />
            )}
            
            <div className="flex-shrink-0 w-full max-w-2xl mx-auto">
                <header className={`flex items-center justify-between p-4 ${isLocked ? 'hidden' : ''}`}>
                    {/* 1. Left Side: Back Button or SOS Icon */}
                    {activeView === 'dashboard' && sobrietyStartDate ? (
                        <button onClick={() => setActiveView('resources')} className="text-red-500 hover:text-red-700 p-1">
                            <LifeBuoyIcon className="w-6 h-6" />
                        </button>
                    ) : activeView !== 'settings' && sobrietyStartDate ? (
                        <button onClick={() => setActiveView('dashboard')} className="text-teal-600 hover:text-teal-800 p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6" /></button>
                    ) : <div className="w-10"></div>}
                    
                    <h1 className="text-xl font-bold text-gray-700">{headerTitle}</h1>
                    
                    {/* 2. Right Side: Settings Cog or Spacer */}
                    {activeView === 'dashboard' && sobrietyStartDate ? (
                        <button onClick={() => setActiveView('settings')} className="text-gray-500 hover:text-teal-600 p-1">
                            <SettingsIcon className="w-6 h-6" />
                        </button>
                    ) : <div className="w-10"></div>}
                    
                </header>
            </div>
            <main className={`flex-grow w-full max-w-2xl mx-auto overflow-y-auto pb-4 ${isLocked ? 'hidden' : ''}`}>
                {renderContent()}
            </main>
            {sobrietyStartDate && !isLocked && <PageFooter activeView={activeView} />}
        </div>
    );
};

export default App;