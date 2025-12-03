import React from 'react';

const GuideJournal = () => (
    <>
        <p className="mb-6">The Daily Journal is your safe space for honest reflection. It combines traditional journaling with AI-powered insights to help you spot patterns in your recovery.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Feature Walkthroughs</h3>

        <div className="space-y-6">
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

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📈 Viewing Your Mood Graph</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li>On the main Journal list, tap the white button with the <span className="inline-block bg-white border rounded px-1">Graph Icon</span>.</li>
                    <li>You will see a line chart of your mood ratings (1-10) over time.</li>
                    <li>Tap any dot on the line to see the specific date and score for that entry.</li>
                    <li><em>Note: You need at least 2 entries with mood ratings for the graph to appear.</em></li>
                </ol>
            </div>

             <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">💡 Using the AI Writing Helper</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li>If you are staring at a blank page, tap <strong>"Get Idea with AI"</strong> below the text box.</li>
                    <li>A helper will appear asking how you feel or what you want to focus on.</li>
                    <li>Type a brief thought (e.g., "I'm feeling restless") and the AI will generate a specific writing prompt to get you started.</li>
                </ol>
            </div>
        </div>
    </>
);

export default GuideJournal;