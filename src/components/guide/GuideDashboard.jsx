import React from 'react';

const GuideDashboard = () => (
    <>
        <p className="mb-6 text-gray-600">The Dashboard is your home base. It provides an at-a-glance view of your progress and quick access to all recovery tools.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Dashboard Features</h3>
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-teal-700 mb-2">⏱️ The Sobriety Counter</h4>
                <p className="text-sm text-gray-600 mb-2">Tracks your clean time down to the second.</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Real-Time Updates:</strong> Watch the seconds tick by as a reminder of your accumulating success.</li>
                    <li><strong>Milestones:</strong> The counter breaks down your time into Days, Hours, Minutes, and Seconds.</li>
                    <li><strong>Resetting/Editing:</strong> Need to change your start date? Tap the <strong>Settings Icon (Gear)</strong> in the top right corner.</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-teal-700 mb-2">📅 Daily Accountability</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Red Exclamation Mark (<span className="text-red-500 font-bold">!</span>):</strong> This badge on the Journal button means you haven't checked in today.</li>
                    <li><strong>Clear the Alert:</strong> Simply write an entry (even a short one!) to remove the badge.</li>
                </ul>
            </div>
        </div>
    </>
);

export default GuideDashboard;