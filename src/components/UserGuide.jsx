// src/components/UserGuide.jsx
import React, { useEffect, useRef } from 'react';
import { ArrowLeftIcon } from '../utils/icons.jsx';

const UserGuide = ({ onBack, targetSection }) => {
    // Refs for each section to enable auto-scrolling
    const sections = {
        'dashboard': useRef(null),
        'journal': useRef(null),
        'coping': useRef(null),
        'workbook': useRef(null),
        'literature': useRef(null),
        'goals': useRef(null),
        'resources': useRef(null),
        'meetings': useRef(null),
    };

    // Scroll to target section on mount
    useEffect(() => {
        if (targetSection && sections[targetSection] && sections[targetSection].current) {
            sections[targetSection].current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo(0, 0);
        }
    }, [targetSection]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col overflow-y-auto">
             <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to App</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Guide</h1>
            <p className="text-gray-600 mb-8">Learn how to get the most out of your recovery toolkit.</p>

            <div className="space-y-12">
                
                {/* --- DASHBOARD SECTION --- */}
                <section ref={sections['dashboard']} id="dashboard" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Dashboard & Sobriety Tracker</h2>
                    <p className="mb-4">The Dashboard is your central command center. It displays your current sobriety counter and daily inspiration.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Sobriety Counter:</strong> Tracks your time in recovery down to the second. You can reset this in Settings if needed.</li>
                        <li><strong>Daily Quote:</strong> A new motivational quote appears every day to start your morning right.</li>
                        <li><strong>Quick Actions:</strong> Use the grid of buttons to navigate to other tools like the Journal, Goals, or Literature.</li>
                    </ul>
                </section>

                {/* --- JOURNAL SECTION --- */}
                <section ref={sections['journal']} id="journal" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Daily Journal</h2>
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
                </section>

                {/* --- COPING TOOLS SECTION --- */}
                <section ref={sections['coping']} id="coping" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Coping Tools</h2>
                    <p className="mb-4">A collection of strategies to help you manage cravings and high-stress moments.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Coping Cards:</strong> Swipe through random cards to find a quick affirmation or action to take immediately.</li>
                        <li><strong>Breathing Exercises:</strong> Follow the visual guide for Box Breathing or 4-7-8 Breathing to regulate your nervous system.</li>
                        <li><strong>Recovery Jeopardy:</strong> Distract yourself and test your knowledge with a recovery-themed trivia game.</li>
                    </ul>
                </section>

                {/* --- WORKBOOK SECTION --- */}
                <section ref={sections['workbook']} id="workbook" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Recovery Workbook</h2>
                    <p className="mb-4">Interactive exercises to work through the Steps and Recovery Dharma inquiries.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Step Work:</strong> Select a Step (1-12) to see specific questions and writing prompts.</li>
                        <li><strong>Exporting:</strong> You can export your answers to a PDF to share with your sponsor or mentor.</li>
                    </ul>
                </section>

                {/* --- LITERATURE SECTION (UPDATED) --- */}
                <section ref={sections['literature']} id="literature" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Literature Library</h2>
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
                </section>

                {/* --- GOALS SECTION --- */}
                <section ref={sections['goals']} id="goals" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Goals & Milestones</h2>
                    <p className="mb-4">Set manageable goals for your recovery, health, and personal life.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Tracking:</strong> Mark goals as "In Progress" or "Completed" to visualize your achievements.</li>
                        <li><strong>Categories:</strong> Organize goals by type (e.g., Spiritual, Physical, Financial).</li>
                    </ul>
                </section>
                
                 {/* --- MEETINGS SECTION --- */}
                 <section ref={sections['meetings']} id="meetings" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Meeting Management</h2>
                    <p className="mb-4">Keep track of your meeting attendance and service commitments.</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Tracker:</strong> Log every meeting you attend to build a history of your commitment.</li>
                        <li><strong>Homegroup:</strong> Store details about your homegroup, including business meeting notes and group conscience decisions.</li>
                    </ul>
                </section>

                 {/* --- RESOURCES SECTION --- */}
                 <section ref={sections['resources']} id="resources" className="border-b pb-8">
                    <h2 className="text-2xl font-bold text-teal-700 mb-4">Emergency Resources</h2>
                    <p className="mb-4">Quick access to helplines and professional support.</p>
                    <p className="text-gray-700">Tap the <span className="text-red-500 font-bold">Lifebuoy icon</span> on the dashboard for immediate access to crisis lines and local resources.</p>
                </section>

            </div>
            
            <div className="mt-12 p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                <p>My Recovery Toolkit User Guide</p>
                <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default UserGuide;