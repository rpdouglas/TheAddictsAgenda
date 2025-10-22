import React, { useState, useMemo } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, DownloadIcon, FileTextIcon } from '../utils/icons.jsx';

export const Settings = ({ currentStartDate, handleSobrietyDateUpdate, onBack }) => {
    const initialDateString = useMemo(() => {
        if (currentStartDate instanceof Date && !isNaN(currentStartDate)) {
            return currentStartDate.toISOString().split('T')[0];
        }
        return new Date().toISOString().split('T')[0];
    }, [currentStartDate]);

    const [newDate, setNewDate] = useState(initialDateString);
    const [journalChecked, setJournalChecked] = useState(false);
    const [exporting, setExporting] = useState(false); 

    const handleSave = () => {
        const updatedDate = new Date(newDate);
        handleSobrietyDateUpdate(updatedDate, journalChecked);
    };
    
    // Data Export Handler
    const handleExportData = () => {
        setExporting(true);
        const data = LocalDataStore.loadAll();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `recovery_data_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        setExporting(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600 mb-6">Manage your core application details.</p>

            <div className="space-y-8">
                {/* Sobriety Date Picker */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Change Sobriety Start Date</label>
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">Current Date: {currentStartDate.toLocaleDateString()}</p>
                    <div className="flex items-start mt-4">
                        <input
                            id="journal-change"
                            type="checkbox"
                            checked={journalChecked}
                            onChange={(e) => setJournalChecked(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-1"
                        />
                        <label htmlFor="journal-change" className="ml-3 text-sm text-gray-600 cursor-pointer">
                            **Journal about this date change?**
                            <span className="block text-xs text-gray-500">I recommend reflecting on why your sobriety date is being adjusted.</span>
                        </label>
                    </div>
                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full mt-4 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                    >
                        Update Date
                    </button>
                </div>
                
                {/* Data Export Section */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-yellow-800 mb-2"><FileTextIcon className="w-5 h-5"/> Data Management</h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Export all your data (Journal, Goals, Workbook responses) as a JSON file. This is crucial for backing up your private data as it is **not stored on a server**.
                    </p>
                    <button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-700 transition-colors disabled:bg-gray-400"
                    >
                        {exporting ? <Spinner small /> : <DownloadIcon className="w-5 h-5"/>}
                        {exporting ? 'Preparing Data...' : 'Export All Data (.json)'}
                    </button>
                </div>

            </div>
        </div>
    );
};
