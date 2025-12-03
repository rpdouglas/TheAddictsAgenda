import React, { useState, useEffect } from 'react'; 
import { BookOpenIcon, CheckCircleIcon, ClipboardListIcon, GlobeIcon, HeartIcon, StarIcon, CollectionIcon, ExclamationIcon } from '../utils/icons.jsx';

/**
 * A component that prompts the user to set their initial sobriety date.
 * This view is shown only when a user first logs in and hasn't set their date yet.
 * @param {object} props - The component's props.
 * @param {function} props.onDateSet - The callback function to execute when the date is set.
 */
export const SobrietyDataSetup = ({ onDateSet }) => {
    // State to hold the selected date from the input field, defaulting to today.
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);

    /**
     * Handles the form submission.
     * @param {object} e - The form submission event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const startDate = new Date(date);
        onDateSet(startDate);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4">Welcome!</h2>
            <p className="text-deep-charcoal/70 mb-6 text-center">Please set your sobriety start date to begin your journey.</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                    max={new Date().toISOString().split('T')[0]} // Prevent selecting a future date.
                />
                <button type="submit" className="bg-serene-teal text-white font-bold py-2 px-6 rounded-lg shadow-md hover:brightness-95 transition-colors">
                    Save and Continue
                </button>
            </form>
        </div>
    );
};

/**
 * The main dashboard component that displays the sobriety counter and navigation buttons.
 * @param {object} props - The component's props.
 * @param {function} props.onNavigate - Function to call to change the active view in the app.
 * @param {Date} props.sobrietyStartDate - The user's sobriety start date.
 * @param {object} props.deferredPrompt - The event for the PWA installation prompt.
 * @param {function} props.onInstallPWA - The function to call to trigger the PWA installation.
 * @param {string} props.headerText - The custom header text for the sobriety counter. 
 * @param {boolean} props.hasMadeJournalEntryToday - Whether the user has made a journal entry today.
 */
export const Dashboard = ({ onNavigate, sobrietyStartDate, deferredPrompt, onInstallPWA, headerText, hasMadeJournalEntryToday }) => { 
    
    /**
     * Calculates the sobriety duration in Days, Hours, Minutes, and Seconds.
     * @param {Date} startDate - The date when sobriety began.
     * @returns {object} An object containing the total days, hours, minutes, and seconds.
     */
    const calculateSobrietyDuration = (startDate) => {
        if (!startDate || isNaN(startDate.getTime())) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const now = new Date();
        // Calculate the difference in milliseconds
        const diffInMs = now.getTime() - startDate.getTime();

        // Convert milliseconds to total seconds
        const totalSeconds = Math.floor(diffInMs / 1000);

        // Calculate D/H/M/S breakdown
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const hours = Math.floor(totalSeconds / (60 * 60)) % 24;
        const days = Math.floor(totalSeconds / (60 * 60 * 24));

        return { days, hours, minutes, seconds };
    };

    // Initialize state with the current duration
    const [duration, setDuration] = useState(calculateSobrietyDuration(sobrietyStartDate));

    // Effect to update the counter every second for a real-time display
    useEffect(() => {
        if (sobrietyStartDate && !isNaN(sobrietyStartDate.getTime())) {
            const timerId = setInterval(() => {
                setDuration(calculateSobrietyDuration(sobrietyStartDate));
            }, 1000);

            // Cleanup function to clear the interval when the component unmounts or state changes
            return () => clearInterval(timerId);
        }
    }, [sobrietyStartDate]);

    // Defines the navigation buttons on the dashboard.
    const buttons = [
        {
            label: 'Daily Readings',
            icon: <BookOpenIcon className="w-8 h-8" />,
            view: 'daily-readings',
            color: 'teal'
        },
        {
            label: 'Journal',
            icon: <ClipboardListIcon className="w-8 h-8" />,
            view: 'journal',
            color: 'blue'
        },
        {
            label: 'To-Do List',
            icon: <CheckCircleIcon className="w-8 h-8" />,
            view: 'goals',
            color: 'yellow'
        },
        {
            label: '90-Day Challenge',
            icon: <CheckCircleIcon className="w-8 h-8" />,
            view: 'challenge',
            color: 'green'
        },
        {
            label: 'Coping Tools',
            icon: <HeartIcon className="w-8 h-8" />,
            view: 'coping-tools',
            color: 'red'
        },
        {
            label: 'Meeting Finder',
            icon: <GlobeIcon className="w-8 h-8" />,
            view: 'finder',
            color: 'purple'
        },
        {
            label: 'Recovery Literature',
            icon: <BookOpenIcon className="w-8 h-8" />,
            view: 'literature',
            color: 'indigo'
        },
        {
            label: 'Recovery Workbook',
            icon: <CollectionIcon className="w-8 h-8" />,
            view: 'workbook',
            color: 'pink'
        },
    ];

    // Maps button colors to TailwindCSS classes for dynamic styling.
    const colorVariants = {
        teal: 'bg-serene-teal/10 text-serene-teal',
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-hopeful-coral/10 text-hopeful-coral',
        purple: 'bg-purple-100 text-purple-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        pink: 'bg-pink-100 text-pink-600',
    };

    return (
        <div className="p-4 animate-fade-in">
            {/* Sobriety Counter Display */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-sm font-semibold text-deep-charcoal/60 uppercase tracking-wider">{headerText}</h2>
                <div className="flex flex-wrap justify-center space-x-4 mt-4">
                    
                    {/* Display Days */}
                    <div className="flex flex-col items-center min-w-[70px] mb-2">
                        <span className="text-4xl font-bold text-serene-teal">{duration.days}</span>
                        <span className="text-sm text-deep-charcoal/80 mt-1"> {duration.days === 1 ? 'Day' : 'Days'}</span>
                    </div>

                    {/* Display Hours (padded with a leading zero if < 10) */}
                    <div className="flex flex-col items-center min-w-[70px] mb-2">
                        <span className="text-4xl font-bold text-serene-teal">{duration.hours.toString().padStart(2, '0')}</span>
                        <span className="text-sm text-deep-charcoal/80 mt-1">Hours</span>
                    </div>

                    {/* Display Minutes (padded with a leading zero if < 10) */}
                    <div className="flex flex-col items-center min-w-[70px] mb-2">
                        <span className="text-4xl font-bold text-serene-teal">{duration.minutes.toString().padStart(2, '0')}</span>
                        <span className="text-sm text-deep-charcoal/80 mt-1">Minutes</span>
                    </div>

                    {/* Display Seconds (padded with a leading zero if < 10) */}
                    <div className="flex flex-col items-center min-w-[70px] mb-2">
                        <span className="text-4xl font-bold text-serene-teal">{duration.seconds.toString().padStart(2, '0')}</span>
                        <span className="text-sm text-deep-charcoal/80 mt-1">Seconds</span>
                    </div>
                </div>
            </div>

            {/* PWA Installation Button */}
            {deferredPrompt && (
                <div className="mt-4">
                    <button 
                        onClick={onInstallPWA}
                        className="w-full bg-serene-teal text-white font-bold py-3 px-4 rounded-lg shadow-md hover:brightness-95 transition-colors"
                    >
                        Install App to Home Screen
                    </button>
                </div>
            )}

            {/* Grid of Navigation Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {buttons.map((button) => (
                    <button
                        key={button.view}
                        onClick={() => onNavigate(button.view)}
                        className={`relative p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-shadow ${colorVariants[button.color] || 'bg-gray-100 text-gray-800'}`}
                    >
                        {button.view === 'journal' && !hasMadeJournalEntryToday && (
                            <div className="absolute top-1 right-1">
                                <div className="relative group">
                                    <ExclamationIcon className="w-6 h-6 text-red-500" />
                                    <div className="absolute bottom-full mb-2 right-0 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        You have not made a journal entry today
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mb-2">
                            {button.icon}
                        </div>
                        <span className="font-semibold text-sm">{button.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};