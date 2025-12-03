import React from 'react';

const GuideChallenge = () => (
    <>
        <p className="mb-6">The "90 Meetings in 90 Days" challenge is a cornerstone of early recovery for many. This tool helps you visualize and track that commitment.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Feature Guide</h3>
        <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📊 Tracking Attendance</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Start Today:</strong> When you open the challenge for the first time, it starts tracking from "Day 1".</li>
                    <li><strong>Mark Complete:</strong> Tap any day number in the grid to mark it as "Attended". It will turn green with a checkmark.</li>
                    <li><strong>Catch Up:</strong> You can tap past days if you forgot to log them, but you cannot log future days.</li>
                </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📓 Journal Integration</h4>
                <p className="text-sm text-gray-600 mb-2">Connect your meetings to your reflections.</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li>When you mark a day as attended, the app will ask: <em>"Would you like to journal about this meeting?"</em></li>
                    <li>Tap <strong>"Yes"</strong> to instantly open a new journal entry with a "Meeting Reflection" template pre-loaded for that date.</li>
                </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🔄 Resetting</h4>
                <p className="text-sm text-gray-600">
                    If you experience a recurrence of use or simply want to start a fresh 90-day cycle, tap the <strong>"Reset Challenge"</strong> button at the top right. This will clear your grid and start over from Day 1.
                </p>
            </div>
        </div>
    </>
);

export default GuideChallenge;