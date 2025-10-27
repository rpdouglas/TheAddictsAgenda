import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App.jsx';
import { AuthProvider, useAuth } from '../AuthContext.jsx';
import DataStore from '../utils/dataStore.js';

// --- Mocks ---

vi.mock('../AuthContext.jsx', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock('../utils/dataStore.js', () => ({
  default: {
    setStorageEngine: vi.fn(),
    load: vi.fn(),
    save: vi.fn(),
    KEYS: {
      SOBRIETY: 'recovery_sobriety_date',
      WELCOME_TIP: 'recovery_welcome_tip_dismissed',
      PIN: 'recovery_app_pin',
    },
  },
}));

vi.mock('../components/Dashboard.jsx', () => ({
  Dashboard: ({ onNavigate }) => <div data-testid="dashboard">Dashboard<button onClick={() => onNavigate('journal')}>Go Journal</button></div>,
  SobrietyDataSetup: ({ onDateSet }) => <div data-testid="setup">Setup<button onClick={() => onDateSet(new Date())}>Set Date</button></div>,
}));
vi.mock('../components/Login.jsx', () => ({
  default: () => <div data-testid="login">Login</div>,
}));
vi.mock('../components/DailyJournal.jsx', () => ({
  default: () => <div data-testid="journal">Journal</div>,
}));

// --- Tests ---

describe('App Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    DataStore.load.mockResolvedValue(null);
  });

  // --- FIX: Make the test async ---
  it('renders the Login component when user is not authenticated', async () => {
    useAuth.mockReturnValue({ session: null, loading: false });

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // --- FIX: Wait for the component to render after auth check ---
    await waitFor(() => {
        expect(screen.getByTestId('login')).toBeInTheDocument();
    });
  });

  // --- FIX: Test is already async, ensure waitFor is robust ---
  it('renders the SobrietyDataSetup component when authenticated but sobriety date is not set', async () => {
    useAuth.mockReturnValue({ session: { user: { uid: 'test-user' }, type: 'firebase' }, loading: false });
    DataStore.load.mockResolvedValue(null);

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Wait specifically for the setup component
    await waitFor(() => {
      expect(screen.getByTestId('setup')).toBeInTheDocument();
    });
  });

  // --- FIX: Test is already async, ensure waitFor is robust ---
  it('renders the Dashboard component when authenticated and sobriety date is set', async () => {
    useAuth.mockReturnValue({ session: { user: { uid: 'test-user' }, type: 'firebase' }, loading: false });
    DataStore.load.mockResolvedValue(new Date().toISOString());

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Wait specifically for the dashboard component
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });
     expect(screen.getByText("The Addict's Agenda")).toBeInTheDocument();
  });

  // --- FIX: Test is already async, ensure waitFor is robust ---
  it('navigates to a different view when a dashboard button is clicked', async () => {
    useAuth.mockReturnValue({ session: { user: { uid: 'test-user' }, type: 'firebase' }, loading: false });
    DataStore.load.mockResolvedValue(new Date().toISOString());

    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );

    // Wait for the dashboard to render first
    await waitFor(() => {
      expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    });

    const journalButton = screen.getByRole('button', { name: 'Go Journal' });
    fireEvent.click(journalButton);

    // Wait for the journal component to appear
    await waitFor(() => {
        expect(screen.getByTestId('journal')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
  });

});

