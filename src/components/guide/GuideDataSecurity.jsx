import React from 'react';

const GuideDataSecurity = () => (
    <div className="space-y-6">
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Where is my data stored?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
                My Recovery Toolkit follows a <strong>"Local-First"</strong> architecture. This means your journal entries, workbook answers, and sobriety statistics are stored directly on your device (in your browser's LocalStorage or IndexedDB). 
                <br/><br/>
                By default, <strong>your data does not leave your phone/computer</strong>. We do not have a central server that reads your personal thoughts.
            </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-2">How does Encryption work?</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                If you enable <strong>End-to-End Encryption</strong> in Settings, we use the AES-256 standard (Advanced Encryption Standard) to scramble your data.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li><strong>Your PIN is the Key:</strong> When you set a PIN, it acts as the mathematical key to lock your data.</li>
                <li><strong>Zero-Knowledge:</strong> We do not store your PIN. If you forget it, <strong>we cannot recover your data for you</strong>. This ensures that no one—not even the app developers—can access your recovery work without your permission.</li>
            </ul>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-2">AI Processing</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
                When you use features like "AI Insights" or the "Journal Helper," specific text is sent securely to Google Gemini AI for processing. 
                <br/>
                <strong>Privacy Note:</strong> This data is stateless—it is sent for analysis and the result is returned. It is not used to train public AI models in a way that links back to your identity.
            </p>
        </div>
    </div>
);

export default GuideDataSecurity;