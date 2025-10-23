import React from 'react';
import { signInWithRedirect } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from '../firebase.jsx';
import { BookOpenIcon } from '../utils/icons.jsx';

const Login = () => {
    const handleGoogleSignIn = async () => {
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert(`Google Sign-In Error: ${error.message}`);
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            await signInWithRedirect(auth, facebookProvider);
        } catch (error) {
            console.error("Error signing in with Facebook:", error.message);
            alert(`Facebook Sign-In Error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center space-y-6">
                <BookOpenIcon className="w-12 h-12 mx-auto text-teal-600" />
                <h1 className="text-3xl font-bold text-gray-800">The Addict's Agenda</h1>
                <p className="text-gray-600">Sign in to begin your recovery journey.</p>
                <div className="space-y-4 pt-4">
                    <button onClick={handleGoogleSignIn} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        Sign in with Google
                    </button>
                    <button onClick={handleFacebookSignIn} className="w-full bg-blue-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors">
                        Sign in with Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;