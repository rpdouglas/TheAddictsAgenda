import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, CalendarIcon } from '../utils/icons.jsx';

// Placeholder/Mock API logic for fetching the daily reflection
// In a real app, this would call a secure, date-specific endpoint.
const fetchDailyReflection = async (date) => {
    // Format date as MM-DD (or use a consistent format for the mock)
    const dateKey = `${date.getMonth() + 1}-${date.getDate()}`;

    // --- Mock Data Structure ---
    const mockData = {
        '10-22': {
            title: "A NEW FREEDOM",
            quote: "With the self-discipline and insight gained from practicing Step Ten, I begin to know the gratifications of sobriety — not as mere abstinence from alcohol, but as recovery in every department of my life. I renew hope, regenerate faith, and regain the dignity of self-respect. I discover the word \"and\" in the phrase \"and when we were wrong, promptly admitted it.\" Reassured that I am no longer always wrong, I learn to accept myself as I am, with a new sense of the miracles of sobriety and serenity.",
            source: "DAILY REFLECTIONS, p. 10"
        },
        '1-1': {
            title: "A FRESH START",
            quote: "Happy New Year! For a long time, the only time I felt happiness was when I was drinking. Now, thanks to the help of my Higher Power and A.A., I can look forward to a whole new year of joyful sobriety. I must practice these principles in all my affairs and remember that this is a daily program. Today, I am grateful for the chance to be of service and for a clean slate to begin anew.",
            source: "MOCK REFLECTION, NEW YEAR"
        }
        // ... more dates could be added here
    };
    
    // Fallback reflection (Serenity Prayer)
    const fallback = {
        title: "The Serenity Prayer",
        quote: "God grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.",
        source: "Reinhold Niebuhr / Commonly used in A.A."
    };

    return new Promise(resolve => {
        setTimeout(() => {
            if (mockData[dateKey]) {
                resolve(mockData[dateKey]);
            } else {
                resolve(fallback);
            }
        }, 500); // Simulate network delay
    });
};

export const DailyReflection = ({ onBack }) => {
    const today = new Date();
    // Ensure date input default value is formatted as YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
    const [reflection, setReflection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadReflection = useCallback(async (dateString) => {
        setIsLoading(true);
        const dateObj = new Date(dateString);
        const data = await fetchDailyReflection(dateObj);
        setReflection(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadReflection(selectedDate);
    }, [selectedDate, loadReflection]);

    // Helper to format the reflection text (split by double newline for paragraphs)
    const formatContent = (content) => content.split('\n\n').map((paragraph, index) => (
        <p key={index} className="mb-4 whitespace-pre-wrap">{paragraph.trim()}</p>
    ));
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>
            
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4 flex-shrink-0 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6"/> Daily Reflection
            </h2>
            
            {/* Date Selector */}
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
                <label htmlFor="reflection-date" className="text-sm font-medium text-deep-charcoal/80">Select Date:</label>
                <input
                    id="reflection-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto p-2 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                />
            </div>

            {/* Reflection Content */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading ? (
                    <Spinner />
                ) : reflection ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-serene-teal/10 rounded-lg border-l-4 border-serene-teal">
                            <h3 className="text-xl font-bold text-serene-teal mb-2">{reflection.title}</h3>
                            <div className="text-deep-charcoal/80">
                                {formatContent(reflection.quote)}
                            </div>
                            <p className="text-xs text-deep-charcoal/60 pt-2 border-t mt-4">Source: {reflection.source}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-deep-charcoal/60">Could not load reflection for this date.</p>
                )}
            </div>
        </div>
    );
};