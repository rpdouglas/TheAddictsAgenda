import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner } from './common.jsx';
import { CalendarIcon, CheckIcon, RefreshIcon, XIcon, ArrowLeftIcon } from '../utils/icons.jsx';

// Data storage key
const STORAGE_KEY = LocalDataStore.KEYS.NINETY_IN_NINETY;
const DAYS_IN_CHALLENGE = 90;

// --- Custom Confirmation Modal Component ---
const ResetModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Confirm Reset</h3>
            <p className="text-gray-600">Are you sure you want to start a new 90 in 90 challenge? Your current progress will be permanently reset.</p>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Reset Challenge
                </button>
            </div>
        </div>
    </div>
);

export const NinetyDayChallenge = ({ onBack }) => {
    // State stores the start date of the current challenge (if active) and the array of attended dates.
    const [challengeData, setChallengeData] = useState(null); // { startDate: Date, attendance: { [dateString]: boolean } }
    const [isLoading, setIsLoading] = useState(true);
    const [showResetModal, setShowResetModal] = useState(false);

    const loadChallengeData = useCallback(() => {
        const stored = LocalDataStore.load(STORAGE_KEY);
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

    const saveChallengeData = useCallback((data) => {
        setChallengeData(data);
        LocalDataStore.save(STORAGE_KEY, {
            ...data,
            startDate: data.startDate.toISOString()
        });
    }, []);

    // Derived State Calculation
    const {
        progress,
        attendanceCount,
        currentDay
    } = useMemo(() => {
        if (!challengeData || !challengeData.startDate) {
            return { progress: 0, attendanceCount: 0, currentDay: 0 };
        }

        const msInDay = 86400000;
        const start = challengeData.startDate.getTime();
        const now = new Date().getTime();
        
        let dayDiff = Math.floor((now - start) / msInDay) + 1;
        dayDiff = Math.min(dayDiff, DAYS_IN_CHALLENGE);
        
        const count = Object.values(challengeData.attendance).filter(Boolean).length;
        
        // Progress is percentage of days passed (used for the total bar length)
        const progressPercent = Math.min(Math.round((dayDiff / DAYS_IN_CHALLENGE) * 100), 100);

        return {
            progress: progressPercent,
            attendanceCount: count,
            currentDay: dayDiff
        };
    }, [challengeData]);


    const handleStartNewChallenge = () => {
        setShowResetModal(false); // Close modal if open
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        const newChallenge = {
            startDate: today,
            attendance: {}
        };
        saveChallengeData(newChallenge);
    };

    const handleToggleAttendance = (dayIndex) => {
        if (!challengeData) return;
        
        const targetDate = new Date(challengeData.startDate);
        targetDate.setDate(targetDate.getDate() + dayIndex);

        const dateKey = targetDate.toISOString().split('T')[0];
        
        const updatedAttendance = {
            ...challengeData.attendance,
            [dateKey]: !challengeData.attendance[dateKey]
        };

        saveChallengeData({
            ...challengeData,
            attendance: updatedAttendance
        });
    };

    const isDayPastOrToday = (dayIndex) => dayIndex < currentDay;

    const getFormattedDate = (dayIndex) => {
        if (!challengeData || !challengeData.startDate) return '';
        const date = new Date(challengeData.startDate);
        date.setDate(date.getDate() + dayIndex);
        return date.toISOString().split('T')[0];
    };

    // --- RENDER FUNCTIONS ---

    const renderChallengeGrid = () => {
        const days = Array.from({ length: DAYS_IN_CHALLENGE }, (_, i) => {
            const dayIndex = i; // 0 to 89
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
                            ? 'bg-teal-500 text-white hover:bg-teal-600' 
                            : isSelectable 
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100' 
                                : 'bg-gray-100 text-gray-400 cursor-default'
                        }
                    `}
                >
                    {dayIndex + 1}
                    {isAttended && <CheckIcon className="w-3 h-3 ml-0.5" />}
                </button>
            );
        });

        return (
            <div className="grid grid-cols-7 sm:grid-cols-10 gap-2 p-4 border border-gray-200 rounded-xl bg-gray-50">
                {days}
            </div>
        );
    };

    if (isLoading) return <Spinner />;

    if (!challengeData || !challengeData.startDate) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col items-center justify-center text-center">
                 <button onClick={onBack} className="absolute top-6 left-6 flex items-center text-teal-600 hover:text-teal-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back</span>
                </button>
                <CalendarIcon className="w-12 h-12 text-teal-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">90 in 90 Challenge</h2>
                <p className="text-gray-600 mb-6">Commit to 90 meetings in 90 days. Tracking starts today.</p>
                <button 
                    onClick={handleStartNewChallenge}
                    className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors flex items-center gap-2"
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
            
             <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 font-semibold flex-shrink-0 -ml-2">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>

            <div className="flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-gray-800">90 in 90 Tracker</h2>
                <button 
                    onClick={() => setShowResetModal(true)}
                    className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                >
                    <RefreshIcon className="w-4 h-4"/> Reset Challenge
                </button>
            </div>

            <div className="space-y-4">
                <p className="text-lg font-semibold text-gray-700">
                    Day <span className="text-teal-600">{currentDay}</span> of {DAYS_IN_CHALLENGE}
                    <span className="text-sm text-gray-500 ml-4">
                         (Started: {challengeData.startDate.toLocaleDateString()})
                    </span>
                </p>
                <div className="flex justify-between items-center mb-1"> 
                    <span className="text-sm font-semibold text-gray-600">Meetings Attended</span> 
                    <span className={`text-xl font-bold ${attendanceCount >= currentDay ? 'text-green-600' : 'text-orange-500'}`}>
                        {attendanceCount}
                    </span> 
                </div> 
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-teal-500 h-4 rounded-full flex items-center justify-end pr-2 text-xs text-white font-bold" 
                         style={{ width: `${Math.min(attendanceCount / DAYS_IN_CHALLENGE * 100, 100)}%` }}>
                         {attendanceCount > 0 && `${Math.round(attendanceCount / DAYS_IN_CHALLENGE * 100)}%`}
                    </div>
                </div> 
                <p className="text-sm text-gray-600 italic pt-2">Tap any past day to mark your attendance.</p>
            </div>

            {/* Grid Visualization */}
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {renderChallengeGrid()}
            </div>
        </div>
    );
};