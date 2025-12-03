import React from 'react';

const GuideDashboard = () => (
    <>
        <p className="mb-6">The Dashboard is your home base. It provides an at-a-glance view of your progress and quick access to all recovery tools.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Dashboard Features</h3>
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">⏱️ The Sobriety Counter</h4>
                <p className="text-sm text-gray-600 mb-2">Tracks your clean time down to the second.</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Real-Time Updates:</strong> Watch the seconds tick by as a reminder of your accumulating success.</li>
                    <li><strong>Milestones:</strong> The counter breaks down your time into Days, Hours, Minutes, and Seconds.</li>
                    <li><strong>Resetting/Editing:</strong> Need to change your start date? Tap the <strong>Settings Icon (Gear)</strong> in the top right corner of the screen.</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📅 Daily Accountability</h4>
                <p className="text-sm text-gray-600 mb-2">Stay consistent with visual cues.</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li>Look at the <strong>Journal</strong> button in the grid.</li>
                    <li><strong>Red Exclamation Mark (<span className="text-red-500 font-bold">!</span>):</strong> This badge appears if you haven't made a journal entry today. It's a gentle nudge to check in with yourself.</li>
                    <li><strong>Clear the Alert:</strong> Simply tap the Journal button and write an entry (even a short one!) to remove the badge.</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📲 Install for Offline Use</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li>If you are on a mobile device or compatible browser, you may see a teal button labeled <strong>"Install App to Home Screen"</strong>.</li>
                    <li>Tap it to install the Toolkit as an app on your device.</li>
                    <li><strong>Benefits:</strong> This allows you to use the app <strong>offline</strong> (no internet required) and gives you more screen space.</li>
                </ol>
            </div>
        </div>
    </>
);

export default GuideDashboard;