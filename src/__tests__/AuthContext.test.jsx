import React from 'react';
// --- FIX: Add fireEvent to the import ---
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext.jsx';
import { onAuthStateChanged, signOut } from "firebase/auth";

// --- Mocks ---

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  FacebookAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}));

const TestComponent = () => {
  const { session, loading, loginLocally, logout } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="session-type">{session?.type || 'null'}</div>
      <div data-testid="user-id">{session?.user?.uid || 'null'}</div>
      <button onClick={loginLocally}>Login Locally</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// --- Tests ---

describe('AuthProvider', () => {
  let authStateCallback = null;

  beforeEach(() => {
    vi.clearAllMocks();
    onAuthStateChanged.mockImplementation((auth, callback) => {
      authStateCallback = callback;
      return vi.fn();
    });
    signOut.mockResolvedValue(undefined);
  });

  afterEach(() => {
    authStateCallback = null;
  });

  it('should initially be in a loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('session-type')).toHaveTextContent('null');
  });

  it('should update state when Firebase auth state changes (no user)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      authStateCallback(null);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('session-type')).toHaveTextContent('null');
    expect(screen.getByTestId('user-id')).toHaveTextContent('null');
  });

  it('should update state when Firebase auth state changes (user logged in)', async () => {
    const mockUser = { uid: 'firebase-user-123', displayName: 'Firebase User' };
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      authStateCallback(mockUser);
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('session-type')).toHaveTextContent('firebase');
    expect(screen.getByTestId('user-id')).toHaveTextContent('firebase-user-123');
  });

  it('should handle local login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      authStateCallback(null);
    });
    await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    const loginButton = screen.getByRole('button', { name: 'Login Locally' });
    act(() => {
        fireEvent.click(loginButton); // fireEvent is now defined
    });

    expect(screen.getByTestId('session-type')).toHaveTextContent('local');
    expect(screen.getByTestId('user-id')).toHaveTextContent('localUser');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('should handle logout for a Firebase session', async () => {
    const mockUser = { uid: 'firebase-user-123' };
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      authStateCallback(mockUser);
    });
    await waitFor(() => {
        expect(screen.getByTestId('session-type')).toHaveTextContent('firebase');
    });

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    await act(async () => {
        fireEvent.click(logoutButton); // fireEvent is now defined
    });

    expect(signOut).toHaveBeenCalledTimes(1);
     act(() => {
       authStateCallback(null);
     });
    
     await waitFor(() => {
       expect(screen.getByTestId('session-type')).toHaveTextContent('null');
     });
  });

  it('should handle logout for a local session', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

     act(() => {
       authStateCallback(null);
     });
     await waitFor(() => {
       expect(screen.getByTestId('loading')).toHaveTextContent('false');
     });

    const loginButton = screen.getByRole('button', { name: 'Login Locally' });
     act(() => {
        fireEvent.click(loginButton); // fireEvent is now defined
     });
    expect(screen.getByTestId('session-type')).toHaveTextContent('local');

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
     act(() => {
        fireEvent.click(logoutButton); // fireEvent is now defined
     });

    expect(signOut).not.toHaveBeenCalled();
    expect(screen.getByTestId('session-type')).toHaveTextContent('null');
    expect(screen.getByTestId('user-id')).toHaveTextContent('null');
  });

});

