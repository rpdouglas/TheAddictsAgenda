import React from 'react';

const GuideWorkbook = () => (
    <>
        <p className="mb-6 text-gray-600">A structured environment to work the Steps, explore Dharma, or build generic coping skills.</p>
        
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-pink-700 mb-2">📚 Available Workbooks</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>The 12 Steps:</strong> Standard AA/NA questions for all 12 steps.</li>
                    <li><strong>Recovery Dharma:</strong> Inquiries into the Four Noble Truths and Eightfold Path.</li>
                    <li><strong>General Recovery:</strong> (New) Universal exercises for understanding addiction, triggers, and relapse prevention.</li>
                </ul>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <h4 className="font-bold text-pink-800 mb-2">🧠 AI Insights & Action Plans</h4>
                <p className="text-sm text-pink-900 mb-2">Just like the Journal, the Workbook can analyze your answers.</p>
                <ol className="list-decimal pl-5 space-y-2 text-pink-800 text-sm">
                    <li>Tap <strong>"Get AI Insights"</strong> at the bottom of the workbook menu.</li>
                    <li>Review the feedback on your themes and progress.</li>
                    <li>Select any <strong>"Suggested Actions"</strong> to add them immediately to your To-Do list.</li>
                </ol>
            </div>
        </div>
    </>
);

export default GuideWorkbook;