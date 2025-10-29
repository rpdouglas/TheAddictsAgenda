import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, CalendarIcon, PenIcon, ShareIcon } from '../utils/icons.jsx';
import justForTodayMeditations from '../data/just_for_today_meditations.json';

// --- Use Local Data ---
const getDailyMeditation = (date) => {
    const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
    const day = date.getDate();
    const key = `${month} ${day}`;
    const meditationData = justForTodayMeditations[key];

    if (meditationData) {
        return {
            ...meditationData,
            source: 'Narcotics Anonymous'
        };
    }
    return getFallbackMeditation();
};

const getFallbackMeditation = () => ({
    title: "Welcome",
    quote: "We can only keep what we have by giving it away.",
    meditation: "This is a daily meditation book written by addicts, for addicts. Please use it as a tool to support your recovery.",
    source: "Narcotics Anonymous"
});

const JustForToday = ({ onBack, onJournal }) => {
    const today = new Date();
    const [selectedDateString, setSelectedDateString] = useState(today.toISOString().split('T')[0]);
    const [meditation, setMeditation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState('');

    const loadMeditation = useCallback((dateString) => {
        setIsLoading(true);
        setTimeout(() => {
            const dateObj = new Date(dateString + 'T00:00:00');
            const data = getDailyMeditation(dateObj);
            setMeditation(data);
            setIsLoading(false);
        }, 0);
    }, []);

    useEffect(() => {
        loadMeditation(selectedDateString);
    }, [selectedDateString, loadMeditation]);

    const handleDateChange = (e) => {
        setSelectedDateString(e.target.value);
    };

    const handleJournalClick = () => {
        if (meditation) {
            onJournal(meditation);
        }
    };

    const handleShare = async () => {
        if (!meditation) return;
        const shareTitle = `Just for Today: ${meditation.title}`;
        const shareText = `"${meditation.quote}"\n\n${meditation.meditation}\n\nWhen they ask you how you did it, you tell them I did it with the help of www.myrecoverytoolkit.ca`;
        
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: shareText });
            } catch (error) { console.error('Error sharing:', error); }
        } else {
            try {
                await navigator.clipboard.writeText(`${shareTitle}\n\n${shareText}`);
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
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
            <button onClick={onBack} className="flex items-center text-hopeful-coral hover:text-hopeful-coral/80 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Daily Readings</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4 flex-shrink-0 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6"/> Just for Today
            </h2>
            
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <label htmlFor="meditation-date" className="text-sm font-medium text-deep-charcoal/80">Select Date:</label>
                    <input
                        id="meditation-date"
                        type="date"
                        value={selectedDateString}
                        onChange={handleDateChange}
                        className="w-full sm:w-auto p-2 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-coral-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                     {copySuccess && <span className="text-sm font-semibold text-hopeful-coral">{copySuccess}</span>}
                     <button onClick={handleShare} disabled={isLoading || !meditation} className="flex items-center justify-center gap-1.5 bg-white border border-light-stone text-deep-charcoal/80 font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-soft-linen transition-colors disabled:opacity-50" title="Share this meditation">
                        <ShareIcon className="w-5 h-5" /> Share
                    </button>
                    <button onClick={handleJournalClick} disabled={isLoading || !meditation} className="flex items-center justify-center gap-1.5 bg-white border border-light-stone text-hopeful-coral font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-soft-linen transition-colors disabled:opacity-50">
                        <PenIcon className="w-5 h-5" /> Journal
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 flex flex-col">
                {isLoading ? <Spinner /> : meditation ? (
                    <div className="flex-grow space-y-4">
                        <div className="p-4 bg-hopeful-coral/10 rounded-lg border-l-4 border-hopeful-coral">
                            <h3 className="text-xl font-bold text-hopeful-coral mb-2">{meditation.title}</h3>
                            <blockquote className="italic text-deep-charcoal/80 border-l-4 border-hopeful-coral/30 pl-4 my-4">
                                {formatContent(meditation.quote)}
                            </blockquote>
                            <div className="text-deep-charcoal/80">
                                {formatContent(meditation.meditation)}
                            </div>
                            <p className="text-xs text-deep-charcoal/60 pt-2 border-t mt-4">Source: {meditation.source}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-deep-charcoal/60">Could not load meditation for this date.</p>
                )}
            </div>
        </div>
    );
};

export default JustForToday;