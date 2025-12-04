import React from 'react';

const GuideDemoProfiles = () => (
    <>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <p className="text-sm text-yellow-800">
                <strong>Pro Tip:</strong> Loading a Demo Profile temporarily switches you to "Guest Mode." Your real account data is safely stored in the cloud. To return to your actual data, simply <strong>Log Out</strong> and sign back in.
            </p>
        </div>

        <div className="space-y-8">
            {/* Newcomer Ned */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">1. Newcomer Ned</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Early Recovery • Cravings • Step 1</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Ned is a 26-year-old sales associate who hit his bottom two weeks ago. He is currently in the "Pink Cloud" phase but is terrified of his financial wreckage.
                </p>
            </div>

            {/* Steady Sarah */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">2. Steady Sarah</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Maintenance • Service • Step 10</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Sarah is a 44-year-old teacher with 3 years of sobriety. Today, she is a pillar of her homegroup. Her struggle is no longer the drink, but <em>Emotional Sobriety</em>.
                </p>
            </div>

            {/* Dharma Dan */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">3. Dharma Dan</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Mindfulness • Meditation • Refuge</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Dan is a 32-year-old former bartender. He struggled with 12-step concepts but found his path in Recovery Dharma. He is retraining as a graphic designer to find "Wise Livelihood."
                </p>
            </div>

            {/* Relapse Ryan */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-teal-700 mb-1">4. Relapse Ryan</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Chronic Relapse • Ambivalence • Struggle</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Backstory:</strong> Ryan is a 55-year-old contractor who has been in and out of recovery for 15 years. He knows the Big Book by heart but struggles to apply it. He battles the "Reservation" that he might one day drink normally.
                </p>
            </div>
        </div>
    </>
);

export default GuideDemoProfiles;