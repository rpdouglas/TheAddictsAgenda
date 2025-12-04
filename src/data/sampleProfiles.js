// src/data/sampleProfiles.js

// Helper to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

// --- Dynamic Date Helpers ---
const now = new Date();
const daysAgo = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d.toISOString();
};

export const SAMPLE_PROFILES = {
    // ========================================================================
    // PROFILE 1: NEWCOMER NED (90 Days - The Foundation)
    // ========================================================================
    NEWCOMER: {
        name: "Newcomer Ned",
        description: "90 Days Sober. Moving from the 'Pink Cloud' into real Step work.",
        data: {
            'recovery_sobriety_date': daysAgo(90),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'One Day at a Time',
            
            // --- JOURNAL: 3 Months of ups and downs ---
            'recovery_journal_entries': [
                // Recent
                { id: generateId(), timestamp: daysAgo(0), mood: 8, tags: ['Milestone', 'Gratitude'], text: "90 Days today! Picked up my keytag. The meeting stood up and clapped. I actually feel like I belong here. My sponsor told me 'Now the real work begins'." },
                { id: generateId(), timestamp: daysAgo(2), mood: 5, tags: ['Anxiety', 'Work'], text: "Hit a wall at work. Old thoughts came back: 'A drink would make this brainstorming session easier.' I played the tape through. I know I wouldn't stop at one." },
                { id: generateId(), timestamp: daysAgo(10), mood: 7, tags: ['Step 3', 'Relief'], text: "Did my Step 3 with Mike today. We stood in the church courtyard. Turning my will over is scary, but trying to run the show myself got me arrested. I'm willing to try His way." },
                // 1 Month Ago
                { id: generateId(), timestamp: daysAgo(35), mood: 4, tags: ['PAWS', 'Brain Fog'], text: "Can't concentrate. Forget where I put my keys. Mike says it's Post-Acute Withdrawal. Just have to ride it out. Drank 4 seltzers to settle my stomach." },
                { id: generateId(), timestamp: daysAgo(45), mood: 9, tags: ['Pink Cloud'], text: "Life is amazing! I have money in my wallet, my mom answered my call, and I woke up before my alarm. Recovery is easy!" },
                // 2 Months Ago
                { id: generateId(), timestamp: daysAgo(60), mood: 6, tags: ['Meeting', 'Service'], text: "Started making coffee for the Tues night group. It forces me to show up early and talk to people. I hate small talk but I need to get out of my head." },
                // 3 Months Ago (Early days)
                { id: generateId(), timestamp: daysAgo(85), mood: 3, tags: ['Cravings', 'Fear'], text: "Friday night. Everyone is at the bar. I'm sitting in my car eating fast food. I feel lonely and boring. But I didn't drink." },
                { id: generateId(), timestamp: daysAgo(89), mood: 2, tags: ['Day 1', 'Despair'], text: "Day 1. Again. Hands shaking. I can't keep doing this. I surrender. I'm going to a meeting and I'm going to raise my hand." }
            ],

            // --- WORKBOOK: Steps 1, 2, 3 ---
            'recovery_workbook_responses': {
                // General
                'identifying-triggers': "1. Payday (money in pocket)\n2. Arguing with my ex\n3. Being alone on Friday nights\n4. The smell of tequila.",
                'coping-strategies': "1. Call Mike immediately.\n2. Go to the gym.\n3. Eat ice cream (sugar craving).\n4. 'Halting' - check if I'm Hungry, Angry, Lonely, or Tired.",
                // Step 1
                'step-1-sec_a-1': "Powerlessness is physical. Once alcohol hits my system, the phenomenon of craving kicks in and I cannot stop.",
                'step-1-sec_a-2': "Last Christmas. I promised to have two glasses of wine. I woke up in a hotel room in a different city.",
                'step-1-sec_b-1': "Finances: Bankruptcy in 2022.\nRelationships: Divorced.\nLegal: DUI pending.",
                'step-1-sec_c-1': "I am willing to do whatever it takes. I've stopped fighting.",
                // Step 2
                'step-2-sec_a-1': "Sanity is truth. Insanity is believing my own lies ('I can handle it this time').",
                'step-2-sec_b-1': "I struggle with the 'God' word. But I believe the Group is a power greater than me. They are sober, I am not.",
                // Step 3
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

    // ========================================================================
    // PROFILE 2: STEADY SARAH (3 Years - Maintenance & Service)
    // ========================================================================
    SPONSOR: {
        name: "Steady Sarah",
        description: "3 Years Sober. Deep Step work, sponsorship, and emotional maintenance.",
        data: {
            'recovery_sobriety_date': daysAgo(3 * 365), // 3 years ago
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Miracles Happen',
            
            // --- JOURNAL: 6 Months of Maintenance ---
            'recovery_journal_entries': [
                { id: generateId(), timestamp: daysAgo(0), mood: 9, tags: ['Service', 'Gratitude'], text: "Chaired the business meeting tonight. It got heated about the coffee budget, but I kept my mouth shut and practiced Tradition 2. A loving God acts through the group conscience, not through Sarah's opinion." },
                { id: generateId(), timestamp: daysAgo(14), mood: 6, tags: ['Sponsee', 'Patience'], text: "My sponsee Lisa relapsed. I feel frustrated, but I know I'm powerless over her addiction too. I told her I love her and the door is open when she's ready. Hard lesson." },
                { id: generateId(), timestamp: daysAgo(45), mood: 8, tags: ['Step 12', 'H&I'], text: "Spoke at the detox center. The look in their eyes—hopelessness. I remember that feeling. It keeps me grateful for my daily reprieve." },
                { id: generateId(), timestamp: daysAgo(100), mood: 5, tags: ['Step 10', 'Inventory'], text: "Fought with my husband. I was resentful that he didn't do the dishes. Realized I was 'Hungry and Tired'. I made a quick amends. I don't have to carry that anger to bed." },
                { id: generateId(), timestamp: daysAgo(180), mood: 10, tags: ['Anniversary'], text: "3 Years! Impossible. I used to not be able to go 3 hours. God is doing for me what I could not do for myself." },
                // Archive Entry
                { id: generateId(), timestamp: daysAgo(1000), mood: 2, tags: ['Archive', 'Day 1'], text: "I can't believe I'm here. Shaking. Scared. Please let this work." }
            ],

            // --- WORKBOOK: Steps 4, 8, 10, 11, 12 ---
            'recovery_workbook_responses': {
                // Step 4 (Deep Dive)
                'step-4-sec_b-6': "Resentment: Mom. Cause: She criticized my parenting. Affects: Self-esteem, Security. My Part: I seek her approval constantly and get angry when I don't get it. I am sensitive.",
                'step-4-sec_c-11': "Assets: I am loyal, hardworking, and empathetic.",
                // Step 8/9
                'step-8-sec_a-1': "Person: My ex-husband. Harm: Financial dishonesty, emotional neglect. Willingness: Yes.",
                'step-9-sec_a-3': "I will not make excuses. I will ask 'How can I set this right?' I will pay back the $2000.",
                // Step 10/11
                'step-10-sec_a-2': "Daily Review: 1. Was I kind? 2. Was I honest? 3. Was I thinking of myself or others?",
                'step-11-sec_a-2': "Morning prayer: 'Thy will be done.' Evening meditation: Review the day without judgment.",
                // SMART Tool: Balance
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

    // ========================================================================
    // PROFILE 3: DHARMA DAN (6 Months - Meditation & Mindfulness)
    // ========================================================================
    DHARMA: {
        name: "Dharma Dan",
        description: "6 Months Sober. Using Buddhist principles and meditation.",
        data: {
            'recovery_sobriety_date': daysAgo(180),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Walking the Path',
            
            // --- JOURNAL: 6 Months of Practice ---
            'recovery_journal_entries': [
                { id: generateId(), timestamp: daysAgo(1), mood: 8, tags: ['Sangha', 'Connection'], text: "The Refuge Recovery meeting was powerful. We talked about 'Wise Friends'. I realized I need to distance myself from my old drinking buddies to protect my energy." },
                { id: generateId(), timestamp: daysAgo(5), mood: 6, tags: ['Mindfulness', 'Work'], text: "Stressful deadline. I noticed my shoulders tensing and my breath getting shallow. I took a 'Sacred Pause'. Didn't react. Responded." },
                { id: generateId(), timestamp: daysAgo(20), mood: 7, tags: ['Metta', 'Self-Compassion'], text: "Practicing loving-kindness for myself is harder than for others. 'May I be safe, May I be happy'. Repeated it for 20 mins." },
                { id: generateId(), timestamp: daysAgo(60), mood: 4, tags: ['Doubt', 'Craving'], text: "Bad craving for opiates today. Physical pain in my back triggered it. I sat with the sensation. 'This too shall pass'. It's just a sensation, not a command." },
                { id: generateId(), timestamp: daysAgo(150), mood: 9, tags: ['Retreat', 'Breakthrough'], text: "First silent retreat weekend. My mind was so loud the first day. By Sunday, the silence was beautiful. I saw clearly how my attachment to comfort causes my suffering." }
            ],

            // --- WORKBOOK: Dharma ---
            'recovery_workbook_responses': {
                // Truths
                'rd-truth-1-sec_a-1': "Addiction is suffering. It is the hungry ghost—big belly, tiny throat. Never satisfied.",
                'rd-truth-2-sec_a-1': "The cause is craving. I crave to feel different. I crave oblivion.",
                'rd-truth-3-sec_a-1': "Recovery is possible. I have seen others walk the path.",
                // Eightfold Path
                'rd-path-3': "Wise Speech: I used to lie to cover my tracks. Now I practice radical honesty.",
                'rd-path-4': "Wise Action: I will not steal, I will not harm, I will not intoxicate myself.",
                'rd-path-5': "Wise Livelihood: Bartending was toxic for me. Graphic design allows me to be helpful without being surrounded by alcohol.",
                // Tools
                'rd-tools-meditation': "Meditation trains my mind to stay. Addiction trained it to run."
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

    // ========================================================================
    // PROFILE 4: RELAPSE RYAN (Chronic Relapse - The Struggle)
    // ========================================================================
    RELAPSE: {
        name: "Relapse Ryan",
        description: "3 Days Sober (Again). A history of 6 months of struggle.",
        data: {
            'recovery_sobriety_date': daysAgo(3),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Starting Over',
            
            // --- JOURNAL: The Cycle of Relapse ---
            'recovery_journal_entries': [
                // Current - The Aftermath
                { id: generateId(), timestamp: daysAgo(0), mood: 2, tags: ['Shame', 'Day 3'], text: "Head still hurts. The shame is heavier than the hangover. I had 60 days. Why did I throw it away for a beer? I feel like I'm letting everyone down." },
                { id: generateId(), timestamp: daysAgo(3), mood: 1, tags: ['Relapse', 'Bender'], text: "I blew it. It started on Friday. 'Just one' turned into a blackout. Woke up in my truck. God help me." },
                
                // 1 Month Ago - The Slide
                { id: generateId(), timestamp: daysAgo(30), mood: 5, tags: ['Complacency', 'Secrets'], text: "Haven't called my sponsor in two weeks. He's annoying me. I'm fine. I've got this. Work is busy anyway." },
                { id: generateId(), timestamp: daysAgo(40), mood: 6, tags: ['Resentment'], text: "My wife is still checking my bank account. Does she not trust me? I have 50 days! Back off." },
                
                // 2 Months Ago - The Previous Hope
                { id: generateId(), timestamp: daysAgo(60), mood: 8, tags: ['Milestone', 'Chip'], text: "Got my 60 Day chip! Finally. I feel great. Maybe this time it sticks." },
                
                // 4 Months Ago - The Previous Relapse
                { id: generateId(), timestamp: daysAgo(120), mood: 3, tags: ['Day 1', 'Again'], text: "Here we go again. Day 1. I promised myself I wouldn't do this. I'm so tired of the cycle." },
                
                // 6 Months Ago - The Beginning of that run
                { id: generateId(), timestamp: daysAgo(180), mood: 7, tags: ['Hope'], text: "Back in the rooms. The coffee tastes terrible but the people are nice. I want what they have." }
            ],

            // --- WORKBOOK: Ambivalence & Knowledge ---
            'recovery_workbook_responses': {
                // General
                'identifying-triggers': "1. Boredom (HUGE trigger)\n2. Hanging out with the guys at the bowling alley\n3. Thinking I can be a 'gentleman drinker'.",
                'relapse-prevention': "I know I should call someone. I know I should play the tape through. But when the urge hits, I forget everything.",
                
                // Step 1 - The Struggle
                'step-1-sec_a-1': "I know I'm powerless *after* the first drink. My problem is I still think I have power *before* the first drink.",
                'step-1-sec_a-3': "I lie to myself that 'this time will be different' or 'I'll just stick to beer'. That reservation kills me every time.",
                
                // SMART Tool: CBA (Cost Benefit Analysis)
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