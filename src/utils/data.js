// --- IMPORT JSON DATA ---
// Vite automatically loads the contents of these JSON files as JavaScript objects.
import workbookData from '../data/workbook.json';
import literatureData from '../data/literature.json';

// --- EXPORT IMPORTED DATA ---
export { workbookData, literatureData };

// --- RECOVERY INSIGHTS/FACTS DATA (Simple arrays remain here) ---
export const RECOVERY_FACTS = [
    "The Serenity Prayer was popularized by AA, but was originally written by theologian Reinhold Niebuhr.",
    "AA's Big Book was first published in 1939 and its core text (first 164 pages) remains unchanged.",
    "The 12 Traditions were developed to guide AA groups in their relationships with the world, not just to guide the individual.",
    "The motto 'Just for Today' is commonly used across many 12-Step fellowships to emphasize living in the present moment.",
    "The first Narcotics Anonymous meeting was held in Southern California in 1953.",
    "The concept of 'Higher Power' is intentionally non-religious and can be defined as 'God as we understood Him'.",
    "The opposite of addiction is often cited as connection, emphasizing the importance of fellowship.",
    "The 'HALT' acronym (Hungry, Angry, Lonely, Tired) is a fundamental tool for recognizing relapse triggers.",
    "The Step 4 inventory is 'searching and fearless' because admitting the 'exact nature' of wrongs releases their power.",
    "CA (Cocaine Anonymous) uses the same 12 Steps and 12 Traditions as AA.",
];

// --- Journal Templates Data ---
export const journalTemplates = [
    { id: '', name: 'Select a Template...' },
    { id: 'gratitude', name: '3-Part Gratitude Check', template: 'Today I am grateful for:\n1. (Person/Relationship)\n2. (Experience/Event)\n3. (Small Detail)\n\nHow did this feeling of gratitude influence my day?' },
    { id: 'halt', name: 'The H.A.L.T. Check', template: 'Before reacting or craving, I will check:\n\n**H**ungry? (Yes/No): \n**A**ngry? (Yes/No): \n**L**onely? (Yes/No): \n**T**ired? (Yes/No): \n\nWhat action did I take to meet my true need?' },
    { id: 'resentment', name: 'Resentment Filter', template: 'Today I felt resentful toward: (Person/Situation)\n\nWhat did they do? \n\nWhat part of my self-esteem (pride, security, ambition) did this threaten? \n\nWhat is my part in this situation?' },
    { id: 'step_10', name: 'Step 10 Spot Check', template: 'Where was I wrong today? (Small admissions of fault or mistake)\n\nWas I mindful of others?\n\nDid I practice honesty in a difficult situation?\n\nIf I was wrong, did I promptly admit it?' },
];

// --- Coping Cards Data ---
// NOTE: The 'icon' field holds the string name of the icon component, mapped in CopingCards.jsx
export const copingStrategies = [
    // --- GROUNDING (11 Cards Total) ---
    { title: "Deep Breathing", description: "Inhale for 4s, hold for 7s, exhale for 8s. Repeat 3-5 times.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },
    { title: "5-4-3-2-1 Method", description: "Name: 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },
    { title: "Notice 3 Colors", description: "Look around and name three specific colors you see and describe their shades.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },
    { title: "Ice Cube Hold", description: "Hold an ice cube or run your hands under very cold water for 30 seconds to reset your nervous system.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "ShieldIcon" },
    { title: "Tense & Release", description: "Tense all the muscles in your body for 10 seconds, then completely relax them.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "ShieldIcon" },
    { title: "Count Backwards 100", description: "Count backwards from 100 by 7s (100, 93, 86...) or by 3s for a mental challenge.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },
    { title: "Look for Symmetries", description: "Find patterns, shapes, or symmetry in the objects around you to focus your vision.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },
    { title: "Drink Cold Water", description: "Slowly drink a glass of ice-cold water to change your physical state.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "ShieldIcon" },
    { title: "Smell a Strong Scent", description: "Use a strong scent like peppermint oil, coffee grounds, or lemon to break an intense focus on craving.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },
    { title: "Describe Your Surroundings", description: "Mentally or verbally describe the room or scene you are in with five neutral sentences.", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },
    { title: "Write Down 5 Facts", description: "Write down 5 objective facts about the current day (Date, weather, what you ate, etc.)", category: "Grounding", color: "from-blue-100 to-indigo-200", icon: "MapPinIcon" },

    // --- ACTION (11 Cards Total) ---
    { title: "Go for a Walk", description: "A 10-15 minute walk can change your scenery and mindset.", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Tidy 5 Minutes", description: "Set a timer and clean one small area (e.g., your desk, one corner of the room).", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Listen to Upbeat Music", description: "Put on music that is guaranteed to change your mood for the better.", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Hobby/Skill Practice", description: "Spend 20 minutes doing something you love: drawing, playing an instrument, or reading.", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Shower or Wash Face", description: "Use the temperature change of the water as a physical reset.", category: "Action", color: "from-green-100 to-emerald-200", icon: "LifeBuoyIcon" },
    { title: "Cook a Small Meal", description: "Prepare a healthy snack or meal. Focus intensely on the ingredients and process.", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Stretch/Yoga", description: "Perform simple stretches to release tension held in the body.", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Write a 'To Do' List", description: "Bring control to a chaotic mind by writing out simple tasks you can accomplish.", category: "Action", color: "from-green-100 to-emerald-200", icon: "LifeBuoyIcon" },
    { title: "Play a Simple Game", description: "Engage in a quick mental distraction like Sudoku, a mobile game, or a crossword.", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Engage in Service", description: "Do something selfless for another person (a chore, errand, or positive word).", category: "Action", color: "from-green-100 to-emerald-200", icon: "LifeBuoyIcon" },
    { title: "Plan Next 2 Hours", description: "Write down a structured plan for the next two hours, focusing on small, healthy steps.", category: "Action", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },

    // --- COGNITIVE (11 Cards Total) ---
    { title: "Play the Tape Through", description: "Think about the full consequences of giving in to a craving.", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Delay and Distract", description: "Wait 15 minutes. Do something to distract yourself in that time.", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Challenge the Thought", description: "Ask yourself: Is this thought 100% true? Is it helpful? What is the alternative?", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Fact vs. Feeling", description: "Write down the feeling you have, then write down a counter-fact that contradicts that feeling.", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Affirmation Practice", description: "Repeat a positive affirmation three times (e.g., 'I am strong, I am safe, I am sober').", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Read an Insight", description: "Read a passage from your favorite recovery book or an inspiring quote.", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "LifeBuoyIcon" },
    { title: "Pros and Cons of Using", description: "Make two lists side-by-side: what you gain by using vs. what you lose.", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Acceptance Statement", description: "Write down one sentence accepting a difficult reality that you cannot change right now.", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Identify the Underlying Emotion", description: "Ask: Am I truly hungry, angry, lonely, or tired (HALT)? What is the real need?", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },
    { title: "Review Core Beliefs", description: "Look at your deepest beliefs about yourself. Are they serving your recovery?", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "LifeBuoyIcon" },
    { title: "Forgiveness Practice", description: "Mentally practice forgiving yourself or someone else for a past wrong.", category: "Cognitive", color: "from-pink-100 to-red-200", icon: "ShieldIcon" },

    // --- CONNECTION (11 Cards Total) ---
    { title: "Call a Friend", description: "Talk about what you're feeling with your support network.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Check In with Sponsor", description: "Call your sponsor/accountability partner immediately for guidance.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Attend Online Meeting", description: "Join a virtual fellowship meeting right now (AA, NA, SMART, etc.).", category: "Connection", color: "from-green-100 to-emerald-200", icon: "MapPinIcon" },
    { title: "Help Another Person", description: "Reach out to someone else in recovery to offer support.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Send a Gratitude Text", description: "Send a message to a loved one stating one thing you appreciate about them.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Visit a Safe Person", description: "If safe and possible, go see a supportive person in person.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "MapPinIcon" },
    { title: "Read Literature with Someone", description: "Call someone and read a recovery chapter over the phone together.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Join a Public Forum/Chat", description: "Post an honest update about your current feelings in a safe recovery chat group.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Ask for Specific Help", description: "Admit that you need help and ask a friend for a specific, small task (e.g., 'Can you stay on the phone for 10 minutes?').", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Call a Crisis Line", description: "Use a national helpline if you are in immediate distress or crisis.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
    { title: "Express a Need", description: "Clearly communicate one emotional need you have to a trustworthy person right now.", category: "Connection", color: "from-green-100 to-emerald-200", icon: "PhoneIcon" },
];

// --- Meeting Links ---
export const MEETING_LINKS = {
    AA: {
        name: "Alcoholics Anonymous (AA)",
        description: "Find local, in-person, or online AA meetings.",
        link: "https://www.aa.org/find-meetings",
        instructions: "The official AA website provides local directories and search tools."
    },
    NA: {
        name: "Narcotics Anonymous (NA)",
        description: "Find local and online NA meetings.",
        link: "https://www.na.org/meetingsearch/",
        instructions: "Use the NA Meeting Locator to find times and locations in your area."
    },
    CA: {
        name: "Cocaine Anonymous (CA)",
        description: "Find CA meetings globally.",
        link: "https://www.ca.org/meetings/",
        instructions: "The CA website offers a global directory and online meeting resources."
    }
};

// --- Application Versioning ---
export const APP_VERSIONS = {
    DASHBOARD: '1.3.1',
    JOURNAL: '1.4.0', 
    GOALS: '1.1.1', 
    COPING: '2.1.0', 
    WORKBOOK: '1.4.1',
    LITERATURE: '1.1.0',
    RESOURCES: '1.0.0',
    SETTINGS: '1.0.1',
    MEETINGFINDER: '1.0.0',
};
