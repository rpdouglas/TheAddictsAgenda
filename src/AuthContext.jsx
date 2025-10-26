// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase.jsx';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); // Start as true

    const loginLocally = () => {
        const localUser = { uid: 'localUser', displayName: 'Guest' };
        setSession({ user: localUser, type: 'local' });
        setLoading(false);
    };

    const logout = async () => {
        if (session?.type === 'firebase') {
            await signOut(auth);
        } else {
            setSession(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setSession({ user, type: 'firebase' });
            } else {
                setSession(null);
            }
            // This is the key: loading is set to false only AFTER
            // Firebase has confirmed the auth state for the first time.
            setLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []); // Empty array ensures this runs only once

    const value = { session, loginLocally, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}