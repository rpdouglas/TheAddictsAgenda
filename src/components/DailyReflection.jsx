// src/components/DailyReflection.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, CalendarIcon, PenIcon, ShareIcon } from '../utils/icons.jsx'; // Import ShareIcon
import dailyReflections from '../data/daily_reflections.json'; //

// --- Use Local Data ---
const getDailyReflection = (date) => {
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const day = date.getDate();
    const key = `${month} ${day}`;
    const reflectionData = dailyReflections[key]; //

    if (reflectionData) {
        return {
            ...reflectionData,
            source: reflectionData.source || 'Alcoholics Anonymous'
        };
    }
    return getFallbackReflection();
};

const getFallbackReflection = () => ({
    title: "The Serenity Prayer",
    quote: "God grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference.",
    source: "Reinhold Niebuhr / Commonly used in A.A."
});

const DailyReflection = ({ onBack, onJournal }) => {
    const today = new Date();
    const [selectedDateString, setSelectedDateString] = useState(today.toISOString().split('T')[0]);
    const [reflection, setReflection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(''); // State for clipboard copy confirmation

    const loadReflection = useCallback((dateString) => {
        setIsLoading(true);
        setTimeout(() => {
            const dateObj = new Date(dateString + 'T00:00:00');
            const data = getDailyReflection(dateObj);
            setReflection(data);
            setIsLoading(false);
        }, 0);
    }, []);

    useEffect(() => {
        loadReflection(selectedDateString);
    }, [selectedDateString, loadReflection]);

    const handleDateChange = (e) => {
        setSelectedDateString(e.target.value);
    };

    const handleJournalClick = () => {
        if (reflection) {
            onJournal(reflection);
        }
    };

    const handleShare = async () => {
        if (!reflection) return;

        const shareTitle = `Daily Reflection: ${reflection.title}`;
        const shareText = `${reflection.quote}\n\n- From The Addict's Agenda`;
        
        if (navigator.share) { // Use Web Share API if available
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else { // Fallback to copying to clipboard
            try {
                await navigator.clipboard.writeText(`${shareTitle}\n\n${shareText}`);
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
            } catch (error) {
                setCopySuccess('Failed to copy');
                 setTimeout(() => setCopySuccess(''), 2000);
            }
        }
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
            
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <label htmlFor="reflection-date" className="text-sm font-medium text-deep-charcoal/80">Select Date:</label>
                    <input
                        id="reflection-date"
                        type="date"
                        value={selectedDateString}
                        onChange={handleDateChange}
                        className="w-full sm:w-auto p-2 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                {/* --- MODIFIED SECTION --- */}
                <div className="flex items-center gap-2">
                     {copySuccess && <span className="text-sm font-semibold text-serene-teal">{copySuccess}</span>}
                     <button
                        onClick={handleShare}
                        disabled={isLoading || !reflection}
                        className="flex items-center justify-center gap-1.5 bg-white border border-light-stone text-deep-charcoal/80 font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-soft-linen transition-colors disabled:opacity-50"
                        title="Share this reflection"
                    >
                        <ShareIcon className="w-5 h-5" /> Share
                    </button>
                    <button
                        onClick={handleJournalClick}
                        disabled={isLoading || !reflection}
                        className="flex items-center justify-center gap-1.5 bg-white border border-light-stone text-serene-teal font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-soft-linen transition-colors disabled:opacity-50"
                    >
                        <PenIcon className="w-5 h-5" /> Journal
                    </button>
                </div>
                 {/* --- END MODIFIED SECTION --- */}
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 flex flex-col">
                {isLoading ? (
                    <Spinner />
                ) : reflection ? (
                    <div className="flex-grow space-y-4">
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