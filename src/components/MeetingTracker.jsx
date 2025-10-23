import React, { useState, useEffect, useCallback } from 'react';
import { FirestoreDataStore } from '../utils/storage.js';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from '../utils/icons.jsx';

const STORAGE_KEY = FirestoreDataStore.KEYS.HOMEGROUP_TRACKER;

const MeetingTracker = ({ onBack }) => {
    const [entries, setEntries] = useState({}); // Object keyed by YYYY-MM-DD
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    const getFormattedDate = (date) => date.toISOString().split('T')[0];
    
    // Form state is derived from entries and currentDate
    const todayKey = getFormattedDate(currentDate);
    const currentEntry = entries[todayKey] || { chairperson: '', attendance: '', tradition: '', notes: '' };

    // --- Data Persistence (UPDATED FOR FIREBASE) ---
    useEffect(() => {
        const loadTrackerData = async () => {
            setIsLoading(true);
            const loadedEntries = await FirestoreDataStore.load(STORAGE_KEY) || {};
            setEntries(loadedEntries);
            setIsLoading(false);
        };
        loadTrackerData();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const form = e.target;
        const newEntry = {
            chairperson: form.chairperson.value,
            attendance: form.attendance.value,
            tradition: form.tradition.value,
            notes: form.notes.value,
        };
        const updatedEntries = { ...entries, [todayKey]: newEntry };
        setEntries(updatedEntries);
        await FirestoreDataStore.save(STORAGE_KEY, updatedEntries);
        alert('Entry Saved!');
    };

    const handleDateChange = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + offset);
        setCurrentDate(newDate);
    };

    const handleExport = () => {
        let csvContent = "Date,Chairperson,Attendance,7th Tradition,Notes\n";
        const sortedKeys = Object.keys(entries).sort();
        
        sortedKeys.forEach(key => {
            const entry = entries[key];
            const row = [
                key,
                `"${entry.chairperson.replace(/"/g, '""')}"`,
                entry.attendance,
                entry.tradition,
                `"${entry.notes.replace(/"/g, '""')}"`
            ].join(",");
            csvContent += row + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `homegroup_tracker_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Homegroup</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Homegroup Meeting Tracker</h2>

            <div className="flex items-center justify-between mb-4 p-2 bg-gray-100 rounded-lg">
                <button onClick={() => handleDateChange(-1)} className="p-2 hover:bg-gray-200 rounded-full"><ArrowLeftIcon className="w-6 h-6"/></button>
                <input 
                    type="date" 
                    value={todayKey} 
                    onChange={(e) => setCurrentDate(new Date(e.target.value + 'T00:00:00'))}
                    className="border-gray-300 rounded-lg shadow-sm"
                />
                <button onClick={() => handleDateChange(1)} className="p-2 hover:bg-gray-200 rounded-full"><ArrowRightIcon className="w-6 h-6"/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 flex-grow flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Chairperson</label>
                        <input type="text" name="chairperson" defaultValue={currentEntry.chairperson} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Attendance</label>
                        <input type="number" name="attendance" defaultValue={currentEntry.attendance} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">7th Tradition ($)</label>
                        <input type="number" step="0.01" name="tradition" defaultValue={currentEntry.tradition} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                    </div>
                </div>
                <div className="flex-grow flex flex-col">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea name="notes" rows="5" defaultValue={currentEntry.notes} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm flex-grow"></textarea>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700">Save Entry</button>
                    <button type="button" onClick={handleExport} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                        <DownloadIcon className="w-5 h-5"/> Export (.csv)
                    </button>
                </div>
                 <p className="text-xs text-gray-500 text-center">Exporting as a .csv file allows you to open your data in Google Sheets, Excel, or other spreadsheet programs.</p>
            </form>
        </div>
    );
};

export default MeetingTracker;