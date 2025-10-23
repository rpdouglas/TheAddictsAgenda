import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import { auth } from './firebase.jsx';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (user) {
                setCurrentUser(user);
                setLoading(false);
            } else {
                try {
                    const result = await getRedirectResult(auth);
                    if (result) {
                        setCurrentUser(result.user);
                    }
                } catch (error) {
                    console.error("Error handling redirect result:", error.message);
                } finally {
                    setLoading(false);
                }
            }
        });
        return unsubscribe;
    }, []);

    const value = { currentUser, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}