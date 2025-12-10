// src/utils/aiService.js
import DataStore from './dataStore.js';

/**
 * Parses the raw text response from Gemini into Insights and Action Items.
 * Expects the AI to include a "SUGGESTED_ACTIONS" section.
 * * @param {string} responseText - The raw string from the AI model.
 * @returns {object} { insights: string, actions: string[] }
 */
export const parseAIResponse = (responseText) => {
    if (!responseText) return { insights: '', actions: [] };

    // Split based on the keyword we prompt the AI to use
    const parts = responseText.split('SUGGESTED_ACTIONS');
    
    const insights = parts[0].trim();
    const actionBlock = parts.length > 1 ? parts[1].trim() : '';

    // Clean up the bullet points
    const actions = actionBlock
        .split('\n')
        .map(line => line.replace(/^-/, '').trim()) // Remove leading dashes
        .filter(line => line.length > 0)
        .slice(0, 3); // Enforce max 3 items

    return { insights, actions };
};

/**
 * Creates a standardized Task Object for the To-Do list based on an AI Suggestion.
 * Enforces the "Recovery Accountability Engine" rules:
 * - Due Date: 7 Days from creation (Local Time).
 * - Recurrence: 'none' (Action Item).
 * - Tags: Includes 'actionitems' and the source.
 * * @param {string} actionText - The text of the task.
 * @param {string} sourceTag - The source module (e.g., 'workbook', 'journal').
 * @returns {object} The formatted task object ready for DataStore.
 */
export const createActionItemObject = (actionText, sourceTag = 'general') => {
    // 1. Calculate Due Date (7 Days out, Local Time)
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + 7);

    // Format YYYY-MM-DD manually to prevent UTC shift errors
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const formattedDueDate = `${y}-${m}-${d}`;

    // 2. Return the standard object
    return {
        id: DataStore.generateId(),
        text: actionText,
        completed: false,
        createdAt: new Date().toISOString(),
        recurrence: 'none',        // Rule: Action Items do not recur
        dueDate: formattedDueDate, // Rule: 1 Week Deadline
        streakCount: 0,
        lastCompleted: null,
        tags: ['actionitems', sourceTag] // Rule: tagged for Red accent
    };
};