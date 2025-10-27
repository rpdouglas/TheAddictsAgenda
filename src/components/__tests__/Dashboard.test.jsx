import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from '../Dashboard.jsx';
import DataStore from '../../utils/dataStore.js';

// Mock the onNavigate function and other props
const mockOnNavigate = vi.fn();
const sobrietyStartDate = new Date('2023-01-01');

// Mock the DataStore to control its async behavior
vi.mock('../../utils/dataStore.js', () => ({
  default: {
    load: vi.fn().mockResolvedValue(true), // Assume tip is dismissed
    KEYS: {
      WELCOME_TIP: 'recovery_welcome_tip_dismissed',
    },
  },
}));

describe('Dashboard Component', () => {
  it('renders the sobriety tracker and menu items', async () => {
    render(<Dashboard onNavigate={mockOnNavigate} sobrietyStartDate={sobrietyStartDate} />);

    // --- FIX ---
    // By using `await waitFor`, we tell the test to wait until the asynchronous
    // useEffect hook in the Dashboard component has finished updating the state.
    await waitFor(() => {
      // Check for an element that appears after the loading is done.
      expect(screen.getByText('Daily Journal')).toBeInTheDocument();
    });

    // Now we can safely assert the rest of the content
    expect(screen.getByText('My Goals')).toBeInTheDocument();
    expect(screen.getByText('Coping Tools')).toBeInTheDocument();
    expect(screen.getByText('You are on your path')).toBeInTheDocument();
  });
});