import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { FirestoreDataStore } from './utils/storage.js';
import { SettingsIcon, ArrowLeftIcon, LifeBuoyIcon } from './utils/icons.jsx';
import { Spinner } from './components/common.jsx';
import Login from './components/Login.jsx';

// Import all view components using corrected relative paths
import { Dashboard, SobrietyDataSetup } from './components/Dashboard.jsx';
import { DailyJournal } from './components/DailyJournal.jsx';
import { Goals } from './components/Goals.jsx';
import { CopingCards } from './components/CopingCards.jsx';
import { RecoveryWorkbook } from './components/RecoveryWorkbook.jsx';
import { RecoveryLiterature } from './components/RecoveryLiterature.jsx';
import { Resources, MeetingManagement } from './components/Resources.jsx';
import { Settings } from './components/Settings.jsx';
import { DailyReflection } from './components/DailyReflection.jsx';
import { NinetyDayChallenge } from './components/NinetyDayChallenge.jsx';
import { Homegroup } from './components/Homegroup.jsx';
import MeetingTracker from './components/MeetingTracker.jsx';

const App = () => {
    const { currentUser, loading: authLoading } = useAuth();
    
    const [activeView, setActiveView] = useState('dashboard');
    const [sobrietyStartDate, setSobrietyStartDate] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [journalTemplate, setJournalTemplate] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            if (currentUser) {
                setIsDataLoading(true);
                const storedDate = await FirestoreDataStore.load(FirestoreDataStore.KEYS.SOBRIETY);
                if (storedDate) {
                    setSobrietyStartDate(new Date(storedDate));
                } else {
                    setSobrietyStartDate(null);
                }
                setIsDataLoading(false);
            }
        };
        loadUserData();
    }, [currentUser]);

    const handleSobrietyDateUpdate = async (newDate) => {
        if (!newDate || isNaN(newDate.getTime())) return;
        setSobrietyStartDate(newDate);
        await FirestoreDataStore.save(FirestoreDataStore.KEYS.SOBRIETY, newDate.toISOString());
    };

    const handleJournalFromCopingCard = (card) => {
        const template = `Coping Card Reflection: "${card.title}"\n\n**Strategy:** ${card.description}\n\n**My Application Plan:**\n\n`;
        setJournalTemplate(template);
        setActiveView('journal');
    };

    if (authLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-gray-100"><Spinner /></div>;
    }

    if (!currentUser) {
        return <Login />;
    }

    if (isDataLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-gray-100"><Spinner /></div>;
    }

    if (!sobrietyStartDate) {
        return <SobrietyDataSetup onDateSet={handleSobrietyDateUpdate} />;
    }
    
    const renderContent = () => {
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
    
    return (
        <div className="bg-gray-100 h-screen w-full flex flex-col font-sans text-gray-800 p-2 sm:p-4">
            <header className="flex-shrink-0 w-full max-w-2xl mx-auto flex items-center justify-between p-4">
                {activeView === 'dashboard' ? (
                    <button onClick={() => setActiveView('resources')} className="text-red-500 hover:text-red-700 p-1"><LifeBuoyIcon className="w-6 h-6" /></button>
                ) : (
                    <button onClick={() => setActiveView('dashboard')} className="text-teal-600 hover:text-teal-800 p-2 -ml-2"><ArrowLeftIcon className="w-6 h-6" /></button>
                )}
                <h1 className="text-xl font-bold text-gray-700">The Addict's Agenda</h1>
                <button onClick={() => setActiveView('settings')} className="text-gray-500 hover:text-teal-600 p-1"><SettingsIcon className="w-6 h-6" /></button>
            </header>
            <main className="flex-grow w-full max-w-2xl mx-auto overflow-y-auto pb-4">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;