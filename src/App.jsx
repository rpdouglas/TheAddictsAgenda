import React, { useState, useEffect, useMemo } from 'react';
import { LocalDataStore, useAuth } from './utils/storage.js';
import { APP_VERSIONS, copingStrategies } from './utils/data.js';
import { SettingsIcon, ArrowLeftIcon, MapPinIcon, PhoneIcon, ShieldIcon } from './utils/icons.jsx';
import { Spinner } from './components/common.jsx';

// Import all view components
import { Dashboard, SobrietyDataSetup } from './components/Dashboard.jsx';
import { DailyJournal } from './components/DailyJournal.jsx';
import { Goals } from './components/Goals.jsx';
import { CopingCards } from './components/CopingCards.jsx';
import { RecoveryWorkbook } from './components/RecoveryWorkbook.jsx';
import { RecoveryLiterature } from './components/RecoveryLiterature.jsx';
import { Resources, MeetingFinder } from './components/Resources.jsx';
import { Settings } from './components/Settings.jsx';

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


// --- Main Component ---
const App = () => {
    const { isAuthLoading } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [sobrietyStartDate, setSobrietyStartDate] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [journalTemplate, setJournalTemplate] = useState('');

    // Load sobriety date from localStorage on mount
    useEffect(() => {
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
        
        if (!sobrietyStartDate || isNaN(sobrietyStartDate.getTime())) return <SobrietyDataSetup onDateSet={setSobrietyStartDate} />;
        
        switch (activeView) {
            case 'dashboard': return <Dashboard onNavigate={setActiveView} sobrietyStartDate={sobrietyStartDate} />;
            case 'journal': return <DailyJournal journalTemplate={journalTemplate} setJournalTemplate={setJournalTemplate} />;
            case 'goals': return <Goals />;
            // Note: CopingCards needs the resolved icon map, passed here or handled internally
            case 'coping': return <CopingCards onJournal={handleJournalFromCopingCard} allCopingCards={allCopingCards} />;
            case 'workbook': return <RecoveryWorkbook />;
            case 'literature': return <RecoveryLiterature />;
            case 'resources': return <Resources />;
            case 'settings': return <Settings 
                currentStartDate={sobrietyStartDate} 
                handleSobrietyDateUpdate={handleSobrietyDateUpdate}
                onBack={() => setActiveView('dashboard')}
            />;
            case 'finder': return <MeetingFinder />;
            default: return <Dashboard onNavigate={setActiveView} sobrietyStartDate={sobrietyStartDate} />;
        }
    };
    
    const headerTitle = useMemo(() => {
        const titles = { dashboard: "The Addict's Agenda", coping: "Coping Cards", literature: "Recovery Literature", journal: "Daily Journal", goals: "My Goals", workbook: "Recovery Workbook", resources: "S.O.S. Resources", settings: "Settings", finder: "Meeting Finder" };
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
            <div className="flex-shrink-0 w-full max-w-2xl mx-auto">
                <header className="flex items-center justify-between p-4">
                    {/* 1. Left Side: Back Button or Spacer */}
                    {activeView !== 'dashboard' && activeView !== 'settings' && sobrietyStartDate ? (
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
            <main className="flex-grow w-full max-w-2xl mx-auto overflow-y-auto pb-4">
                {renderContent()}
            </main>
            {sobrietyStartDate && <PageFooter activeView={activeView} />}
        </div>
    );
};

export default App; // Must be default export for main.jsx
