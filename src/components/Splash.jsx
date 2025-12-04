// src/components/Splash.jsx
import React from 'react';
// Import the logo image - Make sure your file is at src/assets/logo.png
import logoImage from '../assets/logo.png';
// Removed ShieldIcon from imports
import { BookOpenIcon, HeartIcon, CheckCircleIcon } from '../utils/icons.jsx';

const Splash = ({ onGetStarted, onLogin }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col">
            {/* --- Hero Section --- */}
            <header className="px-6 py-10 flex flex-col items-center text-center">
                
                {/* REPLACE SHIELD ICON WITH LOGO IMAGE */}
                <img 
                    src={logoImage} 
                    alt="My Recovery Toolkit Logo" 
                    className="w-32 h-auto mb-6 object-contain" // Adjust w-32 as needed for your specific logo size
                />
                
                <h1 className="text-4xl font-bold text-gray-800 mb-4">My Recovery Toolkit</h1>
                <p className="text-lg text-gray-600 max-w-md mb-8 leading-relaxed">
                    Your private, all-in-one companion for sobriety. Journal, track your progress, and work the steps—all in one secure place.
                </p>
                
                <div className="flex flex-col w-full max-w-xs gap-3">
                    <button 
                        onClick={onGetStarted}
                        className="w-full bg-teal-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-transform transform active:scale-95"
                    >
                        Get Started
                    </button>
                    <button 
                        onClick={onLogin}
                        className="w-full bg-white text-teal-700 font-bold py-3.5 px-6 rounded-xl border border-teal-100 shadow-sm hover:bg-teal-50 transition-colors"
                    >
                        I already have an account
                    </button>
                </div>
            </header>

            {/* --- Feature Showcase --- */}
            <section className="flex-grow px-6 py-8 bg-white rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 text-center">Everything you need</h2>
                
                <div className="grid gap-6 max-w-md mx-auto">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><BookOpenIcon className="w-6 h-6"/></div>
                        <div>
                            <h3 className="font-bold text-gray-800">Daily Journaling</h3>
                            <p className="text-sm text-gray-600">Track your mood and spot patterns with AI insights.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><CheckCircleIcon className="w-6 h-6"/></div>
                        <div>
                            <h3 className="font-bold text-gray-800">Sobriety Counter</h3>
                            <p className="text-sm text-gray-600">Visualize your progress down to the second.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-pink-100 p-2 rounded-lg text-pink-600"><HeartIcon className="w-6 h-6"/></div>
                        <div>
                            <h3 className="font-bold text-gray-800">Recovery Workbooks</h3>
                            <p className="text-sm text-gray-600">Integrated 12-Step, Dharma, and SMART tools.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Footer / Store Badges --- */}
            <footer className="px-6 py-8 bg-gray-50 text-center border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">Available on all devices</p>
                <div className="flex justify-center gap-4 opacity-60">
                    {/* Placeholders for Store Badges */}
                    <div className="h-10 w-32 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold cursor-not-allowed">
                        App Store
                    </div>
                    <div className="h-10 w-32 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold cursor-not-allowed">
                        Google Play
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-6">© {new Date().getFullYear()} My Recovery Toolkit</p>
            </footer>
        </div>
    );
};

export default Splash;