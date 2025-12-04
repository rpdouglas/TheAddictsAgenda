import React from 'react';

const GuideSettings = () => (
    <>
        <p className="mb-6 text-gray-600">Manage your data, privacy, and app preferences. Settings are organized into four cards:</p>
        
        <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-teal-700 mb-1">1. Profile & Personalization</h4>
                <p className="text-sm text-gray-600">Update your <strong>Sobriety Date</strong> or change the <strong>Dashboard Header</strong> text (e.g., "Freedom Since").</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-indigo-700 mb-1">2. Privacy & Security</h4>
                <p className="text-sm text-gray-600">Enable <strong>End-to-End Encryption</strong>. You can set a 4-digit PIN that scrambles your local data. <em>Note: If you lose this PIN, your data cannot be recovered.</em></p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-orange-700 mb-1">3. Data Management</h4>
                <p className="text-sm text-gray-600"><strong>Export Data:</strong> Download a JSON backup of your entire history.<br/><strong>Reset App:</strong> Wipe everything and start fresh.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-blue-700 mb-1">4. Demo Mode</h4>
                <p className="text-sm text-gray-600">Select a sample persona (like "Newcomer Ned") to populate the app with test data for demonstration purposes.</p>
            </div>
        </div>
    </>
);

export default GuideSettings;