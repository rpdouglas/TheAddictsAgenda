// src/components/UserGuide.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ChevronDown, ChevronUp, BookOpenIcon } from '../utils/icons.jsx';

// --- Helper Component for Collapsible Sections ---
const CollapsibleSection = ({ id, title, children, isOpen, onToggle, sectionRef }) => (
    <section ref={sectionRef} id={id} className="border-b border-gray-200 last:border-0 scroll-mt-20">
        <button
            onClick={() => onToggle(id)}
            className="w-full flex justify-between items-center py-6 text-left group focus:outline-none"
        >
            <h2 className="text-2xl font-bold text-teal-700 group-hover:text-teal-800 transition-colors">
                {title}
            </h2>
            <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-teal-100 text-teal-700' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
        </button>
        
        {isOpen && (
            <div className="pb-8 animate-fade-in text-gray-700 leading-relaxed">
                {children}
            </div>
        )}
    </section>
);

const UserGuide = ({ onBack, targetSection }) => {
    // --- Refs for Scrolling ---
    const dashboardRef = useRef(null);
    const journalRef = useRef(null);
    const copingRef = useRef(null);
    const workbookRef = useRef(null);
    const literatureRef = useRef(null);
    const goalsRef = useRef(null);
    const meetingsRef = useRef(null);
    const resourcesRef = useRef(null);
    const settingsRef = useRef(null);

    const sectionRefs = {
        'dashboard': dashboardRef,
        'journal': journalRef,
        'coping': copingRef,
        'workbook': workbookRef,
        'literature': literatureRef,
        'goals': goalsRef,
        'meetings': meetingsRef,
        'resources': resourcesRef,
        'settings': settingsRef,
    };

    // --- State for Expanded Sections ---
    // Initialize all as false (collapsed) by default
    const [expandedSections, setExpandedSections] = useState({
        'dashboard': false,
        'journal': false,
        'coping': false,
        'workbook': false,
        'literature': false,
        'goals': false,
        'meetings': false,
        'resources': false,
        'settings': false,
    });

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const expandAndScrollTo = (id) => {
        // 1. Expand the section
        setExpandedSections(prev => ({ ...prev, [id]: true }));
        
        // 2. Scroll to it (small timeout to allow render)
        setTimeout(() => {
            if (sectionRefs[id] && sectionRefs[id].current) {
                sectionRefs[id].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    // --- Effect: Handle Deep Linking ---
    useEffect(() => {
        if (targetSection && sectionRefs[targetSection]) {
            expandAndScrollTo(targetSection);
        } else {
            // Optional: Open the first section by default if no target
            setExpandedSections(prev => ({ ...prev, 'dashboard': true }));
            window.scrollTo(0, 0);
        }
    }, [targetSection]);

    // --- TOC Data ---
    const tocItems = [
        { id: 'dashboard', label: 'Dashboard & Sobriety' },
        { id: 'journal', label: 'Daily Journal' },
        { id: 'coping', label: 'Coping Tools' },
        { id: 'workbook', label: 'Recovery Workbook' },
        { id: 'literature', label: 'Literature Library' },
        { id: 'goals', label: 'Goals & Milestones' },
        { id: 'meetings', label: 'Meeting Management' },
        { id: 'resources', label: 'Emergency Resources' },
        { id: 'settings', label: 'Settings & Data' },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col overflow-y-auto">
             <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to App</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">User Guide</h1>
            </div>

            <p className="text-gray-600 mb-8">
                Welcome to <strong>My Recovery Toolkit</strong>. This guide covers all features designed to support your journey of self-discovery, structure, and sobriety.
            </p>

            {/* --- TABLE OF CONTENTS --- */}
            <nav className="mb-10 p-5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-deep-charcoal border-b border-gray-200 pb-2">
                    <BookOpenIcon className="w-5 h-5 text-teal-600"/>
                    <h2 className="font-bold text-lg">Table of Contents</h2>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {tocItems.map(item => (
                        <li key={item.id}>
                            <button 
                                onClick={() => expandAndScrollTo(item.id)}
                                className="text-left text-teal-600 hover:text-teal-800 hover:underline text-sm font-medium transition-colors"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="space-y-2">
                
                {/* --- DASHBOARD SECTION --- */}
                <CollapsibleSection 
                    id="dashboard" 
                    title="Dashboard & Sobriety" 
                    isOpen={expandedSections['dashboard']} 
                    onToggle={toggleSection} 
                    sectionRef={dashboardRef}
                >
                    <p className="mb-6">The Dashboard is your home base. It provides an at-a-glance view of your progress and quick access to all recovery tools.</p>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Features</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">⏱️ The Sobriety Counter</h4>
                            <p className="text-sm mb-2">Tracks your clean time down to the second.</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong>Real-Time Updates:</strong> Watch the seconds tick by as a reminder of your accumulating success.</li>
                                <li><strong>Milestones:</strong> The counter breaks down your time into Days, Hours, Minutes, and Seconds.</li>
                                <li><strong>Resetting/Editing:</strong> Need to change your start date? Tap the <strong>Settings Icon (Gear)</strong> in the top right corner.</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📅 Daily Accountability</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong>Red Exclamation Mark (<span className="text-red-500 font-bold">!</span>):</strong> Appears on the Journal button if you haven't made an entry today.</li>
                                <li><strong>Clear the Alert:</strong> Tap the Journal button and write an entry to remove the badge.</li>
                            </ul>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- JOURNAL SECTION --- */}
                <CollapsibleSection 
                    id="journal" 
                    title="Daily Journal" 
                    isOpen={expandedSections['journal']} 
                    onToggle={toggleSection} 
                    sectionRef={journalRef}
                >
                    <p className="mb-6">Your safe space for honest reflection, combining traditional journaling with AI-powered insights.</p>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Feature Walkthroughs</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📝 Creating Entries</h4>
                            <ol className="list-decimal pl-5 space-y-1 text-sm">
                                <li>Tap <strong>"Add New Entry"</strong>.</li>
                                <li><strong>Mood Check:</strong> Slide the slider (1-10) to record how you feel.</li>
                                <li><strong>Tagging:</strong> Add tags like "Anxiety" or "Meeting" to filter entries later.</li>
                            </ol>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">✨ AI Analysis</h4>
                            <ol className="list-decimal pl-5 space-y-1 text-sm">
                                <li>Tap the <span className="inline-block bg-white border rounded px-1 text-xs">Sparkles Icon</span> on the main list.</li>
                                <li>Select a date range or filter by specific tags.</li>
                                <li>Tap <strong>"Start Analysis"</strong> to get a report on your emotional themes, triggers, and wins.</li>
                            </ol>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">💡 AI Writing Helper</h4>
                            <p className="text-sm">Stuck? Tap <strong>"Get Idea with AI"</strong> below the text box. Tell it briefly how you feel, and it will generate a personalized writing prompt.</p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- COPING TOOLS SECTION --- */}
                <CollapsibleSection 
                    id="coping" 
                    title="Coping Tools" 
                    isOpen={expandedSections['coping']} 
                    onToggle={toggleSection} 
                    sectionRef={copingRef}
                >
                    <p className="mb-6">Interactive tools designed to help you manage cravings, anxiety, and high-stress moments immediately.</p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🛡️ Coping Cards</h4>
                            <p className="text-sm">Quick strategies for immediate perspective shifts. Tap <strong>"Journal on This"</strong> to record your victory if a strategy works.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🌬️ Breathing Room</h4>
                            <p className="text-sm">Guided visual breathing (Box Breathing or 4-7-8). Uses <strong>haptic vibration</strong> on mobile so you can close your eyes and follow the buzz.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🎮 Recovery Games</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li><strong>Jeopardy:</strong> Test your knowledge of recovery history and slogans.</li>
                                <li><strong>Simulator:</strong> A life-management game. Manage Stress, Money, and Wellbeing to build a stable life without burning out.</li>
                            </ul>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- WORKBOOK SECTION --- */}
                <CollapsibleSection 
                    id="workbook" 
                    title="Recovery Workbook" 
                    isOpen={expandedSections['workbook']} 
                    onToggle={toggleSection} 
                    sectionRef={workbookRef}
                >
                    <p className="mb-6">A structured environment to work the Steps and explore Recovery Dharma inquiries.</p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">✍️ Working the Steps</h4>
                            <p className="text-sm">Select a Step or Inquiry. Questions are auto-saved as you type. Look for the <strong>"Saved"</strong> indicator.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📄 Export to PDF</h4>
                            <p className="text-sm">Tap <strong>"Export PDF"</strong> inside any topic to download a clean document of your questions and answers—perfect for sharing with a sponsor.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🧠 AI Feedback</h4>
                            <p className="text-sm">Tap <strong>"Get AI Insights on Your Work"</strong> on the main workbook screen to receive an objective summary of key themes in your answers.</p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- LITERATURE SECTION --- */}
                <CollapsibleSection 
                    id="literature" 
                    title="Literature Library" 
                    isOpen={expandedSections['literature']} 
                    onToggle={toggleSection} 
                    sectionRef={literatureRef}
                >
                    <p className="mb-6">Read the Big Book, Basic Text, and Recovery Dharma. Designed for study and reflection.</p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🖊️ Highlighting & Journaling</h4>
                            <ol className="list-decimal pl-5 space-y-1 text-sm">
                                <li><strong>Highlight:</strong> Select any text on a page.</li>
                                <li><strong>Save:</strong> Tap the <strong>"Journal Highlight"</strong> button that appears to create an entry quoting that text.</li>
                                <li><strong>Reflect:</strong> Tap "Journal about this page" to start a blank entry linked to the current chapter.</li>
                            </ol>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">⬇️ PDF Downloads</h4>
                            <p className="text-sm">Tap the green <strong>"PDF"</strong> button next to any book title to open the official PDF version for offline use.</p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- GOALS SECTION --- */}
                <CollapsibleSection 
                    id="goals" 
                    title="Goals & Milestones" 
                    isOpen={expandedSections['goals']} 
                    onToggle={toggleSection} 
                    sectionRef={goalsRef}
                >
                    <p className="mb-4">Set manageable goals for your recovery, health, and personal life.</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        <li><strong>Tracking:</strong> Mark goals as "In Progress" or "Completed" to visualize your achievements.</li>
                        <li><strong>Categories:</strong> Organize goals by type (e.g., Spiritual, Physical, Financial).</li>
                    </ul>
                </CollapsibleSection>
                
                 {/* --- MEETINGS SECTION --- */}
                 <CollapsibleSection 
                    id="meetings" 
                    title="Meeting Management" 
                    isOpen={expandedSections['meetings']} 
                    onToggle={toggleSection} 
                    sectionRef={meetingsRef}
                >
                    <p className="mb-4">Keep track of your meeting attendance and service commitments.</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        <li><strong>Tracker:</strong> Log every meeting you attend to build a history of your commitment.</li>
                        <li><strong>Homegroup:</strong> Store details about your homegroup, including business meeting notes and group conscience decisions.</li>
                    </ul>
                </CollapsibleSection>

                 {/* --- RESOURCES SECTION --- */}
                 <CollapsibleSection 
                    id="resources" 
                    title="Emergency Resources" 
                    isOpen={expandedSections['resources']} 
                    onToggle={toggleSection} 
                    sectionRef={resourcesRef}
                >
                    <p className="mb-4">Quick access to helplines and professional support.</p>
                    <p className="text-gray-700 text-sm">Tap the <span className="text-red-500 font-bold">Lifebuoy icon</span> on the dashboard for immediate access to crisis lines and local resources.</p>
                </CollapsibleSection>

                {/* --- SETTINGS SECTION --- */}
                <CollapsibleSection 
                    id="settings" 
                    title="Settings & Data" 
                    isOpen={expandedSections['settings']} 
                    onToggle={toggleSection} 
                    sectionRef={settingsRef}
                >
                    <p className="mb-6">Control your privacy, data, and app preferences.</p>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🔄 Changing Your Date</h4>
                            <p className="text-sm">Use the date picker to adjust your clean time. Optionally check "Journal about this date change" to process the event.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">✏️ Custom Header</h4>
                            <p className="text-sm">Change "You have been clean for" to a phrase that resonates with you (e.g., "Freedom since").</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🔒 End-to-End Encryption</h4>
                            <p className="text-sm">Enable a PIN to encrypt your local data. <strong>Warning:</strong> If you lose this PIN, your data cannot be recovered.</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">💾 Data Export</h4>
                            <p className="text-sm">Download a full JSON backup of your journals, settings, and workbook answers to keep your data safe.</p>
                        </div>
                    </div>
                </CollapsibleSection>

            </div>
            
            <div className="mt-12 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                <p>My Recovery Toolkit User Guide</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default UserGuide;