// src/App.jsx
// Import Core React hooks and utilities
import React, { useState, useEffect, Suspense, lazy } from 'react';

// Import authentication context and data storage utility
import { useAuth } from '/src/AuthContext.jsx';
import DataStore from '/src/utils/dataStore.js';

// Import icons and shared components
import { SettingsIcon, ArrowLeftIcon, LifeBuoyIcon } from '/src/utils/icons.jsx';
import { Spinner } from '/src/components/common.jsx';
import Login from '/src/components/Login.jsx';
import { Dashboard, SobrietyDataSetup } from '/src/components/Dashboard.jsx';
import EncryptionUnlock from '/src/components/EncryptionUnlock.jsx';

// --- Lazy-loaded Components ---
const DailyJournal = lazy(() => import('/src/components/DailyJournal.jsx'));
const Goals = lazy(() => import('/src/components/Goals.jsx'));
const RecoveryWorkbook = lazy(() => import('/src/components/RecoveryWorkbook.jsx'));
const RecoveryLiterature = lazy(() => import('/src/components/RecoveryLiterature.jsx'));
const Settings = lazy(() => import('/src/components/Settings.jsx'));
const DailyReflection = lazy(() => import('/src/components/DailyReflection.jsx'));
const NinetyDayChallenge = lazy(() => import('/src/components/NinetyDayChallenge.jsx'));
const Homegroup = lazy(() => import('/src/components/Homegroup.jsx'));
const MeetingTracker = lazy(() => import('/src/components/MeetingTracker.jsx'));
const DailyReadings = lazy(() => import('/src/components/DailyReadings.jsx'));
const JustForToday = lazy(() => import('/src/components/JustForToday.jsx'));

// Components exported as named exports
const Resources = lazy(() => import('/src/components/Resources.jsx').then(module => ({ default: module.Resources })));
const MeetingManagement = lazy(() => import('/src/components/Resources.jsx').then(module => ({ default: module.MeetingManagement })));

// Coping Tools Feature Components
const CopingTools = lazy(() => import('/src/components/CopingTools.jsx'));
const CopingCards = lazy(() => import('/src/components/CopingCards.jsx'));
const BreathingExercise = lazy(() => import('/src/components/BreathingExercise.jsx'));
const YogaWalkthrough = lazy(() => import('/src/components/YogaWalkthrough.jsx'));
const RecoveryGames = lazy(() => import('/src/components/RecoveryGames.jsx'));
const RecoverySimulatorGame = lazy(() => import('/src/coping_tools/RecoveryGames/FastLaneGame/App.jsx'));
const RecoveryJeopardy = lazy(() => import('/src/coping_tools/RecoveryGames/RecoveryJeopardy/RecoveryJeopardy.jsx'));

// --- Main Application Component ---
const App = () => {
    // --- State Management ---
    const { session, loading: authLoading, logout } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [sobrietyStartDate, setSobrietyStartDate] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [journalTemplate, setJournalTemplate] = useState('');
    const [journalTags, setJournalTags] = useState([]);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [hasMadeJournalEntryToday, setHasMadeJournalEntryToday] = useState(false);
    
    // State to track if the account is currently locked due to encryption
    const [isLocked, setIsLocked] = useState(false);

    const DEFAULT_HEADER = 'You have been clean for';
    const [headerText, setHeaderText] = useState(DEFAULT_HEADER);

    // --- Effects ---
    useEffect(() => {
        DataStore.setStorageEngine(session?.type);

        const loadUserData = async () => {
            if (session) {
                // 1. Check if the user has enabled encryption
                const isEncrypted = await DataStore.load('is_account_encrypted');
                const hasSessionKey = sessionStorage.getItem('USER_ENCRYPTION_KEY');

                // 2. If encrypted and NO key -> lock the app
                if (isEncrypted && !hasSessionKey) {
                    setIsLocked(true);
                    setIsDataLoading(false);
                    return;
                }

                setIsDataLoading(true);
                const storedDate = await DataStore.load(DataStore.KEYS.SOBRIETY);
                if (storedDate) {
                    setSobrietyStartDate(new Date(storedDate));
                } else {
                    setSobrietyStartDate(null);
                }
                
                const storedHeader = await DataStore.load(DataStore.KEYS.HEADER_TEXT);
                setHeaderText(storedHeader || DEFAULT_HEADER); 
                
                const journalEntries = await DataStore.load(DataStore.KEYS.JOURNAL) || [];
                const today = new Date().toLocaleDateString();
                const hasEntry = journalEntries.some(entry => new Date(entry.timestamp).toLocaleDateString() === today);
                setHasMadeJournalEntryToday(hasEntry);

                setIsDataLoading(false);
            } else {
                setIsDataLoading(false);
            }
        };
        loadUserData();
    }, [session, isLocked]);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // --- Event Handlers ---
    const handleSobrietyDateUpdate = async (newDate) => {
        if (!newDate || isNaN(newDate.getTime())) return;
        setSobrietyStartDate(newDate);
        await DataStore.save(DataStore.KEYS.SOBRIETY, newDate.toISOString());
    };

    const handleJournalFromCopingCard = (card) => {
        const template = `Coping Card Reflection: "${card.title}"\n\n**Strategy:** ${card.description}\n\n**My Application Plan:**\n\n`;
        setJournalTemplate(template);
        setJournalTags(['Coping Skills']);
        setActiveView('journal');
    };

    const handleJournalFromReflection = (reflection) => {
        if (!reflection) return;
        const template = `Reflection on "${reflection.title}"\n\n> ${reflection.quote.replace(/\n/g, '\n> ')}\n\nMy thoughts:\n\n`;
        setJournalTemplate(template);
        setJournalTags(['Daily Reflection']);
        setActiveView('journal');
    };

    const handleJournalFromMeditation = (meditation) => {
        if (!meditation) return;
        const template = `Meditation on "${meditation.title}"\n\n> "${meditation.quote}"\n\nMy thoughts:\n\n`;
        setJournalTemplate(template);
        setJournalTags(['Just for Today']);
        setActiveView('journal');
    };

    const handleInstallPWA = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the PWA install prompt.');
            }
            setDeferredPrompt(null);
        }
    };

    const handleUnlock = () => {
        setIsLocked(false); 
    };

    // --- Render Logic ---

    if (isLocked) {
        return <EncryptionUnlock onUnlock={handleUnlock} />;
    }

    if (authLoading || isDataLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-gray-100"><Spinner /></div>;
    }

    if (!session) {
        return <Login />;
    }

    if (!sobrietyStartDate) {
        return <SobrietyDataSetup onDateSet={handleSobrietyDateUpdate} />;
    }

    const routes = {
        'dashboard': (
            <Dashboard 
                onNavigate={setActiveView} 
                sobrietyStartDate={sobrietyStartDate} 
                deferredPrompt={deferredPrompt} 
                onInstallPWA={handleInstallPWA} 
                headerText={headerText}
                hasMadeJournalEntryToday={hasMadeJournalEntryToday}
            />
        ),
        'journal': (
            <DailyJournal 
                journalTemplate={journalTemplate} 
                setJournalTemplate={setJournalTemplate} 
                journalTags={journalTags} 
                setJournalTags={setJournalTags} 
            />
        ),
        'goals': <Goals />,
        'workbook': <RecoveryWorkbook />,
        'literature': (
            <RecoveryLiterature 
                onNavigate={setActiveView} 
                setJournalTemplate={setJournalTemplate} 
            />
        ),
        'resources': <Resources />,
        'settings': (
            <Settings
                currentStartDate={sobrietyStartDate}
                handleSobrietyDateUpdate={handleSobrietyDateUpdate}
                onBack={() => setActiveView('dashboard')}
                onLogout={logout}
                currentHeaderText={headerText}
                onHeaderTextUpdate={setHeaderText}
            />
        ),
        'finder': (
            <MeetingManagement 
                onNavigate={setActiveView} 
                onBack={() => setActiveView('dashboard')} 
            />
        ),
        'daily-readings': (
            <DailyReadings 
                onBack={() => setActiveView('dashboard')} 
                onNavigate={setActiveView} 
            />
        ),
        'reflection': (
            <DailyReflection 
                onBack={() => setActiveView('daily-readings')} 
                onJournal={handleJournalFromReflection} 
            />
        ),
        'just-for-today': (
            <JustForToday 
                onBack={() => setActiveView('daily-readings')} 
                onJournal={handleJournalFromMeditation} 
            />
        ),
        'challenge': (
            <NinetyDayChallenge 
                onBack={() => setActiveView('dashboard')} 
                onNavigate={setActiveView} 
                setJournalTemplate={setJournalTemplate} 
            />
        ),
        'homegroup': (
            <Homegroup 
                onBack={() => setActiveView('finder')} 
                onNavigate={setActiveView} 
            />
        ),
        'meetingTracker': <MeetingTracker onBack={() => setActiveView('homegroup')} />,
        'coping-tools': <CopingTools onNavigate={setActiveView} onBack={() => setActiveView('dashboard')} />,
        'coping-cards': <CopingCards onJournal={handleJournalFromCopingCard} onBack={() => setActiveView('coping-tools')} />,
        'breathing-exercises': <BreathingExercise onBack={() => setActiveView('coping-tools')} />,
        'yoga': <YogaWalkthrough onBack={() => setActiveView('coping-tools')} />,
        'recovery-games': <RecoveryGames onBack={() => setActiveView('coping-tools')} />,
        'recovery-jeopardy': <RecoveryJeopardy onBack={() => setActiveView('coping-tools')} />,
        'recovery-simulator': <RecoverySimulatorGame onBack={() => setActiveView('coping-tools')} />,
    };

    return (
        // UPDATED: Use h-[100dvh] for dynamic viewport height and overflow-hidden to prevent body scroll
        <div className="bg-gray-100 h-[100dvh] w-full flex flex-col font-sans text-gray-800 p-2 sm:p-4 overflow-hidden">
            <header className="flex-shrink-0 w-full max-w-2xl mx-auto flex items-center justify-between p-4">
                {activeView === 'dashboard' ? (
                    <button onClick={() => setActiveView('resources')} className="text-red-500 hover:text-red-700 p-1" title="Emergency Resources"><LifeBuoyIcon className="w-6 h-6" /></button>
                ) : (
                    <button onClick={() => setActiveView('dashboard')} className="text-teal-600 hover:text-teal-800 p-2 -ml-2" title="Back to Dashboard"><ArrowLeftIcon className="w-6 h-6" /></button>
                )}
                <h1 className="text-xl font-bold text-gray-700">My Recovery Toolkit</h1>
                <button onClick={() => setActiveView('settings')} className="text-gray-500 hover:text-teal-600 p-1" title="Settings"><SettingsIcon className="w-6 h-6" /></button>
            </header>

            <main className="flex-grow w-full max-w-2xl mx-auto overflow-y-auto pb-4">
                <Suspense fallback={<Spinner />}>
                    {routes[activeView] || routes['dashboard']}
                </Suspense>
            </main>
        </div>
    );
};

export default App;