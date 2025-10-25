import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataStore from '../utils/dataStore.js'; // UPDATED: Import the unified DataStore
import { Spinner } from './common.jsx';
import { CalendarIcon, CheckIcon, RefreshIcon, XIcon, ArrowLeftIcon, PenIcon } from '../utils/icons.jsx';

// Data storage key
const STORAGE_KEY = DataStore.KEYS.NINETY_IN_NINETY; // UPDATED: Use DataStore
const DAYS_IN_CHALLENGE = 90;

// --- Custom Confirmation Modals ---
const ResetModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-deep-charcoal">Confirm Reset</h3>
            <p className="text-deep-charcoal/70">Are you sure you want to start a new 90 in 90 challenge? Your current progress will be permanently reset.</p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-light-stone/50 text-deep-charcoal/80 font-semibold py-2 px-4 rounded-lg hover:bg-light-stone/70 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-hopeful-coral text-white font-semibold py-2 px-4 rounded-lg hover:brightness-95 transition-colors">Reset Challenge</button>
            </div>
        </div>
    </div>
);

const JournalPromptModal = ({ dateString, onConfirm, onCancel }) => (
     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-deep-charcoal">Journal About Meeting?</h3>
            <p className="text-deep-charcoal/70">Would you like to create a journal entry for the meeting on {new Date(dateString + 'T00:00:00').toLocaleDateString()}?</p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-light-stone/50 text-deep-charcoal/80 font-semibold py-2 px-4 rounded-lg hover:bg-light-stone/70 transition-colors">No Thanks</button>
                <button onClick={onConfirm} className="bg-serene-teal text-white font-semibold py-2 px-4 rounded-lg hover:brightness-95 transition-colors flex items-center gap-2">
                    <PenIcon className="w-4 h-4" /> Yes, Journal
                </button>
            </div>
        </div>
    </div>
);


export const NinetyDayChallenge = ({ onBack, onNavigate, setJournalTemplate }) => {
    const [challengeData, setChallengeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showJournalPrompt, setShowJournalPrompt] = useState(false);
    const [journalDate, setJournalDate] = useState(null);

    // --- Data Persistence (UPDATED FOR DATASTORE) ---
    const loadChallengeData = useCallback(async () => {
        setIsLoading(true);
        const stored = await DataStore.load(STORAGE_KEY); // UPDATED: Use DataStore
        if (stored && stored.startDate && stored.attendance) {
            setChallengeData({
                ...stored,
                startDate: new Date(stored.startDate)
            });
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadChallengeData();
    }, [loadChallengeData]);

    const saveChallengeData = useCallback(async (data) => {
        setChallengeData(data);
        await DataStore.save(STORAGE_KEY, { // UPDATED: Use DataStore
            ...data,
            startDate: data.startDate.toISOString()
        });
    }, []);

    // --- Logic ---
    const { currentDay, attendanceCount } = useMemo(() => {
        if (!challengeData || !challengeData.startDate) {
            return { currentDay: 0, attendanceCount: 0 };
        }
        const msInDay = 86400000;
        const start = challengeData.startDate.getTime();
        const now = new Date().getTime();
        let dayDiff = Math.floor((now - start) / msInDay) + 1;
        dayDiff = Math.max(1, Math.min(dayDiff, DAYS_IN_CHALLENGE));
        const count = Object.values(challengeData.attendance).filter(Boolean).length;
        return { currentDay: dayDiff, attendanceCount: count };
    }, [challengeData]);

    // --- Handlers (UPDATED FOR DATASTORE) ---
    const handleStartNewChallenge = async () => {
        setShowResetModal(false);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await saveChallengeData({ startDate: today, attendance: {} });
    };

    const handleToggleAttendance = async (dayIndex) => {
        if (!challengeData) return;
        
        const targetDate = new Date(challengeData.startDate);
        targetDate.setDate(targetDate.getDate() + dayIndex);
        const dateKey = targetDate.toISOString().split('T')[0];
        
        const currentAttendance = challengeData.attendance[dateKey] || false;
        const newAttendanceState = !currentAttendance;

        const updatedAttendance = { ...challengeData.attendance, [dateKey]: newAttendanceState };
        await saveChallengeData({ ...challengeData, attendance: updatedAttendance });

        if (newAttendanceState) {
            setJournalDate(dateKey);
            setShowJournalPrompt(true);
        }
    };
    
    const handleConfirmJournal = () => {
        const meetingDate = new Date(journalDate + 'T00:00:00');
        const template = `Meeting Reflection - ${meetingDate.toLocaleDateString()}:\n\nMeeting Name/Topic: \nTime: \n\nOne Big Takeaway:\n\n`;
        setJournalTemplate(template);
        onNavigate('journal');
        setShowJournalPrompt(false);
        setJournalDate(null);
    };

    const isDayPastOrToday = (dayIndex) => dayIndex < currentDay;

    const getFormattedDate = (dayIndex) => {
        if (!challengeData || !challengeData.startDate) return '';
        const date = new Date(challengeData.startDate);
        date.setDate(date.getDate() + dayIndex);
        return date.toISOString().split('T')[0];
    };

    // --- Render Functions ---
    const renderChallengeGrid = () => {
        const days = Array.from({ length: DAYS_IN_CHALLENGE }, (_, i) => {
            const dayIndex = i;
            const isAttended = challengeData.attendance[getFormattedDate(dayIndex)] || false;
            const isSelectable = isDayPastOrToday(dayIndex);
            
            return (
                <button
                    key={i}
                    onClick={() => isSelectable && handleToggleAttendance(dayIndex)}
                    disabled={!isSelectable}
                    className={`
                        flex items-center justify-center text-xs w-full aspect-square p-1 rounded-lg transition-all shadow-sm
                        ${isAttended 
                            ? 'bg-serene-teal/100 text-white hover:bg-serene-teal' 
                            : isSelectable 
                                ? 'bg-white border border-light-stone text-deep-charcoal/80 hover:bg-soft-linen' 
                                : 'bg-soft-linen text-deep-charcoal/50 cursor-default'
                        }
                    `}
                >
                    {dayIndex + 1}
                    {isAttended && <CheckIcon className="w-3 h-3 ml-0.5" />}
                </button>
            );
        });

        return (
            <div className="grid grid-cols-7 sm:grid-cols-10 gap-2 p-4 border border-light-stone/50 rounded-xl bg-pure-white/60">
                {days}
            </div>
        );
    };

    if (isLoading) return <Spinner />;

    // Initial Start Screen
    if (!challengeData || !challengeData.startDate) {
         return (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col items-center justify-center text-center">
                 <button onClick={onBack} className="absolute top-6 left-6 flex items-center text-serene-teal hover:text-serene-teal font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back</span>
                </button>
                <CalendarIcon className="w-12 h-12 text-teal-500 mb-4" />
                <h2 className="text-2xl font-bold text-deep-charcoal mb-2">90 in 90 Challenge</h2>
                <p className="text-deep-charcoal/70 mb-6">Commit to 90 meetings in 90 days. Tracking starts today.</p>
                <button 
                    onClick={handleStartNewChallenge}
                    className="bg-serene-teal text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95 transition-colors flex items-center gap-2"
                >
                    <CheckIcon className="w-5 h-5" /> Start New Challenge Today
                </button>
            </div>
        );
    }
    
    // Active Challenge View
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col space-y-6">
            {showResetModal && <ResetModal onConfirm={handleStartNewChallenge} onCancel={() => setShowResetModal(false)} />}
            {showJournalPrompt && journalDate && (
                <JournalPromptModal 
                    dateString={journalDate} 
                    onConfirm={handleConfirmJournal} 
                    onCancel={() => { setShowJournalPrompt(false); setJournalDate(null); }} 
                />
            )}
            
             <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal font-semibold flex-shrink-0 -ml-2">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>

            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-deep-charcoal">90 in 90 Tracker</h2>
                <button 
                    onClick={() => setShowResetModal(true)}
                    className="text-sm text-hopeful-coral hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                >
                    <RefreshIcon className="w-4 h-4"/> Reset Challenge
                </button>
            </div>

            <div className="space-y-4">
                <p className="text-lg font-semibold text-deep-charcoal/80">
                    Day <span className="text-serene-teal">{currentDay}</span> of {DAYS_IN_CHALLENGE}
                    <span className="text-sm text-deep-charcoal/60 ml-4">
                         (Started: {challengeData.startDate.toLocaleDateString()})
                    </span>
                </p>
                <div className="flex justify-between items-center mb-1"> 
                    <span className="text-sm font-semibold text-deep-charcoal/70">Meetings Attended</span> 
                    <span className={`text-xl font-bold ${attendanceCount >= currentDay ? 'text-green-600' : 'text-orange-500'}`}>
                        {attendanceCount}
                    </span> 
                </div> 
                <div className="w-full bg-light-stone/50 rounded-full h-4">
                    <div className="bg-serene-teal/100 h-4 rounded-full flex items-center justify-end pr-2 text-xs text-white font-bold" 
                         style={{ width: `${Math.min(attendanceCount / DAYS_IN_CHALLENGE * 100, 100)}%` }}>
                         {attendanceCount > 0 && `${Math.round(attendanceCount / DAYS_IN_CHALLENGE * 100)}%`}
                    </div>
                </div> 
                <p className="text-sm text-deep-charcoal/70 italic pt-2">Tap any past day to mark attendance. You'll be asked if you want to journal about it.</p>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {renderChallengeGrid()}
            </div>
        </div>
    );
};