// src/data/sampleProfiles.js

// --- 1. UTILITY HELPERS ---

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- 2. FILLER CONTENT POOLS ---
// These are used to generate "maintenance" entries between the major story beats.

const FILLER_CONTENT = {
    NEWCOMER: [
        { text: "Went to the noon meeting. Coffee was terrible but the message was good.", mood: 6, tags: ["Meeting"] },
        { text: "Hard time sleeping last night. Mind won't shut off.", mood: 4, tags: ["Insomnia"] },
        { text: "Read a few pages of the Big Book. Trying to understand the 'allergy' concept.", mood: 5, tags: ["Study"] },
        { text: "Called my sponsor. We talked about football for 20 mins. It helped.", mood: 7, tags: ["Sponsorship", "Connection"] },
        { text: "Feeling a bit restless today. Going for a walk.", mood: 5, tags: ["Coping"] },
        { text: "Saw an old drinking buddy. I ducked into a store to avoid him. Close call.", mood: 4, tags: ["Triggers"] },
        { text: "Woke up grateful not to be hungover.", mood: 8, tags: ["Gratitude"] },
    ],
    SPONSOR: [
        { text: "Routine business meeting. Treasurer's report took forever.", mood: 5, tags: ["Service"] },
        { text: "Talked with a newcomer after the meeting. Reminded me of my early days.", mood: 8, tags: ["Service", "Gratitude"] },
        { text: "Busy day at work. Did a spot-check inventory at lunch to reset.", mood: 6, tags: ["Step 10", "Work"] },
        { text: "Quiet evening with the family. Grateful for this peace.", mood: 9, tags: ["Family"] },
        { text: "Spoke on the phone with Mary (sponsee). She's doing well.", mood: 7, tags: ["Sponsorship"] },
        { text: "Felt a bit resentful in traffic. Prayed for the other driver.", mood: 6, tags: ["Step 10"] },
    ],
    DHARMA: [
        { text: "Morning sit. 20 minutes. Breath was shallow today.", mood: 5, tags: ["Meditation"] },
        { text: "Reading 'Refuge Recovery'. The chapter on compassion is hitting home.", mood: 7, tags: ["Study", "Dharma"] },
        { text: "Noticed judgement arising at the grocery store. I smiled at the cashier instead.", mood: 6, tags: ["Wise Action"] },
        { text: "Sangha friends came over for tea. Good connection.", mood: 8, tags: ["Sangha"] },
        { text: "Practiced walking meditation on the way to work.", mood: 6, tags: ["Mindfulness"] },
        { text: "Struggling with self-doubt. Taking refuge in the Buddha.", mood: 4, tags: ["Refuge"] },
    ],
    RELAPSE: [
        { text: "Bored. Nothing on TV. Thinking about the old days.", mood: 4, tags: ["Boredom"] },
        { text: "Went to a meeting. Didn't share. Just listened.", mood: 5, tags: ["Meeting"] },
        { text: "Arguments at home. I just want some peace and quiet.", mood: 3, tags: ["Stress", "Family"] },
        { text: "Thinking about calling my sponsor but I don't want to bother him.", mood: 4, tags: ["Hesitation"] },
        { text: "Good day at work. Kept my head down.", mood: 6, tags: ["Work"] },
        { text: "Feeling like I'm missing out on the fun my friends are having.", mood: 3, tags: ["FOMO"] },
        { text: "I can do this. I just need to stick to the plan.", mood: 7, tags: ["Hope"] },
    ]
};

// --- 3. GENERATOR ENGINE ---

const createJournal = (beats, type, daysBack = 180) => {
    const journal = [];
    const beatMap = {};
    
    // Map hardcoded beats to their specific "daysAgo" index for easy lookup
    beats.forEach(beat => {
        // We assume 'timestamp' in beats is generated via daysAgo(n)
        // We simply push them to the array directly
        journal.push(beat);
        // Mark this day as "occupied" so we don't overwrite it
        const dateStr = beat.timestamp.split('T')[0];
        beatMap[dateStr] = true;
    });

    // Fill gaps
    for (let i = 0; i <= daysBack; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];

        // If no story beat exists for this day...
        if (!beatMap[dateKey]) {
            // 45% chance to add a filler entry (approx 3-4 days a week)
            if (Math.random() > 0.55) {
                const template = getRandom(FILLER_CONTENT[type]);
                journal.push({
                    id: generateId(),
                    timestamp: d.toISOString(),
                    mood: template.mood + Math.floor(Math.random() * 2) - 1, // Add slight variance
                    tags: template.tags,
                    text: template.text
                });
            }
        }
    }

    // Sort by date descending
    return journal.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};


// ========================================================================
// 4. PROFILE DEFINITIONS
// ========================================================================

const nedBeats = [
    { id: generateId(), timestamp: daysAgo(0), mood: 8, tags: ['Milestone', 'Gratitude'], text: "90 Days today! Picked up my keytag. The meeting stood up and clapped. I actually feel like I belong here. My sponsor told me 'Now the real work begins'." },
    { id: generateId(), timestamp: daysAgo(2), mood: 5, tags: ['Anxiety', 'Work'], text: "Hit a wall at work. Old thoughts came back: 'A drink would make this brainstorming session easier.' I played the tape through. I know I wouldn't stop at one." },
    { id: generateId(), timestamp: daysAgo(10), mood: 7, tags: ['Step 3', 'Relief'], text: "Did my Step 3 with Mike today. We stood in the church courtyard. Turning my will over is scary, but trying to run the show myself got me arrested. I'm willing to try His way." },
    { id: generateId(), timestamp: daysAgo(35), mood: 4, tags: ['PAWS', 'Brain Fog'], text: "Can't concentrate. Forget where I put my keys. Mike says it's Post-Acute Withdrawal. Just have to ride it out. Drank 4 seltzers to settle my stomach." },
    { id: generateId(), timestamp: daysAgo(45), mood: 9, tags: ['Pink Cloud'], text: "Life is amazing! I have money in my wallet, my mom answered my call, and I woke up before my alarm. Recovery is easy!" },
    { id: generateId(), timestamp: daysAgo(60), mood: 6, tags: ['Meeting', 'Service'], text: "Started making coffee for the Tues night group. It forces me to show up early and talk to people. I hate small talk but I need to get out of my head." },
    { id: generateId(), timestamp: daysAgo(85), mood: 3, tags: ['Cravings', 'Fear'], text: "Friday night. Everyone is at the bar. I'm sitting in my car eating fast food. I feel lonely and boring. But I didn't drink." },
    { id: generateId(), timestamp: daysAgo(90), mood: 2, tags: ['Day 1', 'Despair'], text: "Day 1. Again. Hands shaking. I can't keep doing this. I surrender. I'm going to a meeting and I'm going to raise my hand." }
];

const sarahBeats = [
    { id: generateId(), timestamp: daysAgo(0), mood: 9, tags: ['Service', 'Gratitude'], text: "Chaired the business meeting tonight. It got heated about the coffee budget, but I kept my mouth shut and practiced Tradition 2. A loving God acts through the group conscience, not through Sarah's opinion." },
    { id: generateId(), timestamp: daysAgo(14), mood: 6, tags: ['Sponsee', 'Patience'], text: "My sponsee Lisa relapsed. I feel frustrated, but I know I'm powerless over her addiction too. I told her I love her and the door is open when she's ready. Hard lesson." },
    { id: generateId(), timestamp: daysAgo(45), mood: 8, tags: ['Step 12', 'H&I'], text: "Spoke at the detox center. The look in their eyes—hopelessness. I remember that feeling. It keeps me grateful for my daily reprieve." },
    { id: generateId(), timestamp: daysAgo(100), mood: 5, tags: ['Step 10', 'Inventory'], text: "Fought with my husband. I was resentful that he didn't do the dishes. Realized I was 'Hungry and Tired'. I made a quick amends. I don't have to carry that anger to bed." },
    { id: generateId(), timestamp: daysAgo(180), mood: 10, tags: ['Anniversary'], text: "3 Years! Impossible. I used to not be able to go 3 hours. God is doing for me what I could not do for myself." },
];

const danBeats = [
    { id: generateId(), timestamp: daysAgo(1), mood: 8, tags: ['Sangha', 'Connection'], text: "The Refuge Recovery meeting was powerful. We talked about 'Wise Friends'. I realized I need to distance myself from my old drinking buddies to protect my energy." },
    { id: generateId(), timestamp: daysAgo(5), mood: 6, tags: ['Mindfulness', 'Work'], text: "Stressful deadline. I noticed my shoulders tensing and my breath getting shallow. I took a 'Sacred Pause'. Didn't react. Responded." },
    { id: generateId(), timestamp: daysAgo(20), mood: 7, tags: ['Metta', 'Self-Compassion'], text: "Practicing loving-kindness for myself is harder than for others. 'May I be safe, May I be happy'. Repeated it for 20 mins." },
    { id: generateId(), timestamp: daysAgo(60), mood: 4, tags: ['Doubt', 'Craving'], text: "Bad craving for opiates today. Physical pain in my back triggered it. I sat with the sensation. 'This too shall pass'. It's just a sensation, not a command." },
    { id: generateId(), timestamp: daysAgo(150), mood: 9, tags: ['Retreat', 'Breakthrough'], text: "First silent retreat weekend. My mind was so loud the first day. By Sunday, the silence was beautiful. I saw clearly how my attachment to comfort causes my suffering." }
];

const ryanBeats = [
    { id: generateId(), timestamp: daysAgo(0), mood: 2, tags: ['Shame', 'Day 3'], text: "Head still hurts. The shame is heavier than the hangover. I had 60 days. Why did I throw it away for a beer? I feel like I'm letting everyone down." },
    { id: generateId(), timestamp: daysAgo(3), mood: 1, tags: ['Relapse', 'Bender'], text: "I blew it. It started on Friday. 'Just one' turned into a blackout. Woke up in my truck. God help me." },
    { id: generateId(), timestamp: daysAgo(30), mood: 5, tags: ['Complacency', 'Secrets'], text: "Haven't called my sponsor in two weeks. He's annoying me. I'm fine. I've got this. Work is busy anyway." },
    { id: generateId(), timestamp: daysAgo(40), mood: 6, tags: ['Resentment'], text: "My wife is still checking my bank account. Does she not trust me? I have 50 days! Back off." },
    { id: generateId(), timestamp: daysAgo(63), mood: 8, tags: ['Milestone', 'Chip'], text: "Got my 60 Day chip! Finally. I feel great. Maybe this time it sticks." },
    { id: generateId(), timestamp: daysAgo(120), mood: 3, tags: ['Day 1', 'Again'], text: "Here we go again. Day 1. I promised myself I wouldn't do this. I'm so tired of the cycle." },
    { id: generateId(), timestamp: daysAgo(180), mood: 7, tags: ['Hope'], text: "Back in the rooms. The coffee tastes terrible but the people are nice. I want what they have." }
];


export const SAMPLE_PROFILES = {
    NEWCOMER: {
        name: "Newcomer Ned",
        avatar: "/images/profiles/ned_avatar.jpg",
        imageFull: "/images/profiles/ned_full.jpg",
        imageIcon: "/images/profiles/ned_icon.jpg",
        description: "90 Days Sober. Moving from the 'Pink Cloud' into real Step work.",
        data: {
            'recovery_sobriety_date': daysAgo(90),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'One Day at a Time',
            'recovery_journal_entries': createJournal(nedBeats, 'NEWCOMER', 90),
            'recovery_workbook_responses': {
                'identifying-triggers': "1. Payday (money in pocket)\n2. Arguing with my ex\n3. Being alone on Friday nights\n4. The smell of tequila.",
                'coping-strategies': "1. Call Mike immediately.\n2. Go to the gym.\n3. Eat ice cream (sugar craving).\n4. 'Halting' - check if I'm Hungry, Angry, Lonely, or Tired.",
                'step-1-sec_a-1': "Powerlessness is physical. Once alcohol hits my system, the phenomenon of craving kicks in and I cannot stop.",
                'step-1-sec_a-2': "Last Christmas. I promised to have two glasses of wine. I woke up in a hotel room in a different city.",
                'step-1-sec_b-1': "Finances: Bankruptcy in 2022.\nRelationships: Divorced.\nLegal: DUI pending.",
                'step-1-sec_c-1': "I am willing to do whatever it takes. I've stopped fighting.",
                'step-2-sec_a-1': "Sanity is truth. Insanity is believing my own lies ('I can handle it this time').",
                'step-2-sec_b-1': "I struggle with the 'God' word. But I believe the Group is a power greater than me. They are sober, I am not.",
                'step-3-sec_a-3': "I decided to turn my will and life over to the care of God as I understood Him. I said the prayer with my sponsor."
            },
            'recovery_user_meetings': [
                { id: generateId(), name: 'Early Risers', day: 'Monday', time: '07:00', address: 'Community Center', isHomegroup: true },
                { id: generateId(), name: 'Big Book Study', day: 'Wednesday', time: '19:00', address: 'St. Mary\'s', isHomegroup: false },
                { id: generateId(), name: 'Young Peoples AA', day: 'Friday', time: '22:00', address: 'Diner Backroom', isHomegroup: false }
            ],
            'recovery_goals': [
                { id: generateId(), text: '90 Meetings in 90 Days', completed: true, createdAt: daysAgo(90) },
                { id: generateId(), text: 'Get a Sponsor', completed: true, createdAt: daysAgo(88) },
                { id: generateId(), text: 'Write Step 4 Inventory', completed: false, createdAt: daysAgo(5) },
                { id: generateId(), text: 'Pay off parking tickets', completed: false, createdAt: daysAgo(30) }
            ]
        }
    },

    SPONSOR: {
        name: "Steady Sarah",
        avatar: "/images/profiles/sarah_avatar.jpg",
        imageFull: "/images/profiles/sarah_full.jpg",
        imageIcon: "/images/profiles/sarah_icon.jpg",
        description: "3 Years Sober. Deep Step work, sponsorship, and emotional maintenance.",
        data: {
            'recovery_sobriety_date': daysAgo(3 * 365),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Miracles Happen',
            'recovery_journal_entries': createJournal(sarahBeats, 'SPONSOR', 180), // 6 months history
            'recovery_workbook_responses': {
                'step-4-sec_b-6': "Resentment: Mom. Cause: She criticized my parenting. Affects: Self-esteem, Security. My Part: I seek her approval constantly and get angry when I don't get it. I am sensitive.",
                'step-4-sec_c-11': "Assets: I am loyal, hardworking, and empathetic.",
                'step-8-sec_a-1': "Person: My ex-husband. Harm: Financial dishonesty, emotional neglect. Willingness: Yes.",
                'step-9-sec_a-3': "I will not make excuses. I will ask 'How can I set this right?' I will pay back the $2000.",
                'step-10-sec_a-2': "Daily Review: 1. Was I kind? 2. Was I honest? 3. Was I thinking of myself or others?",
                'step-11-sec_a-2': "Morning prayer: 'Thy will be done.' Evening meditation: Review the day without judgment.",
                'smart_balance': "Work: 9/10\nLove: 8/10\nPlay: 4/10 (Need to have more fun!)"
            },
            'recovery_user_meetings': [
                { id: generateId(), name: 'Womens Serenity', day: 'Wednesday', time: '18:30', address: 'Zoom', isHomegroup: false },
                { id: generateId(), name: 'Sunday Spiritual', day: 'Sunday', time: '10:00', address: 'The Club', isHomegroup: true }
            ],
            'recovery_homegroup_members': [
                { id: generateId(), name: 'Dave (GSR)', phone: '555-0101', position: 'GSR', email: 'dave@aa.org' },
                { id: generateId(), name: 'Susan (Treas)', phone: '555-0102', position: 'Treasurer', email: '' },
                { id: generateId(), name: 'Lisa (Sponsee)', phone: '555-0103', position: 'Group Member', email: '' }
            ],
            'recovery_homegroup_tracker': {
                [daysAgo(0).split('T')[0]]: { chairperson: 'Sarah', attendance: 24, tradition: 15.50, notes: 'Business meeting next week.' },
                [daysAgo(7).split('T')[0]]: { chairperson: 'Bill', attendance: 30, tradition: 22.00, notes: '' },
                [daysAgo(14).split('T')[0]]: { chairperson: 'Sarah', attendance: 28, tradition: 18.00, notes: 'Lisa celebrated 6 months.' }
            }
        }
    },

    DHARMA: {
        name: "Dharma Dan",
        avatar: "/images/profiles/dan_avatar.jpg",
        imageFull: "/images/profiles/dan_full.jpg",
        imageIcon: "/images/profiles/dan_icon.jpg",
        description: "6 Months Sober. Using Buddhist principles and meditation.",
        data: {
            'recovery_sobriety_date': daysAgo(180),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Walking the Path',
            'recovery_journal_entries': createJournal(danBeats, 'DHARMA', 180),
            'recovery_workbook_responses': {
                'rd-truth-1-sec_a-1': "Addiction is suffering. It is the hungry ghost—big belly, tiny throat. Never satisfied.",
                'rd-truth-2-sec_a-1': "The cause is craving. I crave to feel different. I crave oblivion.",
                'rd-truth-3-sec_a-1': "Recovery is possible. I have seen others walk the path.",
                'rd-path-1': "Wise Understanding means knowing that my actions have consequences (Karma). If I use, I suffer.",
                'rd-path-3': "Wise Speech: I used to lie to cover my tracks. Now I practice radical honesty. I avoid gossip.",
                'rd-path-4': "Wise Action: I will not steal, I will not harm, I will not intoxicate myself.",
                'rd-path-5': "Wise Livelihood: Bartending was toxic for me. Graphic design allows me to be helpful without being surrounded by alcohol.",
                'rd-path-7': "Mindfulness helps me pause between the trigger and the reaction. That pause is where my recovery lives.",
                'rd-tools-meditation': "Meditation trains my mind to stay. Addiction trained it to run. I start with breath awareness."
            },
            'recovery_user_meetings': [
                { id: generateId(), name: 'Dharma Recovery NYC', day: 'Tuesday', time: '19:00', address: 'Online', isHomegroup: true },
                { id: generateId(), name: 'Sunday Sit', day: 'Sunday', time: '09:00', address: 'Meditation Center', isHomegroup: false }
            ],
            'recovery_goals': [
                { id: generateId(), text: 'Sit for 20 mins daily', completed: true, createdAt: daysAgo(180) },
                { id: generateId(), text: 'Read "Refuge Recovery"', completed: true, createdAt: daysAgo(90) },
                { id: generateId(), text: 'Find a mentor', completed: false, createdAt: daysAgo(30) }
            ]
        }
    },

    RELAPSE: {
        name: "Relapse Ryan",
        avatar: "/images/profiles/ryan_avatar.jpg",
        imageFull: "/images/profiles/ryan_full.jpg",
        imageIcon: "/images/profiles/ryan_icon.jpg",
        description: "3 Days Sober (Again). A history of 6 months of struggle.",
        data: {
            'recovery_sobriety_date': daysAgo(3),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Starting Over',
            'recovery_journal_entries': createJournal(ryanBeats, 'RELAPSE', 180),
            'recovery_workbook_responses': {
                'identifying-triggers': "1. Boredom (HUGE trigger)\n2. Hanging out with the guys at the bowling alley\n3. Thinking I can be a 'gentleman drinker'.",
                'relapse-prevention': "I know I should call someone. I know I should play the tape through. But when the urge hits, I forget everything.",
                'step-1-sec_a-1': "I know I'm powerless *after* the first drink. My problem is I still think I have power *before* the first drink.",
                'step-1-sec_a-3': "I lie to myself that 'this time will be different' or 'I'll just stick to beer'. That reservation kills me every time.",
                'smart_cba': "PROS of using: Instant relief, social lubricant, forget my problems.\nCONS of using: Money, wife is angry, hangover, guilt.\n\n(Honesty: The PROS still feel stronger than the CONS right now)."
            },
            'recovery_user_meetings': [
                { id: generateId(), name: 'Last Chance Group', day: 'Friday', time: '22:00', address: 'Salvation Army', isHomegroup: false },
                { id: generateId(), name: 'Sunday Morning Speaker', day: 'Sunday', time: '11:00', address: 'Main St', isHomegroup: true }
            ],
            'recovery_goals': [
                { id: generateId(), text: 'Get a new sponsor', completed: false, createdAt: daysAgo(2) },
                { id: generateId(), text: 'Don\'t drink today', completed: true, createdAt: daysAgo(0) },
                { id: generateId(), text: 'Delete dealer number', completed: true, createdAt: daysAgo(180) }
            ]
        }
    }
};