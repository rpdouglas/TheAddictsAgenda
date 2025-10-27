import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Settings from '../Settings.jsx';
import DataStore from '../../utils/dataStore.js';

// --- Mocks ---

vi.mock('../../utils/dataStore.js', () => ({
  default: {
    load: vi.fn(),
    save: vi.fn(),
    loadAll: vi.fn(),
    KEYS: {
      PIN: 'recovery_app_pin',
    },
  },
}));

vi.mock('../common.jsx', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// --- Tests ---

describe('Settings Component', () => {
  const mockOnBack = vi.fn();
  const mockOnLogout = vi.fn();
  const mockHandleSobrietyDateUpdate = vi.fn();
  const startDate = new Date('2023-01-01T00:00:00.000Z');

  beforeEach(() => {
    vi.clearAllMocks();
    DataStore.load.mockResolvedValue(null);
  });

  it('renders the settings page with the current sobriety date', async () => {
    render(
      <Settings
        currentStartDate={startDate}
        handleSobrietyDateUpdate={mockHandleSobrietyDateUpdate}
        onBack={mockOnBack}
        onLogout={mockOnLogout}
      />
    );
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Settings')).toBeInTheDocument();
    // --- FIX: Target the input by its initial display value ---
    expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
  });

  it('calls handleSobrietyDateUpdate when the date is changed and saved', async () => {
    render(
      <Settings
        currentStartDate={startDate}
        handleSobrietyDateUpdate={mockHandleSobrietyDateUpdate}
        onBack={mockOnBack}
        onLogout={mockOnLogout}
      />
    );
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

    // --- FIX: Target the input by its initial display value ---
    const dateInput = screen.getByDisplayValue('2023-01-01');
    const updateButton = screen.getByRole('button', { name: 'Update Date' });

    fireEvent.change(dateInput, { target: { value: '2023-02-15' } });
    fireEvent.click(updateButton);

    expect(mockHandleSobrietyDateUpdate).toHaveBeenCalledWith(
      new Date('2023-02-15T00:00:00.000Z'),
      false
    );
    expect(await screen.findByText('Date Updated!')).toBeInTheDocument();
  });

  it('allows a user to set a new PIN', async () => {
    render(
      <Settings
        currentStartDate={startDate}
        handleSobrietyDateUpdate={mockHandleSobrietyDateUpdate}
        onBack={mockOnBack}
        onLogout={mockOnLogout}
      />
    );
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

    const pinInput = screen.getByPlaceholderText('Set new PIN (4+ digits)');
    const confirmPinInput = screen.getByPlaceholderText('Confirm new PIN');
    const setPinButton = screen.getByRole('button', { name: 'Set PIN Lock' });

    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.change(confirmPinInput, { target: { value: '1234' } });
    
    expect(setPinButton).not.toBeDisabled();
    fireEvent.click(setPinButton);

    await waitFor(() => {
      expect(DataStore.save).toHaveBeenCalledWith(DataStore.KEYS.PIN, '1234');
    });

    expect(await screen.findByText(/Application lock PIN saved!/)).toBeInTheDocument();
  });

  it('calls the onLogout function when the logout button is clicked', async () => {
    render(
      <Settings
        currentStartDate={startDate}
        handleSobrietyDateUpdate={mockHandleSobrietyDateUpdate}
        onBack={mockOnBack}
        onLogout={mockOnLogout}
      />
    );
    await waitFor(() => expect(screen.queryByTestId('spinner')).not.toBeInTheDocument());

    const logoutButton = screen.getByRole('button', { name: 'Log Out' });
    fireEvent.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});