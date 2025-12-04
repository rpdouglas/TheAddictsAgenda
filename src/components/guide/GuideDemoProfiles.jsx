import React from 'react';

const GuideDemoProfiles = () => (
    <>
        <p className="mb-6">
            To help you explore the app's features, we have included four "Demo Profiles." 
            You can load these from <strong>Settings &gt: Demo Mode</strong> to see what a fully populated account looks like.
        </p>

        <div className="space-y-8">
            {/* Newcomer Ned */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">1. Newcomer Ned</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Early Recovery • Cravings • Step 1</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Ned is a 26-year-old sales associate who hit his bottom two weeks ago after a three-day bender cost him his girlfriend and nearly his job. He is currently in the "Pink Cloud" phase but is terrified of his financial wreckage and social anxiety.
                </p>
                <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs font-bold text-gray-600 mb-1">What to look for:</p>
                    <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                        <li><strong>Journal:</strong> Reactive entries about cravings and small wins (e.g., driving past the liquor store).</li>
                        <li><strong>Tools:</strong> Frequent use of the <em>Breathing Exercise</em> to manage panic.</li>
                        <li><strong>Workbook:</strong> Honest but raw answers in Step 1 regarding powerlessness.</li>
                    </ul>
                </div>
            </div>

            {/* Steady Sarah */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">2. Steady Sarah</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Maintenance • Service • Step 10</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Sarah is a 44-year-old teacher with 3 years of sobriety. She was a "functional" alcoholic who drank to manage control issues and perfectionism. Today, she is a pillar of her homegroup and sponsors others. Her struggle is no longer the drink, but <em>Emotional Sobriety</em>.
                </p>
                <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs font-bold text-gray-600 mb-1">What to look for:</p>
                    <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                        <li><strong>Meeting Tracker:</strong> Detailed logs of her homegroup's attendance and treasury.</li>
                        <li><strong>Journal:</strong> Entries focus on gratitude and analyzing her daily interactions for selfishness (Step 10).</li>
                        <li><strong>Workbook:</strong> Deep, thoughtful answers in Steps 10, 11, and 12.</li>
                    </ul>
                </div>
            </div>

            {/* Dharma Dan */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">3. Dharma Dan</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Mindfulness • Meditation • Refuge</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Dan is a 32-year-old former bartender. He struggled with the "Higher Power" concept in 12-step programs but found his path in Recovery Dharma 6 months ago. He is retraining as a graphic designer to find "Wise Livelihood."
                </p>
                <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs font-bold text-gray-600 mb-1">What to look for:</p>
                    <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                        <li><strong>Journal:</strong> Reflections on "Impermanence," "Metta" (Loving-Kindness), and "Wise Speech."</li>
                        <li><strong>Literature:</strong> Active use of the <em>Recovery Dharma</em> book reader.</li>
                        <li><strong>Tags:</strong> Uses specific tags like <code>#Sangha</code> and <code>#Craving</code>.</li>
                    </ul>
                </div>
            </div>

            {/* Relapse Ryan */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">4. Relapse Ryan</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Chronic Relapse • Ambivalence • Struggle</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Ryan is a 55-year-old contractor who has been in and out of recovery for 15 years. He knows the Big Book by heart but struggles to apply it. He battles the "Reservation"—the secret belief that he might one day drink normally. He is currently on Day 3.
                </p>
                <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-xs font-bold text-gray-600 mb-1">What to look for:</p>
                    <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                        <li><strong>Journal:</strong> A painful cycle of hope ("Got my 30-day chip") followed by triggers and a return to Day 1.</li>
                        <li><strong>Workbook:</strong> Step 1 answers that admit consequences but show hesitation about total powerlessness.</li>
                        <li><strong>Simulator:</strong> Plays the <em>Recovery Simulator</em> game often to "win" at recovery safely.</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
);

export default GuideDemoProfiles;