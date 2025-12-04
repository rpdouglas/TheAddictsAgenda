// src/data/sampleProfiles.js

// Helper to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

// Helper dates for dynamic timestamps
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
const threeDaysAgo = new Date(today); threeDaysAgo.setDate(today.getDate() - 3);
const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);

// Specific dates for profiles
const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(today.getDate() - 14);
const threeYearsAgo = new Date(today); threeYearsAgo.setFullYear(today.getFullYear() - 3);
const sixMonthsAgo = new Date(today); sixMonthsAgo.setMonth(today.getMonth() - 6);

export const SAMPLE_PROFILES = {
    NEWCOMER: {
        name: "Newcomer Ned",
        description: "2 Weeks Sober. Focused on Step 1, cravings, and finding meetings.",
        data: {
            'recovery_sobriety_date': twoWeeksAgo.toISOString(),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'One Day at a Time',
            
            // --- EXPANDED JOURNAL ---
            'recovery_journal_entries': [
                {
                    id: generateId(),
                    timestamp: new Date().toISOString(), // Today
                    mood: 6,
                    tags: ['Gratitude', 'Small Win'],
                    text: "Made it through payday without picking up. I drove a different route home to avoid the liquor store. It felt weird but good. Bought a pizza instead."
                },
                {
                    id: generateId(),
                    timestamp: yesterday.toISOString(),
                    mood: 4,
                    tags: ['Cravings', 'Anxiety', 'Work'],
                    text: "Really tough afternoon. Boss was yelling about deadlines. Wanted to use so bad to just check out. I used the Breathing Tool (Box Breathing) in my car for 5 mins. It passed, but I'm exhausted."
                },
                {
                    id: generateId(),
                    timestamp: twoDaysAgo.toISOString(),
                    mood: 7,
                    tags: ['Meeting', 'Hope', 'Beginners'],
                    text: "Went to the downtown beginners meeting. The speaker had a story just like mine - lost his job, wife left, sleeping on a couch. But he was laughing about it today. For the first time in a while, I think I can actually do this."
                },
                {
                    id: generateId(),
                    timestamp: threeDaysAgo.toISOString(),
                    mood: 3,
                    tags: ['Shame', 'Reflection'],
                    text: "Can't sleep. Thinking about the money I stole from my sister. I feel sick. My sponsor said to just write it down for now and we will deal with it in Step 4. It's hard to sit with this feeling."
                },
                {
                    id: generateId(),
                    timestamp: lastWeek.toISOString(),
                    mood: 8,
                    tags: ['Pink Cloud', 'Energy'],
                    text: "Woke up without a hangover for the 7th day in a row! The sun is shining. Is this what normal people feel like? I actually ate breakfast."
                }
            ],

            // --- EXPANDED WORKBOOK ---
            'recovery_workbook_responses': {
                // General Recovery
                'identifying-triggers': "1. Stress at work (Deadlines)\n2. Walking past the old liquor store on 5th\n3. Feeling lonely on Friday nights\n4. Arguments with my ex.",
                'relapse-prevention': "If I feel a craving, I will:\n1. Play the tape through (think about the hangover).\n2. Call Mike or Steve from the meeting.\n3. Eat something sweet.",
                
                // Step 1: Honesty
                // Section A: Powerlessness
                'step-1-sec_a-1': "Powerlessness means that once I start, I cannot stop. I lose all control over the amount I take. It also means I can't manage my emotions without chemicals.",
                'step-1-sec_a-2': "1. My sister's wedding (blacked out before the toast)\n2. The company retreat last year (got sent home early)\n3. That Tuesday I promised to stay home and went out anyway.",
                'step-1-sec_a-3': "I told everyone I was just 'tired' or 'sick'. I told myself I deserved a break. I hid bottles in the garage.",
                
                // Section B: Unmanageability
                'step-1-sec_b-1': "Finances: I'm maxed out on credit cards.\nRelationships: My girlfriend moved out.\nWork: I'm on final warning.",
                'step-1-sec_b-2': "I have high blood pressure now and anxiety shakes every morning.",
                
                // Section C: Acceptance
                'step-1-sec_c-1': "I am willing to go to 90 meetings in 90 days. I am willing to call a sponsor.",
                'step-1-sec_c-2': "My biggest fear is that I'm boring without the drink. That I won't be able to have fun."
            },

            'recovery_user_meetings': [
                { id: generateId(), name: 'Early Risers Group', day: 'Monday', time: '07:00', address: 'Community Center', isHomegroup: true },
                { id: generateId(), name: 'Friday Night Speaker', day: 'Friday', time: '20:00', address: 'Main St Church', isHomegroup: false },
                { id: generateId(), name: 'Saturday Morning Zoom', day: 'Saturday', time: '10:00', address: 'Zoom ID: 555-123-4567', isHomegroup: false }
            ],
            
            'recovery_goals': [
                { id: generateId(), text: 'Call sponsor every day', completed: true, createdAt: new Date().toISOString() },
                { id: generateId(), text: 'Find a homegroup', completed: true, createdAt: new Date().toISOString() },
                { id: generateId(), text: 'Read Bill\'s Story', completed: false, createdAt: new Date().toISOString() },
                { id: generateId(), text: 'Get phone numbers', completed: false, createdAt: new Date().toISOString() }
            ]
        }
    },
    SPONSOR: {
        name: "Steady Sarah",
        description: "3 Years Sober. Focused on Service, Step 10, and Sponsorship.",
        data: {
            'recovery_sobriety_date': threeYearsAgo.toISOString(),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Miracles Happen',
            
            // --- EXPANDED JOURNAL ---
            'recovery_journal_entries': [
                {
                    id: generateId(),
                    timestamp: new Date().toISOString(),
                    mood: 9,
                    tags: ['Gratitude', 'Anniversary'],
                    text: "Celebrated 3 years today! Brought a cake to the homegroup. So grateful for this life. I never thought I'd be here. My mom actually sent me a card - our relationship is finally healing."
                },
                {
                    id: generateId(),
                    timestamp: yesterday.toISOString(),
                    mood: 6,
                    tags: ['Step 10', 'Inventory', 'Work'],
                    text: "Was short with a coworker (Jim) today. I wanted things done my way. I need to watch my patience and need for control. Paused, prayed, and made a quick amends before lunch. It felt better to let go of being 'right'."
                },
                {
                    id: generateId(),
                    timestamp: threeDaysAgo.toISOString(),
                    mood: 8,
                    tags: ['Sponsee', 'Service'],
                    text: "Met with my new sponsee, Lisa. We read the Doctor's Opinion. It's amazing to see the light come back on in someone's eyes. Reminds me where I came from and keeps me green."
                },
                {
                    id: generateId(),
                    timestamp: lastWeek.toISOString(),
                    mood: 5,
                    tags: ['Emotional Sobriety', 'Family'],
                    text: "Struggling with my dad's illness. I want to fix it, but I can't. Practicing the Serenity Prayer heavily today. Acceptance is the answer to all my problems today."
                }
            ],

            // --- EXPANDED WORKBOOK ---
            'recovery_workbook_responses': {
                // Step 10: Awareness
                'step-10-sec_a-1': "Because without it, I slide back into old behaviors. My disease is doing pushups in the parking lot. I need to spot the 'self' creeping back in.",
                'step-10-sec_a-2': "1. Was I resentful?\n2. Was I selfish?\n3. Do I owe an apology?\n4. Was I kind and loving?",
                'step-10-sec_b-1': "Promptly means NOW. Not stewing on it for days. It keeps the side of the street clean so I don't build up new wreckage.",
                
                // Step 12: Service
                'step-12-sec_a-1': "A complete change in my reaction to life. I no longer fight everyone and everything. I feel a sense of belonging.",
                'step-12-sec_b-1': "I carry the message by showing up, being consistent, and listening. I don't preach; I share my experience, strength, and hope.",
                
                // SMART Tool: Lifestyle Balance
                'smart_balance': "Work: 8/10\nRelationships: 7/10\nHealth: 5/10 (Need to exercise more)\nCreativity: 4/10\nSpirituality: 9/10"
            },

            'recovery_user_meetings': [
                { id: generateId(), name: 'Womens Serenity', day: 'Wednesday', time: '18:30', address: 'Zoom (Online)', isHomegroup: false },
                { id: generateId(), name: 'Sunday Spiritual', day: 'Sunday', time: '10:00', address: 'The Club', isHomegroup: true },
                { id: generateId(), name: 'H&I Service Panel', day: 'Saturday', time: '14:00', address: 'City Hospital', isHomegroup: false }
            ],
            
            'recovery_homegroup_members': [
                { id: generateId(), name: 'Dave (GSR)', phone: '555-0101', position: 'GSR', email: 'dave@aa.org' },
                { id: generateId(), name: 'Susan (Treasurer)', phone: '555-0102', position: 'Treasurer', email: '' },
                { id: generateId(), name: 'Bill W.', phone: '555-0103', position: 'Group Member', email: '' },
                { id: generateId(), name: 'Newcomer Ned', phone: '555-0999', position: 'Group Member', email: '' }
            ],
            
            'recovery_homegroup_tracker': {
                [new Date().toISOString().split('T')[0]]: { chairperson: 'Sarah', attendance: 24, tradition: 15.50, notes: 'Great turnout. Newcomer named Ned.' },
                [new Date(Date.now() - 604800000).toISOString().split('T')[0]]: { chairperson: 'Bob', attendance: 18, tradition: 12.00, notes: 'Business meeting followed.' }
            }
        }
    },
    DHARMA: {
        name: "Dharma Dan",
        description: "6 Months Sober. Focused on Meditation, Mindfulness, and the Eightfold Path.",
        data: {
            'recovery_sobriety_date': sixMonthsAgo.toISOString(),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Walking the Path',
            
            // --- EXPANDED JOURNAL ---
            'recovery_journal_entries': [
                {
                    id: generateId(),
                    timestamp: new Date().toISOString(),
                    mood: 8,
                    tags: ['Meditation', 'Sangha'],
                    text: "Had a great sit this morning. 20 minutes. Mind was busy but I kept coming back to the breath. The refuge of the Sangha was strong tonight."
                },
                {
                    id: generateId(),
                    timestamp: yesterday.toISOString(),
                    mood: 7,
                    tags: ['Wise Speech', 'Work'],
                    text: "Noticed a desire to gossip at work today. I paused and asked myself: 'Is it true? Is it kind? Is it necessary?' I chose to stay silent. It felt empowering not to engage in negativity."
                },
                {
                    id: generateId(),
                    timestamp: twoDaysAgo.toISOString(),
                    mood: 5,
                    tags: ['Refuge', 'Dharma', 'Craving'],
                    text: "Reading about the Second Noble Truth today. Craving is definitely the root of my suffering. I want things to be different than they are. I sat with the craving for sugar and watched it rise and fall without acting on it. Impermanence in action."
                },
                {
                    id: generateId(),
                    timestamp: lastWeek.toISOString(),
                    mood: 6,
                    tags: ['Metta', 'Self-Compassion'],
                    text: "Practiced Metta (Loving-Kindness) for myself today. It's hard. I can send love to others easily, but sending it to myself brings up tears. 'May I be safe, may I be happy, may I be free from suffering.'"
                }
            ],

            // --- EXPANDED WORKBOOK ---
            'recovery_workbook_responses': {
                // Recovery Dharma: The Truths
                'rd-truth-1-sec_a-1': "Suffering manifested as constant anxiety and the need to escape my own skin. I hurt everyone around me by being unavailable.",
                'rd-truth-2-sec_a-1': "I crave validation and comfort. When I don't get them, I turn to substances to fill the void.",
                'rd-truth-3-sec_a-1': "Freedom looks like being okay with whatever is happening right now. Not needing to change my internal state with chemicals.",
                
                // Recovery Dharma: The Path
                'rd-path-1': "Wise Understanding means knowing that my actions have consequences (Karma). If I use, I suffer.",
                'rd-path-3': "My speech was often manipulative. I lied to cover my tracks. Now I try to speak only what is true and helpful.",
                'rd-path-7': "Mindfulness helps me pause between the trigger and the reaction. That pause is where my recovery lives."
            },

            'recovery_user_meetings': [
                { id: generateId(), name: 'Dharma Recovery NYC', day: 'Tuesday', time: '19:00', address: 'Online', isHomegroup: true },
                { id: generateId(), name: 'Sunday Sit', day: 'Sunday', time: '09:00', address: 'Meditation Center', isHomegroup: false }
            ],
            
            'recovery_goals': [
                { id: generateId(), text: 'Daily 20 min meditation', completed: true, createdAt: new Date().toISOString() },
                { id: generateId(), text: 'Read "Refuge Recovery"', completed: false, createdAt: new Date().toISOString() },
                { id: generateId(), text: 'Attend silent retreat', completed: false, createdAt: new Date().toISOString() }
            ]
        }
    }
};