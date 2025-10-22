import React, { useState, useMemo } from 'react';
import { LocalDataStore } from '../utils/storage.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, DownloadIcon, FileTextIcon, LockIcon, UnlockIcon } from '../utils/icons.jsx'; // Import new icons

export const Settings = ({ currentStartDate, handleSobrietyDateUpdate, onBack }) => {
    // --- Sobriety Date State ---
    const initialDateString = useMemo(() => {
        if (currentStartDate instanceof Date && !isNaN(currentStartDate)) {
            return currentStartDate.toISOString().split('T')[0];
        }
        return new Date().toISOString().split('T')[0];
    }, [currentStartDate]);

    const [newDate, setNewDate] = useState(initialDateString);
    const [journalChecked, setJournalChecked] = useState(false);
    const [exporting, setExporting] = useState(false); 
    const [saveDateStatus, setSaveDateStatus] = useState('');

    const handleSaveDate = () => {
        const updatedDate = new Date(newDate);
        handleSobrietyDateUpdate(updatedDate, journalChecked);
        setSaveDateStatus('Date Updated!');
        setTimeout(() => setSaveDateStatus(''), 2000);
    };
    
    // --- PIN Management State & Logic (NEW) ---
    // NOTE: This initial load must be outside the handlers/effects for state initialization
    const initialStoredPin = LocalDataStore.load(LocalDataStore.KEYS.PIN);

    // If the PIN has been set before, we use its presence to determine the initial state.
    const [isPinSet, setIsPinSet] = useState(!!initialStoredPin);
    
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [pinMessage, setPinMessage] = useState('');

    const handleSetPin = () => {
        setPinMessage('');
        // Basic validation: must be only digits and at least 4 chars long
        if (!pin || pin.length < 4 || isNaN(Number(pin))) {
            setPinMessage('PIN must be 4 or more digits.');
            return;
        }
        if (pin !== confirmPin) {
            setPinMessage('PINs do not match.');
            return;
        }
        
        // Save logic
        LocalDataStore.save(LocalDataStore.KEYS.PIN, pin);
        setIsPinSet(true);
        setPin('');
        setConfirmPin('');
        setPinMessage('Application lock PIN saved! It will be required on next launch.');
        // Notify App.jsx to potentially lock/re-check pin state if it wasn't already loaded
        
        setTimeout(() => setPinMessage(''), 3000);
    };

    const handleRemovePin = () => {
        // Save null to remove the key in storage util (which reads null as 'no pin')
        LocalDataStore.save(LocalDataStore.KEYS.PIN, null);
        setIsPinSet(false);
        setPin('');
        setConfirmPin('');
        setPinMessage('PIN lock removed.');
        setTimeout(() => setPinMessage(''), 3000);
    };


    // --- Data Export Handler ---
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
                
                {/* PIN Lock Management (NEW) */}
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-teal-700 mb-2">
                        {isPinSet ? <LockIcon className="w-5 h-5"/> : <UnlockIcon className="w-5 h-5"/>} 
                        Application PIN Lock
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                        Protect your journal and progress by setting a 4-digit PIN required to open the app.
                    </p>
                    
                    {isPinSet ? (
                        <div className="space-y-2">
                            <p className="font-semibold text-teal-600">PIN lock is currently active. Access is required on app launch.</p>
                            <button
                                onClick={handleRemovePin}
                                className="w-full mt-2 bg-red-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-600 transition-colors"
                            >
                                Remove PIN Lock
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Set new PIN (4+ digits)"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} // Only allow digits
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                                maxLength={6}
                            />
                             <input
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Confirm new PIN"
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))} // Only allow digits
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                                maxLength={6}
                            />
                            <button
                                onClick={handleSetPin}
                                disabled={pin.length < 4 || pin !== confirmPin}
                                className="w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors disabled:bg-gray-400"
                            >
                                Set PIN Lock
                            </button>
                        </div>
                    )}
                    {pinMessage && <p className={`mt-3 text-sm text-center ${isPinSet ? 'text-green-600' : 'text-red-500'}`}>{pinMessage}</p>}
                </div>

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
                        onClick={handleSaveDate}
                        className="w-full mt-4 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
                    >
                        Update Date
                    </button>
                    {saveDateStatus && <p className="mt-3 text-sm text-center text-green-600">{saveDateStatus}</p>}
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
