import React from 'react';

const GuideWorkbook = () => (
    <>
        <p className="mb-6">A structured environment to work the Steps and explore Recovery Dharma inquiries. Your progress is saved automatically.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Workbook Features</h3>
        <div className="space-y-6">
            
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">✍️ Working the Steps</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li>Select a category: <strong>"12-Step Workbook"</strong>, <strong>"Recovery Dharma"</strong>, or <strong>"General Recovery Exercises"</strong> (for those not following a specific program).</li>
                    <li>Choose a specific Step or Inquiry from the list. Steps with completed questions will have a green checkmark.</li>
                    <li>Tap a section header (e.g., <strong>"Powerlessness"</strong>) to expand it and reveal the questions.</li>
                    <li>Type your answers in the text boxes. You will see a <strong>"Saving..."</strong> indicator that changes to <strong>"Saved"</strong> automatically when you stop typing.</li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📄 Exporting Your Work</h4>
                <p className="text-sm text-gray-600 mb-2">Great for sharing your Step 4 inventory or Step 10 review with a sponsor.</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li>Open any specific Step or Topic you have been working on.</li>
                    <li>Tap the <strong>"Export PDF"</strong> button at the top right.</li>
                    <li>A PDF containing the questions and your specific answers for that topic will download immediately.</li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🧠 Get AI Feedback</h4>
                <p className="text-sm text-gray-600 mb-2">Receive an objective summary of your recovery work.</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li>On the main Workbook screen, tap the pink <strong>"Get AI Insights on Your Work"</strong> button.</li>
                    <li>The AI will review all your saved answers across the entire workbook.</li>
                    <li>It will generate a compassionate report highlighting <strong>Key Themes</strong> in your writing and suggesting <strong>Areas for Growth</strong>.</li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📊 Tracking Progress</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Overall Progress:</strong> A bar at the top of the main screen shows your total completion percentage.</li>
                    <li><strong>Category Progress:</strong> Each category (like "The 12 Steps") has its own progress bar so you can see how far along you are in that specific program.</li>
                </ul>
            </div>

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
    </>
);

export default GuideWorkbook;