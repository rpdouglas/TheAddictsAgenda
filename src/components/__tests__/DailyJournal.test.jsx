// src/components/__tests__/DailyJournal.test.jsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DailyJournal } from '../DailyJournal.jsx';
import DataStore from '../../utils/dataStore.js';

// --- Mocks ---

vi.mock('../../utils/dataStore.js', () => ({
  default: {
    load: vi.fn(),
    save: vi.fn(),
    generateId: vi.fn(() => `mock-id-${Date.now()}`),
    KEYS: {
      JOURNAL: 'recovery_journal_entries',
      JOURNAL_TAGS: 'recovery_journal_tags',
    },
  },
}));

vi.mock('../common.jsx', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    DebouncedTextarea: ({ value, onChange, ...props }) => (
      <textarea
        {...props}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="journal-textarea"
      />
    ),
  };
});

// --- Test Data ---

const mockJournalEntries = [
  { id: '1', text: 'First journal entry', timestamp: new Date('2023-10-25T10:00:00Z').toISOString(), mood: 7, tags: ['grateful'] },
  { id: '2', text: 'Second journal entry', timestamp: new Date('2023-10-24T10:00:00Z').toISOString(), mood: 5, tags: [] },
];

// --- Tests ---

describe('DailyJournal Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    DataStore.load.mockImplementation((key) => {
      if (key === DataStore.KEYS.JOURNAL) {
        return Promise.resolve(mockJournalEntries);
      }
      if (key === DataStore.KEYS.JOURNAL_TAGS) {
        return Promise.resolve(['grateful']);
      }
      return Promise.resolve([]);
    });
  });

  it('should render the list of journal entries on initial load', async () => {
    render(<DailyJournal journalTemplate="" setJournalTemplate={() => {}} />);
    expect(screen.getByText('Daily Journal')).toBeInTheDocument();
    
    // Use findByText to wait for async data loading to complete
    expect(await screen.findByText('First journal entry')).toBeInTheDocument();
    expect(await screen.findByText('Second journal entry')).toBeInTheDocument();
    
    expect(screen.getByText('Mood: 7/10')).toBeInTheDocument();
    expect(screen.getByText('grateful')).toBeInTheDocument();
  });

  it('should switch to the form view when "Add New Entry" is clicked', async () => {
    render(<DailyJournal journalTemplate="" setJournalTemplate={() => {}} />);
    await screen.findByText('First journal entry'); // Ensure list is loaded

    const addButton = screen.getByRole('button', { name: 'Add New Entry' });
    fireEvent.click(addButton);

    expect(screen.getByTestId('journal-textarea')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add New Entry' })).toBeInTheDocument();
  });

  it('should allow typing in the form and saving a new entry', async () => {
    render(<DailyJournal journalTemplate="" setJournalTemplate={() => {}} />);
    await screen.findByText('First journal entry');

    fireEvent.click(screen.getByRole('button', { name: 'Add New Entry' }));

    const textarea = screen.getByTestId('journal-textarea');
    fireEvent.change(textarea, { target: { value: 'This is a new test entry.' } });

    const saveButton = screen.getByRole('button', { name: 'Add New Entry' });
    fireEvent.click(saveButton);

    // Use waitFor to handle the async state update and save operation
    await waitFor(() => {
      expect(DataStore.save).toHaveBeenCalledWith(
        DataStore.KEYS.JOURNAL,
        expect.arrayContaining([
          expect.objectContaining({ text: 'This is a new test entry.' }),
          ...mockJournalEntries
        ])
      );
    });
  });

  it('should allow editing an existing entry', async () => {
    render(<DailyJournal journalTemplate="" setJournalTemplate={() => {}} />);
    await screen.findByText('First journal entry');

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const textarea = screen.getByDisplayValue('First journal entry');
    fireEvent.change(textarea, { target: { value: 'First journal entry has been updated.' } });

    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(DataStore.save).toHaveBeenCalledWith(
        DataStore.KEYS.JOURNAL,
        expect.arrayContaining([
          expect.objectContaining({ id: '1', text: 'First journal entry has been updated.' }),
          expect.objectContaining({ id: '2' })
        ])
      );
    });
  });
});