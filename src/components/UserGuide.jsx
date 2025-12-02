// src/components/UserGuide.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ChevronDown, ChevronUp, BookOpenIcon, DownloadIcon, ShieldIcon, ScaleIcon } from '../utils/icons.jsx';
import jsPDF from 'jspdf';

// --- Helper Component for Collapsible Sections ---
const CollapsibleSection = ({ id, title, children, isOpen, onToggle, sectionRef, icon }) => (
    <section ref={sectionRef} id={id} className="border-b border-gray-200 last:border-0 scroll-mt-20">
        <button
            onClick={() => onToggle(id)}
            className="w-full flex justify-between items-center py-6 text-left group focus:outline-none"
        >
            <div className="flex items-center gap-3">
                {icon && <div className="text-teal-600">{icon}</div>}
                <h2 className="text-2xl font-bold text-teal-700 group-hover:text-teal-800 transition-colors">
                    {title}
                </h2>
            </div>
            <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-teal-100 text-teal-700' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
        </button>
        
        {isOpen && (
            <div className="pb-8 animate-fade-in text-gray-700 leading-relaxed px-2">
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
    const dataRef = useRef(null);
    const privacyRef = useRef(null);

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
        'data': dataRef,
        'privacy': privacyRef,
    };

    // --- State for Expanded Sections ---
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
        'data': false,
        'privacy': false,
    });

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const expandAndScrollTo = (id) => {
        setExpandedSections(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
            if (sectionRefs[id] && sectionRefs[id].current) {
                sectionRefs[id].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    useEffect(() => {
        if (targetSection && sectionRefs[targetSection]) {
            expandAndScrollTo(targetSection);
        } else {
            setExpandedSections(prev => ({ ...prev, 'dashboard': true }));
            window.scrollTo(0, 0);
        }
    }, [targetSection]);

    // --- PDF Download Logic ---
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        
        doc.setProperties({
            title: 'My Recovery Toolkit - User Guide',
            subject: 'User Manual & Privacy Policy',
            author: 'My Recovery Toolkit'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxTextWidth = pageWidth - (margin * 2);
        let y = 20;

        const addText = (text, size = 12, style = 'normal', color = [0, 0, 0]) => {
            if (y > 280) { doc.addPage(); y = 20; }
            doc.setFontSize(size);
            doc.setFont('helvetica', style);
            doc.setTextColor(...color);
            
            const splitText = doc.splitTextToSize(text, maxTextWidth);
            doc.text(splitText, margin, y);
            y += (splitText.length * size * 0.4) + 6;
        };

        addText('My Recovery Toolkit', 24, 'bold', [13, 148, 136]); 
        addText('User Guide & Privacy Policy', 16, 'normal');
        addText(`Generated on: ${new Date().toLocaleDateString()}`, 10, 'italic', [100, 100, 100]);
        y += 10;

        addText('Overview', 16, 'bold');
        addText('This document contains instructions for using the app, explaining how your data is handled, and our privacy commitment.');
        y += 10;

        // Simplified content for PDF to avoid parsing complex JSX
        addText('1. Data & Security', 14, 'bold');
        addText('Your data is stored locally on your device by default ("Local-First"). If you enable encryption, your data is scrambled using AES-256 encryption. Your PIN is the key. We do not store your PIN.');
        y += 10;

        addText('2. Privacy Policy', 14, 'bold');
        addText('We do not collect personal data. All journal entries, workbook answers, and inventory lists remain on your device unless you explicitly export them.');
        y += 10;

        addText('3. Medical Disclaimer', 14, 'bold');
        addText('My Recovery Toolkit is a self-help companion tool. It is NOT a substitute for professional medical advice, diagnosis, or treatment.');

        doc.save('My_Recovery_Toolkit_User_Guide.pdf');
    };

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
        { id: 'settings', label: 'Settings' },
        { id: 'data', label: 'Data & Security' },
        { id: 'privacy', label: 'Privacy & Legal' },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col overflow-y-auto">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 flex-shrink-0 gap-4">
                <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to App</span>
                </button>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <h1 className="text-2xl font-bold text-gray-800 flex-grow sm:flex-grow-0">User Guide</h1>
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-teal-200 transition-colors"
                        title="Download as PDF"
                    >
                        <DownloadIcon className="w-4 h-4"/> <span>Download PDF</span>
                    </button>
                </div>
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
                <CollapsibleSection id="dashboard" title="Dashboard & Sobriety" isOpen={expandedSections['dashboard']} onToggle={toggleSection} sectionRef={dashboardRef}>
                    <p className="mb-6">The Dashboard is your home base. It provides an at-a-glance view of your progress and quick access to all recovery tools.</p>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Dashboard Features</h3>
                    <div className="space-y-6">
                        
                        {/* 1. The Counter */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">⏱️ The Sobriety Counter</h4>
                            <p className="text-sm text-gray-600 mb-2">Tracks your clean time down to the second.</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                <li><strong>Real-Time Updates:</strong> Watch the seconds tick by as a reminder of your accumulating success.</li>
                                <li><strong>Milestones:</strong> The counter breaks down your time into Days, Hours, Minutes, and Seconds.</li>
                                <li><strong>Resetting/Editing:</strong> Need to change your start date? Tap the <strong>Settings Icon (Gear)</strong> in the top right corner of the screen.</li>
                            </ul>
                        </div>

                        {/* 2. Daily Accountability */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📅 Daily Accountability</h4>
                            <p className="text-sm text-gray-600 mb-2">Stay consistent with visual cues.</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                <li>Look at the <strong>Journal</strong> button in the grid.</li>
                                <li><strong>Red Exclamation Mark (<span className="text-red-500 font-bold">!</span>):</strong> This badge appears if you haven't made a journal entry today. It's a gentle nudge to check in with yourself.</li>
                                <li><strong>Clear the Alert:</strong> Simply tap the Journal button and write an entry (even a short one!) to remove the badge.</li>
                            </ul>
                        </div>

                        {/* 3. App Installation */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📲 Install for Offline Use</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>If you are on a mobile device or compatible browser, you may see a teal button labeled <strong>"Install App to Home Screen"</strong>.</li>
                                <li>Tap it to install the Toolkit as an app on your device.</li>
                                <li><strong>Benefits:</strong> This allows you to use the app <strong>offline</strong> (no internet required) and gives you more screen space.</li>
                            </ol>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- JOURNAL SECTION --- */}
                <CollapsibleSection id="journal" title="Daily Journal" isOpen={expandedSections['journal']} onToggle={toggleSection} sectionRef={journalRef}>
                    <p className="mb-6">The Daily Journal is your safe space for honest reflection. It combines traditional journaling with AI-powered insights to help you spot patterns in your recovery.</p>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Feature Walkthroughs</h3>

                    <div className="space-y-6">
                        {/* 1. Creating an Entry */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📝 How to Create a New Entry</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>Tap the big blue <strong>"Add New Entry"</strong> button at the top of the list.</li>
                                <li><strong>Write:</strong> Type your thoughts in the text area.</li>
                                <li><strong>Mood Check:</strong> Slide the Mood Slider (1-10) to record how you feel right now.</li>
                                <li><strong>Tagging:</strong> Type a tag (e.g., "Anxiety", "Meeting") in the input box and press Enter or click "Add". Tags help you filter your entries later.</li>
                                <li>Tap <strong>"Add New Entry"</strong> to save.</li>
                            </ol>
                        </div>

                        {/* 2. Using Templates */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📋 Using Templates</h4>
                            <p className="text-sm text-gray-600 mb-2">Don't know what to write? Use a structured template.</p>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>In the "New Entry" screen, look for the dropdown menu labeled <strong>"Select a Template..."</strong>.</li>
                                <li>Choose a template like <strong>"3-Part Gratitude Check"</strong> or <strong>"The H.A.L.T. Check"</strong>.</li>
                                <li>Tap the <strong>"Apply"</strong> button.</li>
                                <li>The text box will fill with questions, and relevant tags (like "gratitude") will be automatically added.</li>
                            </ol>
                        </div>

                        {/* 3. AI Analysis */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">✨ Using AI Analysis</h4>
                            <p className="text-sm text-gray-600 mb-2">Let AI summarize your emotional trends over time.</p>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>On the main Journal list, tap the white button with the <span className="inline-block bg-white border rounded px-1">Sparkles Icon</span>.</li>
                                <li><strong>Filter:</strong> A menu will appear. Select a date range (e.g., last 30 days) and optionally select tags to filter by (e.g., analyze only entries tagged "Family").</li>
                                <li>Tap <strong>"Start Analysis"</strong>.</li>
                                <li>The AI will read your selected entries and generate a report on your <strong>Emotional Themes</strong>, <strong>Triggers & Wins</strong>, and offer <strong>Encouragement</strong>.</li>
                            </ol>
                        </div>

                        {/* 4. Mood Graph */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📈 Viewing Your Mood Graph</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>On the main Journal list, tap the white button with the <span className="inline-block bg-white border rounded px-1">Graph Icon</span>.</li>
                                <li>You will see a line chart of your mood ratings (1-10) over time.</li>
                                <li>Tap any dot on the line to see the specific date and score for that entry.</li>
                                <li><em>Note: You need at least 2 entries with mood ratings for the graph to appear.</em></li>
                            </ol>
                        </div>

                         {/* 5. AI Writing Helper */}
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">💡 Using the AI Writing Helper</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>If you are staring at a blank page, tap <strong>"Get Idea with AI"</strong> below the text box.</li>
                                <li>A helper will appear asking how you feel or what you want to focus on.</li>
                                <li>Type a brief thought (e.g., "I'm feeling restless") and the AI will generate a specific writing prompt to get you started.</li>
                            </ol>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- COPING TOOLS SECTION --- */}
                <CollapsibleSection id="coping" title="Coping Tools" isOpen={expandedSections['coping']} onToggle={toggleSection} sectionRef={copingRef}>
                    <p className="mb-6">A suite of interactive tools designed to help you manage cravings, anxiety, and high-stress moments immediately.</p>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Tool Walkthroughs</h3>
                    <div className="space-y-6">
                        
                        {/* 1. Coping Cards */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🛡️ Coping Cards</h4>
                            <p className="text-sm text-gray-600 mb-2">Quick, bite-sized strategies for when you need an immediate shift in perspective.</p>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li><strong>Shuffle:</strong> Tap <strong>"Get New Card"</strong> to draw a random strategy from categories like <em>Grounding</em>, <em>Action</em>, or <em>Connection</em>.</li>
                                <li><strong>Apply:</strong> Read the card's instruction (e.g., "5-4-3-2-1 Grounding") and try to perform the action immediately.</li>
                                <li><strong>Reflect:</strong> If a strategy works for you, tap <strong>"Journal on This"</strong>. This opens a new journal entry pre-filled with the card's details so you can record your victory.</li>
                            </ol>
                        </div>

                        {/* 2. Breathing Exercises */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🌬️ Breathing Room</h4>
                            <p className="text-sm text-gray-600 mb-2">Regulate your nervous system with guided visual breathing.</p>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li><strong>Choose Pattern:</strong> Select <strong>"Box Breathing"</strong> (4-4-4-4) for focus or <strong>"4-7-8"</strong> for deep relaxation.</li>
                                <li><strong>Start:</strong> Tap the "Start" button.</li>
                                <li><strong>Follow Along:</strong> Inhale as the circle expands, hold when it pauses, and exhale as it shrinks.</li>
                                <li><strong>Haptic Cues:</strong> If you are on a mobile device, the phone will vibrate gently when it's time to switch phases, allowing you to close your eyes.</li>
                            </ol>
                        </div>

                        {/* 3. Recovery Games */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🎮 Recovery Arcade</h4>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                <li><strong>Recovery Jeopardy:</strong> Test your knowledge of 12-Step history, slogans, and literature in a trivia format. Great for a group or solo distraction.</li>
                                <li><strong>Recovery Simulator:</strong> A "choose your own adventure" game where you navigate daily life scenarios. Make healthy choices to keep your serenity meter high!</li>
                            </ul>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- WORKBOOK SECTION (UPDATED) --- */}
                <CollapsibleSection id="workbook" title="Recovery Workbook" isOpen={expandedSections['workbook']} onToggle={toggleSection} sectionRef={workbookRef}>
                    <p className="mb-6">A structured environment to work the Steps and explore Recovery Dharma inquiries. Your progress is saved automatically.</p>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Workbook Features</h3>
                    <div className="space-y-6">
                        
                        {/* 1. Working the Steps */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">✍️ Working the Steps</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>Select a category (e.g., <strong>"The 12 Steps"</strong> or <strong>"Recovery Dharma"</strong>).</li>
                                <li>Choose a specific Step or Inquiry from the list. Steps with completed questions will have a green checkmark.</li>
                                <li>Tap a section header (e.g., <strong>"Powerlessness"</strong>) to expand it and reveal the questions.</li>
                                <li>Type your answers in the text boxes. You will see a <strong>"Saving..."</strong> indicator that changes to <strong>"Saved"</strong> automatically when you stop typing.</li>
                            </ol>
                        </div>

                        {/* 2. PDF Export */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📄 Exporting Your Work</h4>
                            <p className="text-sm text-gray-600 mb-2">Great for sharing your Step 4 inventory or Step 10 review with a sponsor.</p>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>Open any specific Step or Topic you have been working on.</li>
                                <li>Tap the <strong>"Export PDF"</strong> button at the top right.</li>
                                <li>A PDF containing the questions and your specific answers for that topic will download immediately.</li>
                            </ol>
                        </div>

                        {/* 3. AI Insights */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🧠 Get AI Feedback</h4>
                            <p className="text-sm text-gray-600 mb-2">Receive an objective summary of your recovery work.</p>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>On the main Workbook screen, tap the pink <strong>"Get AI Insights on Your Work"</strong> button.</li>
                                <li>The AI will review all your saved answers across the entire workbook.</li>
                                <li>It will generate a compassionate report highlighting <strong>Key Themes</strong> in your writing and suggesting <strong>Areas for Growth</strong>.</li>
                            </ol>
                        </div>

                        {/* 4. Tracking Progress */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📊 Tracking Progress</h4>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                <li><strong>Overall Progress:</strong> A bar at the top of the main screen shows your total completion percentage.</li>
                                <li><strong>Category Progress:</strong> Each category (like "The 12 Steps") has its own progress bar so you can see how far along you are in that specific program.</li>
                            </ul>
                        </div>

                        {/* 5. SMART Recovery Tools (NEW) */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="font-bold text-blue-800 mb-2">🧠 SMART Recovery Tools</h4>
                            <p className="text-sm text-blue-700 mb-3">Practical, interactive tools for self-management (CBA, ABCs, Lifestyle Balance). Use these tools to apply rational thinking to recovery challenges.</p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700">
                                <li><strong>CBA (Cost Benefit Analysis):</strong> Weigh the pros and cons of using vs. abstaining using 4 quadrants.</li>
                                <li><strong>ABC Tool:</strong> Analyze your Activating Events, Beliefs, and Consequences to challenge irrational thoughts.</li>
                                <li><strong>Lifestyle Balance:</strong> Visualize your satisfaction across 6 life areas using a radar chart.</li>
                                <li><strong>Urge Log:</strong> Track your triggers and intensity to find patterns.</li>
                                <li><strong>Effective Goal Setting:</strong> Create specific, measurable plans for your recovery.</li>
                                <li><strong>Practice Self-Compassion:</strong> Counter feelings of hopelessness by being kind to yourself.</li>
                                <li><strong>Five Questions:</strong> Align your current actions with your future goals.</li>
                                <li><strong>Customize DENTS:</strong> Develop strategies to Deny, Escape, Neutralize, Task, or Swap during an urge.</li>
                                <li><strong>Personify and Disarm:</strong> Give your urge a name to take away its power.</li>
                                <li><strong>Setting Healthy Boundaries:</strong> Practice setting small boundaries to build confidence for larger ones.</li>
                                <li><em>Tip: Use the "Save to Journal" button in any tool to save your work directly to your daily journal.</em></li>
                            </ul>
                        </div>

                    </div>
                </CollapsibleSection>

                {/* --- LITERATURE SECTION --- */}
                <CollapsibleSection id="literature" title="Literature Library" isOpen={expandedSections['literature']} onToggle={toggleSection} sectionRef={literatureRef}>
                    <p className="mb-6">Read the foundational texts of Alcoholics Anonymous, Narcotics Anonymous, and Recovery Dharma directly in the app. The reader is designed for study and reflection.</p>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3">How to Use the Reader</h3>
                    <div className="space-y-6">
                        
                        {/* 1. Browsing */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📚 Browsing Books & Chapters</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li>On the main Literature screen, tap <strong>"Read in App"</strong> below any book title (e.g., "The Big Book").</li>
                                <li>You will see a Table of Contents. For larger books like the Big Book, chapters are grouped into sections like <strong>"The Chapters"</strong> and <strong>"Personal Stories"</strong>.</li>
                                <li>Tap a section to expand it, then tap any chapter title to start reading.</li>
                            </ol>
                        </div>

                        {/* 2. Reading & Navigation */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">📖 Reading Mode</h4>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                                <li><strong>Pagination:</strong> Long chapters are split into pages. Use the <strong>"Next"</strong> and <strong>"Previous"</strong> buttons at the bottom to navigate.</li>
                                <li><strong>Progress:</strong> The page indicator (e.g., "Page 3 of 12") helps you keep your place.</li>
                            </ul>
                        </div>

                        {/* 3. Highlighting & Journaling */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">🖊️ Highlighting & Journaling</h4>
                            <p className="text-sm text-gray-600 mb-2">Found a passage that speaks to you? You can save it instantly.</p>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                                <li><strong>Highlight Text:</strong> Long-press (on mobile) or click and drag (on desktop) to select any text on the page.</li>
                                <li><strong>Save to Journal:</strong> A customized button labeled <strong>"Journal Highlight"</strong> will appear. Tap it to automatically create a new journal entry containing your selected quote.</li>
                                <li><strong>Reflect on Page:</strong> Even without selecting text, you can tap <strong>"Journal about this page"</strong> to start a blank entry tagged with the current book and chapter title.</li>
                            </ol>
                        </div>

                        {/* 4. PDF Download */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-teal-600 mb-2">⬇️ PDF Downloads</h4>
                            <p className="text-sm text-gray-600">
                                Need a copy for offline sharing? Tap the green <strong>"PDF"</strong> button next to any book title on the main list to open the official PDF version in your browser.
                            </p>
                        </div>

                    </div>
                </CollapsibleSection>

                {/* --- GOALS SECTION --- */}
                <CollapsibleSection id="goals" title="Goals & Milestones" isOpen={expandedSections['goals']} onToggle={toggleSection} sectionRef={goalsRef}>
                    <p className="mb-4">Set manageable goals for your recovery, health, and personal life.</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        <li><strong>Tracking:</strong> Mark goals as "In Progress" or "Completed" to visualize your achievements.</li>
                        <li><strong>Categories:</strong> Organize goals by type (e.g., Spiritual, Physical, Financial).</li>
                    </ul>
                </CollapsibleSection>
                
                 {/* --- MEETINGS SECTION --- */}
                 <CollapsibleSection id="meetings" title="Meeting Management" isOpen={expandedSections['meetings']} onToggle={toggleSection} sectionRef={meetingsRef}>
                    <p className="mb-4">Keep track of your meeting attendance and service commitments.</p>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        <li><strong>Tracker:</strong> Log every meeting you attend to build a history of your commitment.</li>
                        <li><strong>Homegroup:</strong> Store details about your homegroup, including business meeting notes and group conscience decisions.</li>
                    </ul>
                </CollapsibleSection>

                 {/* --- RESOURCES SECTION --- */}
                 <CollapsibleSection id="resources" title="Emergency Resources" isOpen={expandedSections['resources']} onToggle={toggleSection} sectionRef={resourcesRef}>
                    <p className="mb-4">Quick access to helplines and professional support.</p>
                    <p className="text-gray-700 text-sm">Tap the <span className="text-red-500 font-bold">Lifebuoy icon</span> on the dashboard for immediate access to crisis lines and local resources.</p>
                </CollapsibleSection>

                {/* --- SETTINGS SECTION --- */}
                <CollapsibleSection id="settings" title="Settings" isOpen={expandedSections['settings']} onToggle={toggleSection} sectionRef={settingsRef}>
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

                {/* --- DATA & SECURITY SECTION --- */}
                <CollapsibleSection 
                    id="data" 
                    title="Data & Security" 
                    isOpen={expandedSections['data']} 
                    onToggle={toggleSection} 
                    sectionRef={dataRef}
                    icon={<ShieldIcon className="w-6 h-6" />}
                >
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">Where is my data stored?</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                My Recovery Toolkit follows a <strong>"Local-First"</strong> architecture. This means your journal entries, workbook answers, and sobriety statistics are stored directly on your device (in your browser's LocalStorage or IndexedDB). 
                                <br/><br/>
                                By default, <strong>your data does not leave your phone/computer</strong>. We do not have a central server that reads your personal thoughts.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">How does Encryption work?</h3>
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                If you enable <strong>End-to-End Encryption</strong> in Settings, we use the AES-256 standard (Advanced Encryption Standard) to scramble your data.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                                <li><strong>Your PIN is the Key:</strong> When you set a PIN, it acts as the mathematical key to lock your data.</li>
                                <li><strong>Zero-Knowledge:</strong> We do not store your PIN. If you forget it, <strong>we cannot recover your data for you</strong>. This ensures that no one—not even the app developers—can access your recovery work without your permission.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                            <h3 className="font-bold text-gray-800 text-lg mb-2">AI Processing</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                When you use features like "AI Insights" or the "Journal Helper," specific text is sent securely to Google Gemini AI for processing. 
                                <br/>
                                <strong>Privacy Note:</strong> This data is stateless—it is sent for analysis and the result is returned. It is not used to train public AI models in a way that links back to your identity.
                            </p>
                        </div>
                    </div>
                </CollapsibleSection>

                {/* --- PRIVACY POLICY & LEGAL SECTION --- */}
                <CollapsibleSection 
                    id="privacy" 
                    title="Privacy Policy & Legal" 
                    isOpen={expandedSections['privacy']} 
                    onToggle={toggleSection} 
                    sectionRef={privacyRef}
                    icon={<ScaleIcon className="w-6 h-6" />}
                >
                    <div className="prose prose-sm text-gray-700 max-w-none">
                        <h3 className="font-bold text-gray-800 text-lg mt-4 mb-2">Privacy Policy</h3>
                        <p className="italic text-xs text-gray-500 mb-4">Effective Date: {new Date().getFullYear()}</p>
                        
                        <p><strong>1. Introduction</strong><br/>
                        My Recovery Toolkit ("we," "our," or "us") respects your privacy. This policy explains that we collect <strong>no personal identifiable information (PII)</strong> by default.</p>

                        <p><strong>2. Information We Collect</strong><br/>
                        We do not collect names, emails, addresses, or phone numbers. All data entered into the application (journal entries, inventory, dates) is stored locally on your device.</p>

                        <p><strong>3. Data Usage</strong><br/>
                        Your data is used solely for the purpose of providing you with recovery tools within the application. We do not sell, trade, or transfer your data to outside parties.</p>

                        <hr className="my-6 border-gray-200" />

                        <h3 className="font-bold text-gray-800 text-lg mb-2">Medical & Legal Disclaimer</h3>
                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 text-red-900">
                            <p className="font-bold mb-1">NOT MEDICAL ADVICE</p>
                            <p>
                                My Recovery Toolkit is designed to support, not replace, the relationship that exists between a patient/site visitor and his/her existing physician. 
                                <strong> This app is not a medical device</strong> and does not offer medical diagnosis or treatment.
                            </p>
                            <p className="mt-2">
                                If you are experiencing a medical emergency, believe you may be a danger to yourself or others, or are experiencing severe withdrawal symptoms, <strong>please call 911 or your local emergency number immediately.</strong>
                            </p>
                        </div>

                        <h3 className="font-bold text-gray-800 text-lg mt-6 mb-2">Terms of Use</h3>
                        <p>
                            By using this application, you agree that you are solely responsible for your recovery journey. The developers of My Recovery Toolkit assume no liability for the use or misuse of the information provided.
                        </p>
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