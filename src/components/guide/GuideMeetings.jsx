import React from 'react';

const GuideMeetings = () => (
    <>
        <p className="mb-6">Organize your recovery network. Keep track of where you go and who is in your circle.</p>
        <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📝 Meeting Tracker</h4>
                <p className="text-sm text-gray-700">Keep a personal log of every meeting you attend. You can add notes about the topic, chair, or location.</p>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🏠 Homegroup & Members</h4>
                <p className="text-sm text-gray-700 mb-2">
                    Designated your "Homegroup"? Use the <strong>Group Members</strong> feature to keep a private list of phone numbers and names for your support network within that group.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-xs text-yellow-800">
                    <strong>How to set a Homegroup:</strong> Tap the <strong>Star Icon</strong> next to a meeting name in your list. This unlocks the "Homegroup Dashboard" button for that specific meeting.
                </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🔍 External Meeting Finder</h4>
                <p className="text-sm text-gray-700">
                    Need to find a meeting near you? Use the <strong>Meeting Finder</strong> to access official search tools for Alcoholics Anonymous, Narcotics Anonymous, and more directly from the app.
                </p>
            </div>
        </div>
    </>
);

export default GuideMeetings;