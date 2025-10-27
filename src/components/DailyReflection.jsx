import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, CalendarIcon } from '../utils/icons.jsx';

// --- Live Data Fetching using a reliable public API ---
const fetchDailyReflection = async (date) => {
    // --- FIX #1: Correct Date Formatting ---
    // The API requires the format "M/D/YYYY" without leading zeros.
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;

    const url = `https://www.steps-app.com/api/v1/readings/daily-reflection?date=${formattedDate}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        
        const { title, text, source } = data.reading;

        if (title && text && source) {
            return { title, quote: text, source };
        } else {
            return getFallbackReflection();
        }
    } catch (error) {
        console.error("Failed to fetch daily reflection for date:", formattedDate, error);
        return getFallbackReflection();
    }
};

const getFallbackReflection = () => ({
    title: "The Serenity Prayer",
    quote: "God grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.",
    source: "Reinhold Niebuhr / Commonly used in A.A."
});

const DailyReflection = ({ onBack }) => {
    const today = new Date();
    // Use the full ISO string for the input value
    const [selectedDateString, setSelectedDateString] = useState(today.toISOString().split('T')[0]);
    const [reflection, setReflection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadReflection = useCallback(async (dateString) => {
        setIsLoading(true);
        // Create the date object from the string to ensure it's in the local timezone
        const dateObj = new Date(dateString + 'T00:00:00');
        const data = await fetchDailyReflection(dateObj);
        setReflection(data);
        setIsLoading(false);
    }, []);

    // --- FIX #2: useEffect Dependency ---
    // Now it depends on the date *string*, so it will re-run even if the date object is the same.
    useEffect(() => {
        loadReflection(selectedDateString);
    }, [selectedDateString, loadReflection]);

    const handleDateChange = (e) => {
        setSelectedDateString(e.target.value);
    };
    
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
            
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
                <label htmlFor="reflection-date" className="text-sm font-medium text-deep-charcoal/80">Select Date:</label>
                <input
                    id="reflection-date"
                    type="date"
                    value={selectedDateString}
                    onChange={handleDateChange}
                    className="w-full sm:w-auto p-2 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                />
            </div>

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

export default DailyReflection;