// Import Core React hooks and utilities
import React, { useState, useEffect, Suspense, lazy } from 'react';

// Import authentication context and data storage utility
import { useAuth } from './AuthContext.jsx';
import DataStore from './utils/dataStore.js';

// Import icons and shared components
import { SettingsIcon, ArrowLeftIcon, LifeBuoyIcon } from './utils/icons.jsx';
import { Spinner } from './components/common.jsx';
import Login from './components/Login.jsx';
import { Dashboard, SobrietyDataSetup } from './components/Dashboard.jsx';

// --- Lazy-loaded Components ---
// This splits the code into smaller chunks that are loaded only when needed,
// improving initial app performance. The Suspense component will show a fallback UI while they load.

// Core Feature Components
const DailyJournal = lazy(() => import('./components/DailyJournal.jsx'));
const Goals = lazy(() => import('./components/Goals.jsx'));
const RecoveryWorkbook = lazy(() => import('./components/RecoveryWorkbook.jsx'));
const RecoveryLiterature = lazy(() => import('./components/RecoveryLiterature.jsx'));
const Settings = lazy(() => import('./components/Settings.jsx'));
const DailyReflection = lazy(() => import('./components/DailyReflection.jsx'));
const NinetyDayChallenge = lazy(() => import('./components/NinetyDayChallenge.jsx'));
const Homegroup = lazy(() => import('./components/Homegroup.jsx'));
const MeetingTracker = lazy(() => import('./components/MeetingTracker.jsx'));
const DailyReadings = lazy(() => import('./components/DailyReadings.jsx'));
const JustForToday = lazy(() => import('./components/JustForToday.jsx'));


// Components exported as named exports require a special '.then()' syntax for lazy loading
const Resources = lazy(() => import('./components/Resources.jsx').then(module => ({ default: module.Resources })));
const MeetingManagement = lazy(() => import('./components/Resources.jsx').then(module => ({ default: module.MeetingManagement })));

// Coping Tools Feature Components
const CopingTools = lazy(() => import('./components/CopingTools.jsx'));
const CopingCards = lazy(() => import('./components/CopingCards.jsx'));
const BreathingExercise = lazy(() => import('./components/BreathingExercise.jsx'));
const YogaWalkthrough = lazy(() => import('./components/YogaWalkthrough.jsx'));
const RecoveryGames = lazy(() => import('./components/RecoveryGames.jsx'));

// --- Main Application Component ---
const App = () => {
    // --- State Management ---
    const { session, loading: authLoading, logout } = useAuth(); // Authentication state from context
    const [activeView, setActiveView] = useState('dashboard'); // Controls which component/view is currently displayed
    const [sobrietyStartDate, setSobrietyStartDate] = useState(null); // Stores the user's sobriety date
    const [isDataLoading, setIsDataLoading] = useState(true); // Tracks loading state for user data (like sobriety date)
    const [journalTemplate, setJournalTemplate] = useState(''); // Holds pre-filled text for a new journal entry
    const [journalTags, setJournalTags] = useState([]); // Holds pre-filled tags for a new journal entry
    const [deferredPrompt, setDeferredPrompt] = useState(null); // Stores the PWA install prompt event to be triggered later

    // --- Effects ---

    // Effect to initialize data storage and load user data when the session changes (e.g., on login/logout).
    useEffect(() => {
        // Set the storage engine (localStorage for guests or Firestore for authenticated users).
        DataStore.setStorageEngine(session?.type);

        const loadUserData = async () => {
            if (session) {
                setIsDataLoading(true);
                // Load the sobriety start date from the data store.
                const storedDate = await DataStore.load(DataStore.KEYS.SOBRIETY);
                if (storedDate) {
                    setSobrietyStartDate(new Date(storedDate));
                } else {
                    // If no date is set, the user will be prompted to set one.
                    setSobrietyStartDate(null);
                }
                setIsDataLoading(false);
            } else {
                // No session, so no user data to load.
                setIsDataLoading(false);
            }
        };
        loadUserData();
    }, [session]); // This effect re-runs whenever the 'session' object changes.

    // Effect to listen for the browser's PWA installation prompt event.
    useEffect(() => {
        const handler = (e) => {
            // Prevent the default browser prompt from appearing immediately.
            e.preventDefault();
            // Save the event so it can be triggered later by a custom button click.
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Cleanup function to remove the event listener when the component unmounts.
        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    // --- Event Handlers ---

    /**
     * Handles saving a new or updated sobriety date to the data store.
     * @param {Date} newDate - The new sobriety date to save.
     */
    const handleSobrietyDateUpdate = async (newDate) => {
        if (!newDate || isNaN(newDate.getTime())) return; // Validate date before saving
        setSobrietyStartDate(newDate);
        await DataStore.save(DataStore.KEYS.SOBRIETY, newDate.toISOString());
    };

    /**
     * Creates a journal template when a user wants to journal about a coping card.
     * @param {object} card - The coping card object with title and description.
     */
    const handleJournalFromCopingCard = (card) => {
        const template = `Coping Card Reflection: "${card.title}"\n\n**Strategy:** ${card.description}\n\n**My Application Plan:**\n\n`;
        setJournalTemplate(template);
        setJournalTags(['Coping Skills']);
        setActiveView('journal'); // Navigate to the journal view
    };

    /**
     * Creates a journal template from a daily reflection.
     * @param {object} reflection - The reflection object with title and quote.
     */
    const handleJournalFromReflection = (reflection) => {
        if (!reflection) return;
        const template = `Reflection on "${reflection.title}"\n\n> ${reflection.quote.replace(/\n/g, '\n> ')}\n\nMy thoughts:\n\n`;
        setJournalTemplate(template);
        setJournalTags(['Daily Reflection']);
        setActiveView('journal');
    };

    /**
     * Creates a journal template from a "Just for Today" meditation.
     * @param {object} meditation - The meditation object with title and quote.
     */
    const handleJournalFromMeditation = (meditation) => {
        if (!meditation) return;
        const template = `Meditation on "${meditation.title}"\n\n> "${meditation.quote}"\n\nMy thoughts:\n\n`;
        setJournalTemplate(template);
        setJournalTags(['Just for Today']);
        setActiveView('journal');
    };

    /**
     * Triggers the saved PWA installation prompt when the user clicks the "Install App" button.
     */
    const handleInstallPWA = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt.
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the PWA install prompt.');
            }
            // The prompt can only be used once, so clear it.
            setDeferredPrompt(null);
        }
    };

    // --- Render Logic ---

    // Show a full-screen spinner while checking authentication status or loading initial data.
    if (authLoading || isDataLoading) {
        return <div className="h-screen w-full flex items-center justify-center bg-gray-100"><Spinner /></div>;
    }

    // If there's no user session, show the login page.
    if (!session) {
        return <Login />;
    }

    // If a user is logged in but has no sobriety date set, force them to set one.
    if (!sobrietyStartDate) {
        return <SobrietyDataSetup onDateSet={handleSobrietyDateUpdate} />;
    }

    // Main navigation router: determines which component to display based on `activeView` state.
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard onNavigate={setActiveView} sobrietyStartDate={sobrietyStartDate} deferredPrompt={deferredPrompt} onInstallPWA={handleInstallPWA} />;
            case 'journal':
                return <DailyJournal journalTemplate={journalTemplate} setJournalTemplate={setJournalTemplate} journalTags={journalTags} setJournalTags={setJournalTags} />;
            case 'goals':
                return <Goals />;
            case 'workbook':
                return <RecoveryWorkbook />;
            case 'literature':
                return <RecoveryLiterature onNavigate={setActiveView} setJournalTemplate={setJournalTemplate} />;
            case 'resources':
                return <Resources />;
            case 'settings':
                return <Settings
                    currentStartDate={sobrietyStartDate}
                    handleSobrietyDateUpdate={handleSobrietyDateUpdate}
                    onBack={() => setActiveView('dashboard')}
                    onLogout={logout}
                />;
            case 'finder':
                return <MeetingManagement onNavigate={setActiveView} onBack={() => setActiveView('dashboard')} />;
            case 'daily-readings':
                return <DailyReadings onBack={() => setActiveView('dashboard')} onNavigate={setActiveView} />;
            case 'reflection':
                return <DailyReflection onBack={() => setActiveView('daily-readings')} onJournal={handleJournalFromReflection} />;
            case 'just-for-today':
                return <JustForToday onBack={() => setActiveView('daily-readings')} onJournal={handleJournalFromMeditation} />;
            case 'challenge':
                return <NinetyDayChallenge onBack={() => setActiveView('dashboard')} onNavigate={setActiveView} setJournalTemplate={setJournalTemplate} />;
            case 'homegroup':
                return <Homegroup onBack={() => setActiveView('finder')} onNavigate={setActiveView} />;
            case 'meetingTracker':
                return <MeetingTracker onBack={() => setActiveView('homegroup')} />;

            // Coping Tools Navigation
            case 'coping-tools':
                return <CopingTools onNavigate={setActiveView} onBack={() => setActiveView('dashboard')} />;
            case 'coping-cards':
                return <CopingCards onJournal={handleJournalFromCopingCard} onBack={() => setActiveView('coping-tools')} />;
            case 'breathing-exercises':
                return <BreathingExercise onBack={() => setActiveView('coping-tools')} />;
            case 'yoga':
                return <YogaWalkthrough onBack={() => setActiveView('coping-tools')} />;
            case 'recovery-games':
                return <RecoveryGames onBack={() => setActiveView('coping-tools')} />;

            // Default case to prevent errors, falls back to the dashboard.
            default:
                return <Dashboard onNavigate={setActiveView} sobrietyStartDate={sobrietyStartDate} deferredPrompt={deferredPrompt} onInstallPWA={handleInstallPWA} />;
        }
    };

    // --- Main JSX Layout ---
    return (
        <div className="bg-gray-100 h-screen w-full flex flex-col font-sans text-gray-800 p-2 sm:p-4">
            {/* Header section with navigation buttons and app title */}
            <header className="flex-shrink-0 w-full max-w-2xl mx-auto flex items-center justify-between p-4">
                {/* Conditional header button: Shows 'Resources' on dashboard, otherwise a 'Back' arrow */}
                {activeView === 'dashboard' ? (
                    <button onClick={() => setActiveView('resources')} className="text-red-500 hover:text-red-700 p-1" title="Emergency Resources"><LifeBuoyIcon className="w-6 h-6" /></button>
                ) : (
                    <button onClick={() => setActiveView('dashboard')} className="text-teal-600 hover:text-teal-800 p-2 -ml-2" title="Back to Dashboard"><ArrowLeftIcon className="w-6 h-6" /></button>
                )}
                <h1 className="text-xl font-bold text-gray-700">The Addict's Agenda</h1>
                <button onClick={() => setActiveView('settings')} className="text-gray-500 hover:text-teal-600 p-1" title="Settings"><SettingsIcon className="w-6 h-6" /></button>
            </header>

            {/* Main content area where the active component is rendered */}
            <main className="flex-grow w-full max-w-2xl mx-auto overflow-y-auto pb-4">
                {/* Suspense provides a fallback UI (Spinner) while lazy-loaded components are being fetched */}
                <Suspense fallback={<Spinner />}>
                    {renderContent()}
                </Suspense>
            </main>
        </div>
    );
};

export default App;