// src/components/__tests__/RecoveryWorkbook.test.jsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecoveryWorkbook } from '../RecoveryWorkbook.jsx';
import DataStore from '../../utils/dataStore.js';
import { workbookData } from '../../utils/data.js'; // Using actual data for structure

// --- Mocks ---

// Mock the DataStore for controlled data handling
vi.mock('../../utils/dataStore.js', () => ({
  default: {
    load: vi.fn(),
    save: vi.fn(),
    KEYS: {
      WORKBOOK: 'recovery_workbook_responses',
    },
  },
}));

// Mock child components to isolate the RecoveryWorkbook component
vi.mock('../common.jsx', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
  };
});

// --- Test Data ---

const mockWorkbookResponses = {
  'step-1-A-1': 'Powerlessness means I cannot control my use.',
  'step-1-A-2': 'Another response for a different question.',
};

// --- Tests ---

describe('RecoveryWorkbook Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Setup the mock to return our sample responses when loaded
    DataStore.load.mockResolvedValue(mockWorkbookResponses);
  });

  it('should render the main workbook categories and overall progress', async () => {
    render(<RecoveryWorkbook />);

    // Wait for the component to finish loading data
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    // Check that the main title and category titles are visible
    expect(screen.getByText('Recovery Workbook')).toBeInTheDocument();
    expect(screen.getByText('General Recovery Exercises')).toBeInTheDocument();
    expect(screen.getByText('12-Step Workbook')).toBeInTheDocument();
    expect(screen.getByText('Recovery Dharma')).toBeInTheDocument();

    // Check if progress is displayed
    expect(screen.getByText(/Overall Progress/i)).toBeInTheDocument();
  });

  it('should navigate to a category view when a category is clicked', async () => {
    render(<RecoveryWorkbook />);
    await waitFor(() => {}); // Wait for initial load

    // Click on the "12-Step Workbook" category
    const stepWorkbookButton = screen.getByText('12-Step Workbook');
    fireEvent.click(stepWorkbookButton);

    // After clicking, we should see the topics for that category
    // findByText will wait for the new view to render
    expect(await screen.findByText('Step 1: Honesty')).toBeInTheDocument();
    expect(await screen.findByText('Step 2: Hope')).toBeInTheDocument();
    
    // The main category list should no longer be visible
    expect(screen.queryByText('General Recovery Exercises')).not.toBeInTheDocument();
  });

  it('should navigate to a topic view and display its questions', async () => {
    render(<RecoveryWorkbook />);
    await waitFor(() => {});

    // Navigate into a category first
    fireEvent.click(screen.getByText('12-Step Workbook'));

    // Now, click on a specific topic
    const step1Button = await screen.findByText('Step 1: Honesty');
    fireEvent.click(step1Button);

    // The topic view should show the step's quote and questions
    expect(await screen.findByText(/We admitted we were powerless/)).toBeInTheDocument();
    
    // Check for the collapsible section title
    expect(screen.getByText('A. The Problem of Powerlessness')).toBeInTheDocument();
  });

  it('should auto-save user input after a delay', async () => {
    // Mock timers to control the debounce/delay for saving
    vi.useFakeTimers();

    render(<RecoveryWorkbook />);
    await waitFor(() => {});

    // Navigate deep into a topic
    fireEvent.click(screen.getByText('12-Step Workbook'));
    const step1Button = await screen.findByText('Step 1: Honesty');
    fireEvent.click(step1Button);

    // Find a collapsible section and open it
    const sectionButton = await screen.findByText('A. The Problem of Powerlessness');
    fireEvent.click(sectionButton);

    // The question prompts are part of the UI, let's find the textarea associated with the first question
    const firstQuestionText = workbookData.twelveSteps.topics[0].sections[0].questions[0];
    const textarea = (await screen.findByText(firstQuestionText)).nextElementSibling;

    // Simulate typing into the textarea
    const newResponse = 'This is a new test answer.';
    fireEvent.change(textarea, { target: { value: newResponse } });

    // At this point, save should NOT have been called yet
    expect(DataStore.save).not.toHaveBeenCalled();

    // Fast-forward time past the 1500ms debounce timeout in the component
    vi.advanceTimersByTime(2000);

    // Now, we expect the save function to have been called
    await waitFor(() => {
      expect(DataStore.save).toHaveBeenCalledTimes(1);
      expect(DataStore.save).toHaveBeenCalledWith(
        DataStore.KEYS.WORKBOOK,
        expect.objectContaining({
          // The key is constructed as `stepId-sectionInitial-questionIndex`
          'step-1-A-1': newResponse
        })
      );
    });

    // Clean up timers
    vi.useRealTimers();
  });
});