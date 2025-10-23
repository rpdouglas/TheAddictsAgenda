import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase.jsx';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to start a local session
    const loginLocally = () => {
        const localUser = {
            uid: 'localUser',
            displayName: 'Guest',
        };
        setSession({ user: localUser, type: 'local' });
    };

    const logout = async () => {
        if (session?.type === 'firebase') {
            // This will trigger the onAuthStateChanged listener, which will handle setting the session to null
            await signOut(auth);
        } else {
            // For local sessions, we manually clear the session state
            setSession(null);
        }
    };

    // This effect runs ONLY ONCE when the component mounts
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                // If a Firebase user is authenticated, set the session type to 'firebase'
                setSession({ user, type: 'firebase' });
            } else {
                // This callback handles the absence of a Firebase user.
                // We only clear the session if it was previously a 'firebase' session (i.e., a logout).
                // This prevents a 'local' session from being cleared on page load.
                setSession(currentSession => 
                    currentSession?.type === 'firebase' ? null : currentSession
                );
            }
            setLoading(false);
        });
        
        // Cleanup the subscription when the component unmounts
        return unsubscribe;
    }, []); // The empty dependency array is critical to prevent loops

    const value = { session, loginLocally, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}