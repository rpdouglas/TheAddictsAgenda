// src/data/sampleProfiles.js

// Helper to generate unique IDs for the sample data
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

// Helper dates
const today = new Date();
const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(today.getDate() - 14);
const threeYearsAgo = new Date(today); threeYearsAgo.setFullYear(today.getFullYear() - 3);
const sixMonthsAgo = new Date(today); sixMonthsAgo.setMonth(today.getMonth() - 6);

export const SAMPLE_PROFILES = {
    NEWCOMER: {
        name: "Newcomer Ned",
        description: "2 Weeks Sober. Focused on cravings and Step 1.",
        data: {
            'recovery_sobriety_date': twoWeeksAgo.toISOString(),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'One Day at a Time',
            'recovery_journal_entries': [
                {
                    id: generateId(),
                    timestamp: new Date(today.getTime() - 86400000 * 0.5).toISOString(),
                    mood: 4,
                    tags: ['Cravings', 'Anxiety'],
                    text: "Really tough afternoon. Wanted to use so bad after work. I used the Breathing Tool and called Mike. It passed, but I'm exhausted."
                },
                {
                    id: generateId(),
                    timestamp: new Date(today.getTime() - 86400000 * 2).toISOString(),
                    mood: 7,
                    tags: ['Meeting', 'Hope'],
                    text: "Went to the downtown meeting. The speaker had a story just like mine. For the first time in a while, I think I can actually do this."
                },
                {
                    id: generateId(),
                    timestamp: new Date(today.getTime() - 86400000 * 5).toISOString(),
                    mood: 2,
                    tags: ['Step 1', 'Honesty'],
                    text: "Started my Step 1 worksheet. Writing down the consequences is painful. I lost so much. But I have to face it."
                }
            ],
            'recovery_workbook_responses': {
                'identifying-triggers': "1. Stress at work (Deadlines)\n2. Walking past the old liquor store on 5th\n3. Feeling lonely on Friday nights\n4. Arguments with my ex.",
                'step-1-sec_a-1': "Powerlessness means that once I start, I cannot stop. I lose all control over the amount I take.",
                'step-1-sec_a-2': "1. My sister's wedding (blacked out)\n2. The company retreat last year\n3. That Tuesday I promised to stay home and went out anyway.",
                'step-1-sec_a-3': "I told everyone I was just 'tired' or 'sick'. I told myself I deserved a break."
            },
            'recovery_user_meetings': [
                { id: generateId(), name: 'Early Risers Group', day: 'Monday', time: '07:00', address: 'Community Center', isHomegroup: true },
                { id: generateId(), name: 'Friday Night Speaker', day: 'Friday', time: '20:00', address: 'Main St Church', isHomegroup: false }
            ],
            'recovery_goals': [
                { id: generateId(), text: 'Call sponsor every day', completed: true, createdAt: new Date().toISOString() },
                { id: generateId(), text: 'Find a homegroup', completed: true, createdAt: new Date().toISOString() },
                { id: generateId(), text: 'Read Bill\'s Story', completed: false, createdAt: new Date().toISOString() }
            ]
        }
    },
    SPONSOR: {
        name: "Steady Sarah",
        description: "3 Years Sober. Focused on Service and Step 10.",
        data: {
            'recovery_sobriety_date': threeYearsAgo.toISOString(),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Miracles Happen',
            'recovery_journal_entries': [
                {
                    id: generateId(),
                    timestamp: new Date().toISOString(),
                    mood: 9,
                    tags: ['Gratitude', 'Service'],
                    text: "Celebrated 3 years today! Brought a cake to the homegroup. So grateful for this life. I never thought I'd be here."
                },
                {
                    id: generateId(),
                    timestamp: new Date(today.getTime() - 86400000 * 1).toISOString(),
                    mood: 6,
                    tags: ['Step 10', 'Inventory'],
                    text: "Was short with a coworker today. I need to watch my patience. Paused, prayed, and made a quick amends before lunch."
                },
                {
                    id: generateId(),
                    timestamp: new Date(today.getTime() - 86400000 * 3).toISOString(),
                    mood: 8,
                    tags: ['Sponsee'],
                    text: "Met with my new sponsee. It's amazing to see the light come back on in someone's eyes. Reminds me where I came from."
                }
            ],
            'recovery_workbook_responses': {
                'step-10-sec_a-1': "Because without it, I slide back into old behaviors. My disease is doing pushups in the parking lot.",
                'step-10-sec_a-2': "1. Was I resentful?\n2. Was I selfish?\n3. Do I owe an apology?",
                'step-12-sec_a-1': "A complete change in my reaction to life. I no longer fight everyone and everything."
            },
            'recovery_user_meetings': [
                { id: generateId(), name: 'Womens Serenity', day: 'Wednesday', time: '18:30', address: 'Zoom (Online)', isHomegroup: false },
                { id: generateId(), name: 'Sunday Spiritual', day: 'Sunday', time: '10:00', address: 'The Club', isHomegroup: true }
            ],
            'recovery_homegroup_members': [
                { id: generateId(), name: 'Dave (GSR)', phone: '555-0101', position: 'GSR', email: 'dave@aa.org' },
                { id: generateId(), name: 'Susan (Treasurer)', phone: '555-0102', position: 'Treasurer', email: '' },
                { id: generateId(), name: 'Bill W.', phone: '555-0103', position: 'Group Member', email: '' }
            ],
            'recovery_homegroup_tracker': {
                [new Date().toISOString().split('T')[0]]: { chairperson: 'Sarah', attendance: 24, tradition: 15.50, notes: 'Great turnout. Newcomer named Ned.' }
            }
        }
    },
    DHARMA: {
        name: "Dharma Dan",
        description: "6 Months Sober. Focused on Meditation and Mindfulness.",
        data: {
            'recovery_sobriety_date': sixMonthsAgo.toISOString(),
            'recovery_welcome_tip_dismissed': true,
            'soberHeaderText': 'Walking the Path',
            'recovery_journal_entries': [
                {
                    id: generateId(),
                    timestamp: new Date().toISOString(),
                    mood: 8,
                    tags: ['Meditation', 'Sangha'],
                    text: "Had a great sit this morning. 20 minutes. Mind was busy but I kept coming back to the breath."
                },
                {
                    id: generateId(),
                    timestamp: new Date(today.getTime() - 86400000 * 2).toISOString(),
                    mood: 5,
                    tags: ['Refuge', 'Dharma'],
                    text: "Reading about the Second Noble Truth today. Craving is definitely the root of my suffering. I want things to be different than they are."
                }
            ],
            'recovery_workbook_responses': {
                'rd-truth-1-sec_a-1': "Suffering manifested as constant anxiety and the need to escape my own skin.",
                'rd-truth-2-sec_a-1': "I crave validation and comfort. When I don't get them, I turn to substances.",
                'rd-path-7': "Mindfulness helps me pause between the trigger and the reaction."
            },
            'recovery_user_meetings': [
                { id: generateId(), name: 'Dharma Recovery NYC', day: 'Tuesday', time: '19:00', address: 'Online', isHomegroup: true }
            ]
        }
    }
};