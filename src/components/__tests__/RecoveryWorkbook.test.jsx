import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RecoveryWorkbook from '../RecoveryWorkbook.jsx';
import DataStore from '../../utils/dataStore.js';
import { workbookData } from '../../utils/data.js';

// --- Mocks ---

vi.mock('../../utils/dataStore.js', () => ({
  default: {
    load: vi.fn(),
    save: vi.fn(),
    KEYS: {
      WORKBOOK: 'recovery_workbook_responses',
    },
  },
}));

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
    vi.clearAllMocks();
    DataStore.load.mockResolvedValue(mockWorkbookResponses);
  });

  it('should render the main workbook categories and overall progress', async () => {
    render(<RecoveryWorkbook />);
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Recovery Workbook')).toBeInTheDocument();
    expect(screen.getByText('General Recovery Exercises')).toBeInTheDocument();
  });

  it('should navigate to a category view when a category is clicked', async () => {
    render(<RecoveryWorkbook />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText('12-Step Workbook'));
    expect(await screen.findByText('Step 1: Honesty')).toBeInTheDocument();
  });

  it('should navigate to a topic view and display its questions', async () => {
    render(<RecoveryWorkbook />);
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());
    fireEvent.click(screen.getByText('12-Step Workbook'));
    const step1Button = await screen.findByText('Step 1: Honesty');
    fireEvent.click(step1Button);
    expect(await screen.findByText(/We admitted we were powerless/)).toBeInTheDocument();
  });
});