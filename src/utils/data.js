// src/utils/data.js

// --- IMPORT JSON DATA ---
// Vite automatically loads the contents of these JSON files as JavaScript objects.
import workbookDataRaw from '../data/workbook.json';

// Clone raw data to modify it
let workbookData = JSON.parse(JSON.stringify(workbookDataRaw));

// ADD SMART RECOVERY CATEGORY
workbookData['smart_recovery'] = {
    id: 'smart_recovery',
    title: 'SMART Recovery Tools',
    description: 'Evidence-based tools for self-empowerment and practical coping.',
    topics: [
        {
            id: 'smart_cba',
            title: '1.1 Cost Benefit Analysis',
            prompt: 'Weigh the pros and cons of using vs. abstaining.',
            customComponent: 'CBATool'
        },
        {
            id: 'smart_compassion',
            title: '2.2 Practice Self-Compassion',
            prompt: 'Address feelings of hopelessness with kindness.',
            customComponent: 'SelfCompassionTool'
        },
        {
            id: 'smart_urge',
            title: '2.1 Urge Log',
            prompt: 'Track your triggers and intensity.',
            customComponent: 'UrgeLogTool'
        },
        {
            id: 'smart_abc',
            title: '3.1 The ABCs of Coping',
            prompt: 'Challenge irrational beliefs.',
            customComponent: 'ABCTool'
        },
        {
            id: 'smart_five_q',
            title: '3.3 Five Questions',
            prompt: 'Get what you want by aligning actions with goals.',
            customComponent: 'FiveQuestionsTool'
        },
        {
            id: 'smart_dents',
            title: '4.5 Customize DENTS',
            prompt: 'Strategies to Deny, Escape, Neutralize, Task, or Swap.',
            customComponent: 'DentsTool'
        },
        {
            id: 'smart_personify',
            title: '4.6 Personify and Disarm',
            prompt: 'Give your urge a name to take away its power.',
            customComponent: 'PersonifyTool'
        },
        {
            id: 'smart_balance',
            title: '4.2 Lifestyle Balance',
            prompt: 'Visualize the balance between work, health, and play.',
            customComponent: 'LifestyleBalanceTool'
        },
        {
            id: 'smart_boundaries',
            title: '5.5 Setting Healthy Boundaries',
            prompt: 'Practice communicating small and large boundaries.',
            customComponent: 'BoundariesTool'
        },
        {
            id: 'smart_goal',
            title: '6.3 Effective Goal Setting',
            prompt: 'Create a specific, measurable plan.',
            customComponent: 'SmartGoalTool'
        }
    ]
};

// ... (Rest of file remains unchanged, keeping literatureManifest, constants etc.)
export const literatureManifest = {
  aa_big_book_v4: {
    key: 'aa_big_book_v4',
    title: 'The Big Book (4th Edition)',
    pdfLink: 'https://www.aa.org/sites/default/files/2021-11/en_bigbook_personalstories_1st.pdf', 
  },
  na_basic_text: {
    key: 'na_basic_text',
    title: 'The Basic Text (Narcotics Anonymous)',
    pdfLink: 'https://www.na.org/admin/include/spaw2/uploads/pdf/litfiles/us_english/Book/Sixth%20Edition%20Basic%20Text.pdf',
  },
  twelve_and_twelve: {
    key: 'twelve_and_twelve',
    title: 'Twelve Steps and Twelve Traditions',
    pdfLink: '#',
  },
  recovery_dharma_guidebook: {
    key: 'recovery_dharma_guidebook',
    title: 'The Four Noble Truths: A Recovery Dharma Guidebook',
    pdfLink: '#',
  }
};

export const getLiteratureBook = (bookKey) => {
  switch (bookKey) {
    case 'aa_big_book_v4':
      return import('../data/aa_big_book_v4.json');
    case 'na_basic_text':
      return import('../data/na_basic_text.json');
    case 'twelve_and_twelve':
      return import('../data/twelve_and_twelve.json');
    case 'recovery_dharma_guidebook':
      return import('../data/recovery_dharma_guidebook.json');
    default:
      return Promise.reject(new Error('Book not found'));
  }
};

export { workbookData };

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

export const journalTemplates = [
    { id: '', name: 'Select a Template...' },
    { id: 'gratitude', name: '3-Part Gratitude Check', template: 'Today I am grateful for:\n1. (Person/Relationship)\n2. (Experience/Event)\n3. (Small Detail)\n\nHow did this feeling of gratitude influence my day?' },
    { id: 'halt', name: 'The H.A.L.T. Check', template: 'Before reacting or craving, I will check:\n\n**H**ungry? (Yes/No): \n**A**ngry? (Yes/No): \n**L**onely? (Yes/No): \n**T**ired? (Yes/No): \n\nWhat action did I take to meet my true need?' },
    { id: 'resentment', name: 'Resentment Filter', template: 'Today I felt resentful toward: (Person/Situation)\n\nWhat did they do? \n\nWhat part of my self-esteem (pride, security, ambition) did this threaten? \n\nWhat is my part in this situation?' },
    { id: 'step_10', name: 'Step 10 Spot Check', template: 'Where was I wrong today? (Small admissions of fault or mistake)\n\nWas I mindful of others?\n\nDid I practice honesty in a difficult situation?\n\nIf I was wrong, did I promptly admit it?' },
];

export const copingStrategies = [
    { title: "Deep Breathing", description: "Inhale for 4s, hold for 7s, exhale for 8s. Repeat 3-5 times.", category: "Grounding", color: "from-serene-teal/20 to-healing-green/20", icon: "MapPinIcon" },
    { title: "5-4-3-2-1 Method", description: "Name: 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.", category: "Grounding", color: "from-serene-teal/20 to-healing-green/20", icon: "MapPinIcon" },
    { title: "Ice Cube Hold", description: "Hold an ice cube or run your hands under very cold water for 30 seconds to reset your nervous system.", category: "Grounding", color: "from-serene-teal/20 to-healing-green/20", icon: "ShieldIcon" },
    { title: "Go for a Walk", description: "A 10-15 minute walk can change your scenery and mindset.", category: "Action", color: "from-healing-green/20 to-serene-teal/20", icon: "PhoneIcon" },
    { title: "Tidy 5 Minutes", description: "Set a timer and clean one small area (e.g., your desk, one corner of the room).", category: "Action", color: "from-healing-green/20 to-serene-teal/20", icon: "PhoneIcon" },
    { title: "Shower or Wash Face", description: "Use the temperature change of the water as a physical reset.", category: "Action", color: "from-healing-green/20 to-serene-teal/20", icon: "LifeBuoyIcon" },
    { title: "Play the Tape Through", description: "Think about the full consequences of giving in to a craving.", category: "Cognitive", color: "from-hopeful-coral/20 to-hopeful-coral/30", icon: "ShieldIcon" },
    { title: "Delay and Distract", description: "Wait 15 minutes. Do something to distract yourself in that time.", category: "Cognitive", color: "from-hopeful-coral/20 to-hopeful-coral/30", icon: "ShieldIcon" },
    { title: "Read an Insight", description: "Read a passage from your favorite recovery book or an inspiring quote.", category: "Cognitive", color: "from-hopeful-coral/20 to-hopeful-coral/30", icon: "LifeBuoyIcon" },
    { title: "Call a Friend", description: "Talk about what you're feeling with your support network.", category: "Connection", color: "from-healing-green/20 to-serene-teal/20", icon: "PhoneIcon" },
    { title: "Check In with Sponsor", description: "Call your sponsor/accountability partner immediately for guidance.", category: "Connection", color: "from-healing-green/20 to-serene-teal/20", icon: "PhoneIcon" },
    { title: "Attend Online Meeting", description: "Join a virtual fellowship meeting right now (AA, NA, SMART, etc.).", category: "Connection", color: "from-healing-green/20 to-serene-teal/20", icon: "MapPinIcon" },
];

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

export const APP_VERSIONS = {
    DASHBOARD: '1.5.0',
    JOURNAL: '1.8.1', 
    GOALS: '1.4.1', 
    COPING: '2.2.0', 
    WORKBOOK: '1.8.0',
    LITERATURE: '1.3.0',
    RESOURCES: '1.1.0',
    SETTINGS: '1.2.1',
    MEETINGFINDER: '1.1.0',
    DAILYREFLECTION: '1.1.0',
    USERGUIDE: '1.5.0',
    SMARTTOOLS: '1.3.0', // Incremented
};