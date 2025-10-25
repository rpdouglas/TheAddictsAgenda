import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from './AuthContext.jsx';
import DataStore from './utils/dataStore.js';
import { SettingsIcon, ArrowLeftIcon, LifeBuoyIcon } from './utils/icons.jsx';
import { Spinner } from './components/common.jsx';
import Login from './components/Login.jsx';
import { Dashboard, SobrietyDataSetup } from './components/Dashboard.jsx';
import { CopingTools } from './components/CopingTools.jsx';

const DailyJournal = lazy(() => import('./components/DailyJournal.jsx').then(module => ({ default: module.DailyJournal })));
const Goals = lazy(() => import('./components/Goals.jsx').then(module => ({ default: module.Goals })));
const CopingCards = lazy(() => import('./components/CopingCards.jsx').then(module => ({ default: module.CopingCards })));
const RecoveryWorkbook = lazy(() => import('./components/RecoveryWorkbook.jsx').then(module => ({ default: module.RecoveryWorkbook })));
const RecoveryLiterature = lazy(() => import('./components/RecoveryLiterature.jsx').then(module => ({ default: module.RecoveryLiterature })));
const Resources = lazy(() => import('./components/Resources.jsx').then(module => ({ default: module.Resources })));
const MeetingManagement = lazy(() => import('./components/Resources.jsx').then(module => ({ default: module.MeetingManagement })));
const Settings = lazy(() => import('./components/Settings.jsx').then(module => ({ default: module.Settings })));
const DailyReflection = lazy(() => import('./components/DailyReflection.jsx').then(module => ({ default: module.DailyReflection })));
const NinetyDayChallenge = lazy(() => import('./components/NinetyDayChallenge.jsx').then(module => ({ default: module.NinetyDayChallenge })));
const Homegroup = lazy(() => import('./components/Homegroup.jsx').then(module => ({ default: module.Homegroup })));
const MeetingTracker = lazy(() => import('./components/MeetingTracker.jsx'));
const BreathingExercises = lazy(() => import('./components/BreathingExercise.jsx'));


const App = () => {
    const { session, loading: authLoading, logout } = useAuth();

    const [activeView, setActiveView] = useState('dashboard');
    const [sobrietyStartDate, setSobrietyStartDate] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [journalTemplate, setJournalTemplate] = useState('');

    useEffect(() => {
        DataStore.setStorageEngine(session?.type);

        const loadUserData = async () => {
            if (session) {
                setIsDataLoading(true);
                const storedDate = await DataStore.load(DataStore.KEYS.SOBRIETY);
                if (storedDate) {
                    setSobrietyStartDate(new Date(storedDate));
                } else {
                    setSobrietyStartDate(null);
                }
                setIsDataLoading(false);
            } else {
                setIsDataLoading(false);
            }
        };
        loadUserData();
    }, [session]);

    const handleSobrietyDateUpdate = async (newDate) => {
        if (!newDate || isNaN(newDate.getTime())) return;
        setSobrietyStartDate(newDate);
        await DataStore.save(DataStore.KEYS.SOBRIETY, newDate.toISOString());
    };

    const handleJournalFromCopingCard = (card) => {
        const template = `Coping Card Reflection: "${card.title}"\n\n**Strategy:** ${card.description}\n\n**My Application Plan:**\n\n`;
        setJournalTemplate(template);
        setActiveView('journal');
    };

    if (authLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-gray-100"><Spinner /></div>;
    }

    if (!session) {
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
            case 'coping-tools': return <CopingTools onNavigate={setActiveView} onBack={() => setActiveView('dashboard')} />;
            case 'coping': return <CopingCards onJournal={handleJournalFromCopingCard} />;
            case 'breathing-exercises': return <BreathingExercises onBack={() => setActiveView('coping-tools')} />;
            case 'workbook': return <RecoveryWorkbook />;
            case 'literature': return <RecoveryLiterature onNavigate={setActiveView} setJournalTemplate={setJournalTemplate} />;
            case 'resources': return <Resources />;
            case 'settings': return <Settings
                currentStartDate={sobrietyStartDate}
                handleSobrietyDateUpdate={handleSobrietyDateUpdate}
                onBack={() => setActiveView('dashboard')}
                onLogout={logout}
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
                <Suspense fallback={<Spinner />}>
                    {renderContent()}
                </Suspense>
            </main>
        </div>
    );
};

export default App;