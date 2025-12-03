import React from 'react';

const GuideCoping = () => (
    <>
        <p className="mb-6">A suite of interactive tools designed to help you manage cravings, anxiety, and high-stress moments immediately.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">Tool Walkthroughs</h3>
        <div className="space-y-6">
            
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🛡️ Coping Cards</h4>
                <p className="text-sm text-gray-600 mb-2">Quick, bite-sized strategies for when you need an immediate shift in perspective.</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Shuffle:</strong> Tap <strong>"Get New Card"</strong> to draw a random strategy from categories like <em>Grounding</em>, <em>Action</em>, or <em>Connection</em>.</li>
                    <li><strong>Apply:</strong> Read the card's instruction (e.g., "5-4-3-2-1 Grounding") and try to perform the action immediately.</li>
                    <li><strong>Reflect:</strong> If a strategy works for you, tap <strong>"Journal on This"</strong>. This opens a new journal entry pre-filled with the card's details so you can record your victory.</li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🌬️ Breathing Room</h4>
                <p className="text-sm text-gray-600 mb-2">Regulate your nervous system with guided visual breathing.</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Choose Pattern:</strong> Select <strong>"Box Breathing"</strong> (4-4-4-4) for focus or <strong>"4-7-8"</strong> for deep relaxation.</li>
                    <li><strong>Start:</strong> Tap the "Start" button.</li>
                    <li><strong>Follow Along:</strong> Inhale as the circle expands, hold when it pauses, and exhale as it shrinks.</li>
                    <li><strong>Haptic Cues:</strong> If you are on a mobile device, the phone will vibrate gently when it's time to switch phases, allowing you to close your eyes.</li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🎮 Recovery Arcade</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Recovery Jeopardy:</strong> Test your knowledge of 12-Step history, slogans, and literature in a trivia format. Great for a group or solo distraction.</li>
                    <li><strong>Recovery Simulator:</strong> A resource management game where you must balance <strong>Money, Stress, and Wellbeing</strong> while navigating early recovery challenges. Make healthy choices to keep your serenity meter high!</li>
                </ul>
            </div>
        </div>
    </>
);

export default GuideCoping;