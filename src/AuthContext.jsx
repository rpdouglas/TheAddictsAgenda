// src/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from './firebase.jsx'; // Import the initialized auth instance
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth'; // Import SDK functions directly

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Guest Mode Logic
    const loginLocally = () => {
        // Sets a local-only session object
        const guestUser = { 
            uid: 'guest', 
            email: null, 
            displayName: 'Guest User',
            type: 'local' // Used by DataStore to select LocalStorage
        };
        setSession(guestUser);
        localStorage.setItem('isGuest', 'true');
    };

    // Email/Password Login
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Email/Password Signup
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setSession(null);
            localStorage.removeItem('isGuest');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    useEffect(() => {
        // Check for guest flag first
        const isGuest = localStorage.getItem('isGuest');
        if (isGuest === 'true') {
            setSession({ uid: 'guest', displayName: 'Guest User', type: 'local' });
            setLoading(false);
            // Even if guest, we still listen to Firebase in case they sign in on top
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Firebase User overrides Guest User
                setSession({ ...user, type: 'firebase' });
                localStorage.removeItem('isGuest'); // Clear guest flag if real auth happens
            } else if (!isGuest) {
                // Only clear session if we weren't already in guest mode
                setSession(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        session,
        loading,
        loginLocally, 
        login,        
        signup,       
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};