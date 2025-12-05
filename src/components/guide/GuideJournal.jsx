// src/components/guide/GuideJournal.jsx
import React from 'react';

const GuideJournal = () => (
    <>
        <p className="mb-6 text-gray-600">The Daily Journal is your safe space for honest reflection. It combines traditional journaling with AI-powered insights to help you spot patterns.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Feature Walkthroughs</h3>

        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-blue-700 mb-2">📝 Smart Journaling</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Mood Check:</strong> Slide the Mood Slider (1-10) to record how you feel right now.</li>
                    <li><strong>Weather Context:</strong> The app automatically fetches your local weather (e.g., "Rainy, 12°C") to help track environmental triggers. You can also edit this manually.</li>
                    <li><strong>Templates:</strong> Use the dropdown to select prompts like <em>"3-Part Gratitude"</em> or <em>"Resentment Filter"</em> to guide your writing.</li>
                    <li><strong>Tags:</strong> Add context (e.g., "Anxiety", "Meeting") to filter your entries later.</li>
                </ol>
            </div>

            {/* NEW SECTION: AI Action Plans */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">✨ AI Action Plans</h4>
                <p className="text-sm text-blue-900 mb-3">Turn your insights into action.</p>
                <ol className="list-decimal pl-5 space-y-2 text-blue-800 text-sm">
                    <li>Tap the <strong>Sparkles Icon</strong> to analyze your recent entries.</li>
                    <li>The AI will provide a summary and a list of <strong>"Suggested Actions"</strong> (e.g., "Call your sponsor", "Meditate").</li>
                    <li><strong>Select & Save:</strong> Check the boxes next to the actions you want to take.</li>
                    <li>Tap <strong>"Save Action Plan"</strong>. This does two things:
                        <ul className="list-disc pl-4 mt-1">
                            <li>Creates a new Journal Entry listing your plan.</li>
                            <li><strong>Automatically adds these items to your To-Do List.</strong></li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-blue-700 mb-2">📊 Insights Tab</h4>
                <p className="text-sm text-gray-700 mb-2">Switch to the "Insights" tab to see visualizations of your recovery data:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Mood vs. Weather Graph:</strong> A dual-axis chart showing your emotional trendline (Blue) against the daily temperature (Gray Bars). See if the weather affects your recovery.</li>
                    <li><strong>Word Cloud:</strong> A visual cluster of your most used words. Tap any word (e.g., "Anxiety" or "Hope") to instantly filter your history and read those specific entries.</li>
                </ul>
            </div>
        </div>
    </>
);

export default GuideJournal;