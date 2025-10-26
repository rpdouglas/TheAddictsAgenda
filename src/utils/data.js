// --- IMPORT STATIC JSON DATA ---
// Vite automatically loads the contents of this JSON file as a JavaScript object.
import workbookData from '../data/workbook.json';

// --- EXPORT STATIC DATA ---
export { workbookData };

// --- DYNAMIC LITERATURE LOADING ---

// This object now acts as a manifest of available literature.
// It provides the metadata needed for the library view without loading the chapter content.
export const literatureManifest = {
  aa_big_book: {
    key: 'aa_big_book',
    title: 'The Big Book (Alcoholics Anonymous)',
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

// This function dynamically imports the content of a book when requested.
export const getLiteratureBook = (bookKey) => {
  switch (bookKey) {
    case 'aa_big_book':
      return import('../data/aa_big_book.json');
    case 'na_basic_text':
      return import('../data/na_basic_text.json');
    // CORRECTED LINE: Ensure this case imports twelve_and_twelve.json
    case 'twelve_and_twelve':
      return import('../data/twelve_and_twelve.json');
    case 'recovery_dharma_guidebook':
      return import('../data/recovery_dharma_guidebook.json');
    default:
      return Promise.reject(new Error('Book not found'));
  }
};

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
export const copingStrategies = [
    // ... (Coping strategies data remains here)
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
    DAILYREFLECTION: '1.0.0',
};