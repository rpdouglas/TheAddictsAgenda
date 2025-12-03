import React from 'react';

const GuideSettings = () => (
    <>
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
    </>
);

export default GuideSettings;