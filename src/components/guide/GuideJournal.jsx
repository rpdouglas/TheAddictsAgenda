// src/components/guide/GuideJournal.jsx
import React from 'react';

const GuideJournal = () => (
    <>
        <p className="mb-6 text-gray-600">The Daily Journal is your safe space for honest reflection. It combines traditional journaling with AI-powered insights to help you spot patterns.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Feature Walkthroughs</h3>

        <div className="space-y-6">
            {/* 1. Writing & Filtering */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-blue-700 mb-2">📝 Writing & Filtering</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Mood & Weather:</strong> Use the slider (1-10) and check the auto-detected weather to track environmental triggers.</li>
                    <li><strong>Templates:</strong> Stuck? Select a prompt like <em>"Gratitude Check"</em> from the dropdown.</li>
                    <li><strong>Filters-First:</strong> At the top of the list, use the <strong>Date Badges</strong> (e.g., "Last 30 Days") or the <strong>Tag Dropdown</strong> to narrow your view. <br/><em>Note: The AI only analyzes the entries currently visible in this list!</em></li>
                </ul>
            </div>

            {/* 2. AI Analysis & Action Plans */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">✨ AI Analysis & Action Plans</h4>
                <p className="text-sm text-blue-900 mb-3">Turn your entries into recovery data.</p>
                <ol className="list-decimal pl-5 space-y-2 text-blue-800 text-sm">
                    <li>Tap the <strong>Sparkles Icon</strong> in the filter bar.</li>
                    <li>The AI will read your <em>filtered</em> entries and find patterns (e.g., "You feel better on sunny days").</li>
                    <li><strong>Save Actions:</strong> Check the boxes next to "Suggested Actions" and tap <strong>Save</strong> to instantly add them to your To-Do List.</li>
                </ol>
            </div>

            {/* 3. Visualizations & History (UPDATED) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-blue-700 mb-2">📊 Insights Tab & History</h4>
                <p className="text-sm text-gray-700 mb-2">Switch to the "Insights" tab to see your data come to life:</p>
                <ul className="list-disc pl-5 space-y-3 text-gray-700 text-sm">
                    <li>
                        <strong>Mood Graph:</strong> A blue line tracks your emotional recovery against daily weather bars.
                    </li>
                    <li>
                        <strong>Word Cloud:</strong> Tap any large word (e.g., "Anxiety") to instantly filter your journal for that topic.
                    </li>
                    <li className="bg-white p-2 rounded border border-gray-200">
                        <strong>NEW: Insights History Log</strong><br/>
                        Below the Word Cloud, you will find your <strong>Saved Insights</strong>.
                        <ul className="list-square pl-4 mt-1 text-gray-600">
                            <li>Insights are grouped by <strong>Year &gt; Month &gt; Day</strong>.</li>
                            <li>Tap a date to expand and read the AI's past advice.</li>
                            <li>Your "Suggested Actions" are automatically appended to the bottom of the text so you don't lose context.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </>
);

export default GuideJournal;