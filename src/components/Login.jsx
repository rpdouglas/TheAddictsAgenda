// src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { ArrowLeftIcon } from '../utils/icons.jsx';
import { auth, googleProvider, facebookProvider } from '../firebase.jsx';
import { signInWithPopup } from 'firebase/auth';

const Login = ({ onBack }) => {
    // Destructure 'loginLocally' instead of 'guestLogin'
    const { login, loginLocally, signup } = useAuth(); 
    
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignup) {
                await signup(email, password);
            } else {
                await login(email, password);
            }
        } catch (err) {
            setError('Failed to ' + (isSignup ? 'create account' : 'log in') + ': ' + err.message);
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Error signing in with Google:", err.message);
            setError(`Google Sign-In Error: ${err.message}`);
        }
    };

    const handleFacebookSignIn = async () => {
        setError('');
        try {
            await signInWithPopup(auth, facebookProvider);
        } catch (err) {
            console.error("Error signing in with Facebook:", err.message);
            setError(`Facebook Sign-In Error: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                
                {/* Back Button */}
                <button 
                    onClick={onBack}
                    className="flex items-center text-gray-500 hover:text-teal-600 font-semibold mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-1" /> Back
                </button>

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            id="email" 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                            id="password" 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors" 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button 
                        className="text-sm text-teal-600 hover:text-teal-800"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or sign in with</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={handleGoogleSignIn} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                        Sign in with Google
                    </button>
                    <button onClick={handleFacebookSignIn} className="w-full bg-blue-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center">
                        Sign in with Facebook
                    </button>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue locally</span>
                    </div>
                </div>

                <button 
                    onClick={loginLocally}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                    Continue as Guest
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                    Guest data is stored only on this device.
                </p>
            </div>
        </div>
    );
};

export default Login;