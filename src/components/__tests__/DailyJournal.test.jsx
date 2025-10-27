import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import DailyJournal from '../DailyJournal.jsx';

// --- MOCK DEPENDENCIES ---

// Mock DataStore methods used by DailyJournal
const mockJournalData = [
    { id: '1', date: '2025-10-20', title: 'Great Day', content: 'Felt good today.', mood: 9, tags: ['Gratitude'] },
    { id: '2', date: '2025-10-21', title: 'Hard Morning', content: 'Struggled to get up.', mood: 4, tags: ['Struggle'] },
];

const mockDataStore = {
    KEYS: { JOURNAL: 'journal_entries' },
    load: vi.fn((key) => {
        if (key === 'journal_entries') return Promise.resolve(mockJournalData);
        return Promise.resolve(null);
    }),
    save: vi.fn(() => Promise.resolve()),
    generateId: vi.fn(() => 'new-id-3'),
};
vi.mock('../../utils/dataStore.js', () => ({
    default: mockDataStore,
}));

// Mock the template data
const mockJournalTemplates = [
    { name: 'Gratitude', content: 'I am grateful for...' },
];
vi.mock('../../utils/data.js', () => ({
    journalTemplates: mockJournalTemplates,
}));

// Mock sub-components (especially those with complex internal logic or external dependencies)
vi.mock('../common.jsx', () => ({
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    DebouncedTextarea: (props) => (
        <textarea
            data-testid="debounced-textarea"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
        />
    ),
    GeminiJournalHelper: () => <div data-testid="gemini-helper">AI Helper Modal</div>,
}));

// Mock icons
vi.mock('../../utils/icons.jsx', () => ({
    ArrowLeftIcon: () => <svg data-testid="ArrowLeftIcon" />,
    EditIcon: () => <svg data-testid="EditIcon" />,
    TrashIcon: () => <svg data-testid="TrashIcon" />,
    SparklesIcon: () => <svg data-testid="SparklesIcon" />,
    CheckIcon: () => <svg data-testid="CheckIcon" />,
    PenIcon: () => <svg data-testid="PenIcon" />,
    PlusIcon: () => <svg data-testid="PlusIcon" />,
    TrendingUpIcon: () => <svg data-testid="TrendingUpIcon" />,
    XIcon: () => <svg data-testid="XIcon" />,
}));

// --- SETUP ---
beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
});

describe('DailyJournal', () => {
    const defaultProps = {
        journalTemplate: '',
        setJournalTemplate: vi.fn(),
        journalTags: [],
        setJournalTags: vi.fn(),
        onBack: vi.fn(),
    };

    // --- TEST 1: Initial Loading and Display ---
    it('shows spinner while loading and displays list view after load', async () => {
        render(<DailyJournal {...defaultProps} />);
        
        // 1. Check for loading state
        expect(screen.getByTestId('spinner')).toBeInTheDocument();

        // 2. Advance time to resolve mock data load
        vi.advanceTimersByTime(0);
        await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

        // 3. Check for list view elements (New Entry button and existing entries)
        expect(screen.getByRole('heading', { name: /Daily Journal/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /New Entry/i })).toBeInTheDocument();
        expect(screen.getByText(/Great Day/i)).toBeInTheDocument();
        expect(screen.getByText(/Hard Morning/i)).toBeInTheDocument();
    });

    // --- TEST 2: Template Injection (Navigation from Dashboard) ---
    it('starts in form view when journalTemplate prop is provided', async () => {
        const templateProps = {
            ...defaultProps,
            journalTemplate: 'This is a guided reflection.',
            journalTags: ['Guided'],
        };
        render(<DailyJournal {...templateProps} />);
        
        vi.advanceTimersByTime(0);
        await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

        // 1. Should be in Form View (check for form elements)
        expect(screen.getByPlaceholderText(/Optional Title/i)).toBeInTheDocument();
        expect(screen.getByText(/Back to Entries/i)).toBeInTheDocument();
        
        // 2. Check if content and tags are pre-populated
        const textarea = screen.getByTestId('debounced-textarea');
        expect(textarea.value).toBe('This is a guided reflection.');
        expect(screen.getByText(/#Guided/i)).toBeInTheDocument();

        // 3. Check if template props are cleared (indicating consumption)
        expect(templateProps.setJournalTemplate).toHaveBeenCalledWith('');
        expect(templateProps.setJournalTags).toHaveBeenCalledWith([]);
    });

    // --- TEST 3: Navigating to New Entry Form and Saving ---
    it('allows creation of a new entry and saves it correctly', async () => {
        render(<DailyJournal {...defaultProps} />);
        vi.advanceTimersByTime(0);
        await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
        
        // 1. Navigate to form
        fireEvent.click(screen.getByRole('button', { name: /New Entry/i }));
        expect(screen.getByText(/Create Entry/i)).toBeInTheDocument();

        // 2. Type content and title
        const titleInput = screen.getByPlaceholderText('Optional Title');
        const contentTextarea = screen.getByTestId('debounced-textarea');
        fireEvent.change(titleInput, { target: { value: 'My New Title' } });
        fireEvent.change(contentTextarea, { target: { value: 'Journal content here.' } });
        
        // 3. Add a tag
        const tagInput = screen.getByPlaceholderText(/Add tag/i);
        fireEvent.change(tagInput, { target: { value: 'Focus' } });
        fireEvent.click(screen.getByTitle('Add Tag'));
        expect(screen.getByText(/#Focus/i)).toBeInTheDocument();

        // 4. Save the entry
        fireEvent.click(screen.getByRole('button', { name: /Create Entry/i }));
        
        // 5. Check saving status and mock call
        expect(screen.getByText(/Entry Saved!/i)).toBeInTheDocument();
        await waitFor(() => expect(mockDataStore.save).toHaveBeenCalled());
        
        // 6. Verify the data passed to DataStore.save
        const savedData = mockDataStore.save.mock.calls[0][1];
        expect(savedData.length).toBe(3); // 2 originals + 1 new
        expect(savedData[0].title).toBe('My New Title');
        expect(savedData[0].content).toBe('Journal content here.');
        expect(savedData[0].tags).toEqual(['Focus']);
    });

    // --- TEST 4: Editing and Deleting an Existing Entry ---
    it('allows editing an existing entry', async () => {
        render(<DailyJournal {...defaultProps} />);
        vi.advanceTimersByTime(0);
        await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

        // 1. Click edit icon on 'Great Day' entry
        fireEvent.click(screen.getAllByTestId('EditIcon')[0]);
        
        // 2. Verify form is populated with existing data
        const titleInput = screen.getByPlaceholderText('Optional Title');
        const contentTextarea = screen.getByTestId('debounced-textarea');
        expect(titleInput.value).toBe('Great Day');
        expect(contentTextarea.value).toBe('Felt good today.');
        expect(screen.getByText(/#Gratitude/i)).toBeInTheDocument();

        // 3. Modify content
        fireEvent.change(contentTextarea, { target: { value: 'Felt great today, really productive.' } });
        
        // 4. Save the entry (button text changes from 'Create Entry' to 'Update Entry')
        fireEvent.click(screen.getByRole('button', { name: /Update Entry/i }));
        
        // 5. Check mock call to ensure data overwrite (same ID)
        await waitFor(() => expect(mockDataStore.save).toHaveBeenCalled());
        const savedData = mockDataStore.save.mock.calls[0][1];
        expect(savedData.length).toBe(2);
        expect(savedData[0].content).toBe('Felt great today, really productive.');
        expect(savedData[0].id).toBe('1');
    });
    
    // --- TEST 5: Mood Graph Navigation ---
    it('navigates to and from the Mood Graph View', async () => {
        render(<DailyJournal {...defaultProps} />);
        vi.advanceTimersByTime(0);
        await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

        // 1. Navigate to Graph
        fireEvent.click(screen.getByRole('button', { name: /Graph/i }));
        expect(screen.getByRole('heading', { name: /Mood Over Time/i })).toBeInTheDocument();

        // 2. Navigate Back
        fireEvent.click(screen.getByRole('button', { name: /Back to Entries/i }));
        expect(screen.getByRole('button', { name: /New Entry/i })).toBeInTheDocument();
    });
});
