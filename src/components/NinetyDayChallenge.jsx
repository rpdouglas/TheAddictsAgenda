// src/components/NinetyDayChallenge.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DataStore from '../utils/dataStore.js';
import { Spinner } from './common.jsx';
import { CalendarIcon, CheckIcon, RefreshIcon, ArrowLeftIcon, PenIcon, LockIcon } from '../utils/icons.jsx';

// Data storage key
const STORAGE_KEY = DataStore.KEYS.NINETY_IN_NINETY;
const DAYS_IN_CHALLENGE = 90;

// --- Custom Confirmation Modals ---
const ResetModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-deep-charcoal">Confirm Reset</h3>
            <p className="text-deep-charcoal/70">Are you sure you want to start a new 90 in 90 challenge? Your current progress will be permanently reset.</p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">Reset Challenge</button>
            </div>
        </div>
    </div>
);

const JournalPromptModal = ({ dateString, onConfirm, onCancel }) => (
     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-deep-charcoal">Journal About Meeting?</h3>
            <p className="text-deep-charcoal/70">Would you like to create a journal entry for the meeting on {new Date(dateString + 'T00:00:00').toLocaleDateString()}?</p>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">No Thanks</button>
                <button onClick={onConfirm} className="bg-serene-teal text-white font-semibold py-2 px-4 rounded-lg hover:brightness-95 transition-colors flex items-center gap-2">
                    <PenIcon className="w-4 h-4" /> Yes, Journal
                </button>
            </div>
        </div>
    </div>
);

const NinetyDayChallenge = ({ onBack, onNavigate, setJournalTemplate }) => {
    const [challengeData, setChallengeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showJournalPrompt, setShowJournalPrompt] = useState(false);
    const [journalDate, setJournalDate] = useState(null);

    const loadChallengeData = useCallback(async () => {
        setIsLoading(true);
        const stored = await DataStore.load(STORAGE_KEY);
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
        await DataStore.save(STORAGE_KEY, {
            ...data,
            startDate: data.startDate.toISOString()
        });
    }, []);

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

    // --- PHASE RENDERING LOGIC ---
    const renderPhase = (phaseIndex, title, startDay, endDay) => {
        const isPhaseLocked = currentDay < startDay;
        const isPhaseActive = currentDay >= startDay && currentDay <= endDay;
        
        // Calculate phase-specific progress
        let phaseCompleted = 0;
        for (let i = startDay - 1; i < endDay; i++) {
            if (challengeData.attendance[getFormattedDate(i)]) phaseCompleted++;
        }
        const totalPhaseDays = endDay - startDay + 1;
        const phaseProgress = Math.round((phaseCompleted / totalPhaseDays) * 100);

        return (
            <div className={`rounded-xl border shadow-sm overflow-hidden mb-4 transition-all duration-300 ${
                isPhaseLocked ? 'bg-gray-50 border-gray-200 opacity-70' : 
                isPhaseActive ? 'bg-white border-serene-teal ring-1 ring-serene-teal/30' : 
                'bg-white border-gray-200'
            }`}>
                {/* Phase Header */}
                <div className={`p-4 flex justify-between items-center ${isPhaseLocked ? 'bg-gray-100' : 'bg-gradient-to-r from-teal-50 to-white'}`}>
                    <div>
                        <h3 className={`font-bold text-sm ${isPhaseLocked ? 'text-gray-500' : 'text-teal-900'}`}>
                            {title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Days {startDay} - {endDay}</p>
                    </div>
                    {isPhaseLocked ? (
                        <LockIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            phaseProgress === 100 ? 'bg-healing-green text-white' : 'bg-teal-100 text-teal-800'
                        }`}>
                            {phaseProgress}% Done
                        </span>
                    )}
                </div>

                {/* The 5x6 Grid */}
                <div className={`grid grid-cols-5 gap-2 p-4 ${isPhaseLocked ? 'pointer-events-none filter blur-[1px]' : ''}`}>
                    {Array.from({ length: totalPhaseDays }, (_, i) => {
                        const dayIndex = startDay - 1 + i; // 0-based index
                        const isAttended = challengeData.attendance[getFormattedDate(dayIndex)] || false;
                        const isSelectable = isDayPastOrToday(dayIndex);
                        const isToday = dayIndex === currentDay - 1;

                        return (
                            <button
                                key={dayIndex}
                                onClick={() => isSelectable && handleToggleAttendance(dayIndex)}
                                disabled={!isSelectable && !isPhaseLocked}
                                className={`
                                    relative flex flex-col items-center justify-center aspect-square rounded-lg transition-all duration-200
                                    ${isAttended 
                                        ? 'bg-healing-green text-white shadow-sm scale-100' 
                                        : isToday
                                            ? 'bg-white border-2 border-serene-teal text-serene-teal font-bold shadow-md scale-105 z-10'
                                            : isSelectable 
                                                ? 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100' 
                                                : 'bg-gray-50 border border-gray-100 text-gray-300'
                                    }
                                `}
                            >
                                <span className="text-xs font-medium">{dayIndex + 1}</span>
                                {isAttended && <CheckIcon className="w-4 h-4 mt-0.5 animate-bounce-in" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (isLoading) return <div className="h-full flex items-center justify-center"><Spinner /></div>;

    if (!challengeData || !challengeData.startDate) {
         return (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col items-center justify-center text-center">
                 <button onClick={onBack} className="absolute top-6 left-6 flex items-center text-serene-teal hover:text-serene-teal font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back</span>
                </button>
                <div className="bg-teal-50 p-6 rounded-full mb-6">
                    <CalendarIcon className="w-12 h-12 text-serene-teal" />
                </div>
                <h2 className="text-2xl font-bold text-deep-charcoal mb-2">90 in 90 Challenge</h2>
                <p className="text-deep-charcoal/70 mb-8 max-w-xs mx-auto">Commit to 90 meetings in 90 days. A proven foundation for long-term recovery.</p>
                <button 
                    onClick={handleStartNewChallenge}
                    className="bg-serene-teal text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:brightness-95 transition-transform active:scale-95 flex items-center gap-2"
                >
                    <CheckIcon className="w-5 h-5" /> Start New Challenge
                </button>
            </div>
        );
    }
    
    return (
        <div className="bg-white h-full flex flex-col">
            {showResetModal && <ResetModal onConfirm={handleStartNewChallenge} onCancel={() => setShowResetModal(false)} />}
            {showJournalPrompt && journalDate && (
                <JournalPromptModal 
                    dateString={journalDate} 
                    onConfirm={handleConfirmJournal} 
                    onCancel={() => { setShowJournalPrompt(false); setJournalDate(null); }} 
                />
            )}
            
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
                <button onClick={onBack} className="flex items-center text-serene-teal font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-1">Dashboard</span>
                </button>
                <button 
                    onClick={() => setShowResetModal(true)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Reset Challenge"
                >
                    <RefreshIcon className="w-5 h-5"/>
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-6 pb-20">
                
                {/* Progress Overview Card */}
                <div className="bg-gradient-to-br from-serene-teal to-healing-green rounded-xl p-5 text-white shadow-md">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-teal-100 text-xs font-bold uppercase tracking-wider mb-1">Current Progress</p>
                            <h2 className="text-3xl font-bold">{attendanceCount} <span className="text-lg font-normal text-teal-100">/ 90</span></h2>
                        </div>
                        <div className="text-right">
                            <p className="text-teal-100 text-xs font-bold uppercase tracking-wider">Current Day</p>
                            <p className="text-xl font-bold">{currentDay}</p>
                        </div>
                    </div>
                    {/* Overall Progress Bar */}
                    <div className="w-full bg-black/20 rounded-full h-2 mt-2">
                        <div 
                            className="bg-white h-2 rounded-full transition-all duration-1000" 
                            style={{ width: `${(attendanceCount / DAYS_IN_CHALLENGE) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* The 3 Phases */}
                <div className="space-y-4">
                    {renderPhase(1, "Phase 1: The Foundation", 1, 30)}
                    {renderPhase(2, "Phase 2: The Habit", 31, 60)}
                    {renderPhase(3, "Phase 3: The Lifestyle", 61, 90)}
                </div>

                <p className="text-center text-xs text-gray-400 italic">
                    Consistency is the key. Don't give up before the miracle happens.
                </p>
            </div>
        </div>
    );
};

export default NinetyDayChallenge;