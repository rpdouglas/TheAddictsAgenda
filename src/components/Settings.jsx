import React, { useState, useMemo, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import { Spinner } from './common.jsx';
import { ArrowLeftIcon, DownloadIcon, FileTextIcon, LockIcon, UnlockIcon, LogOutIcon } from '../utils/icons.jsx';

const Settings = ({ currentStartDate, handleSobrietyDateUpdate, onBack, onLogout, currentHeaderText, onHeaderTextUpdate }) => { 
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

    // --- New State for Custom Header ---
    const DEFAULT_HEADER = 'You have been clean for';
    const [headerText, setHeaderText] = useState(currentHeaderText || DEFAULT_HEADER);
    const [headerStatus, setHeaderStatus] = useState('');

    // Sync local state if App.jsx re-fetches data (e.g., login)
    useEffect(() => {
        setHeaderText(currentHeaderText || DEFAULT_HEADER);
    }, [currentHeaderText]);
    
    const handleSaveDate = () => {
        const updatedDate = new Date(newDate);
        handleSobrietyDateUpdate(updatedDate, journalChecked);
        setSaveDateStatus('Date Updated!');
        setTimeout(() => setSaveDateStatus(''), 2000);
    };

    // --- New Handler for Custom Header ---
    const handleSaveHeaderText = async () => {
        const textToSave = headerText.trim();
        if (!textToSave) return;
        
        // 1. Save to DataStore
        await DataStore.save(DataStore.KEYS.HEADER_TEXT, textToSave);
        
        // 2. Update App's state to immediately reflect change on Dashboard
        onHeaderTextUpdate(textToSave);
        
        setHeaderStatus('Header Text Updated!');
        setTimeout(() => setHeaderStatus(''), 2000);
    };


    // --- PIN / Encryption Management State & Logic ---
    const [isPinSet, setIsPinSet] = useState(false);
    const [isLoadingPin, setIsLoadingPin] = useState(true);
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [pinMessage, setPinMessage] = useState('');
    const [isRemovingPin, setIsRemovingPin] = useState(false);
    const [removalPinAttempt, setRemovalPinAttempt] = useState('');

    useEffect(() => {
        const checkPinStatus = async () => {
            setIsLoadingPin(true);
            // UPDATED: Check for the encryption flag instead of a stored PIN
            const isEncrypted = await DataStore.load('is_account_encrypted');
            setIsPinSet(!!isEncrypted);
            setIsLoadingPin(false);
        };
        checkPinStatus();
    }, []);

    const handleSetPin = async () => {
        setPinMessage('');
        if (!pin || pin.length < 4 || isNaN(Number(pin))) {
            setPinMessage('PIN must be 4 or more digits.');
            return;
        }
        if (pin !== confirmPin) {
            setPinMessage('PINs do not match.');
            return;
        }

        try {
            // --- ENCRYPTION ENABLE LOGIC ---
            
            // 1. Set the key in the session so storage.js can use it immediately
            sessionStorage.setItem('USER_ENCRYPTION_KEY', pin);

            // 2. Load CURRENT data (which is currently plain text)
            // We trigger a load so we have the full objects in memory
            const journal = await DataStore.load(DataStore.KEYS.JOURNAL);
            const workbook = await DataStore.load(DataStore.KEYS.WORKBOOK);

            // 3. Force-Save it back. 
            // Because 'USER_ENCRYPTION_KEY' is now in sessionStorage, 
            // storage.js will automatically encrypt these sensitive fields when saving.
            if (journal) await DataStore.save(DataStore.KEYS.JOURNAL, journal);
            if (workbook) await DataStore.save(DataStore.KEYS.WORKBOOK, workbook);

            // 4. Set the public flag saying "This account is encrypted"
            // We do NOT save the PIN itself to the database.
            await DataStore.save('is_account_encrypted', true);
            
            // 5. Cleanup: Ensure any old insecure PIN is removed if it existed
            await DataStore.save(DataStore.KEYS.PIN, null);

            setIsPinSet(true);
            setPin('');
            setConfirmPin('');
            setPinMessage('Encryption enabled! Your data is now secured with this PIN.');
            setTimeout(() => setPinMessage(''), 3000);

        } catch (error) {
            console.error("Encryption setup failed:", error);
            setPinMessage('Error enabling encryption. Please try again.');
            sessionStorage.removeItem('USER_ENCRYPTION_KEY');
        }
    };

    const handleConfirmRemovePin = async () => {
        setPinMessage('');
        
        // We compare against the session key because that represents the current valid PIN
        const currentSessionKey = sessionStorage.getItem('USER_ENCRYPTION_KEY');

        if (removalPinAttempt === currentSessionKey) {
            try {
                // --- ENCRYPTION DISABLE LOGIC ---

                // 1. Load current (encrypted) data -> Decrypts to object using current session key
                const journal = await DataStore.load(DataStore.KEYS.JOURNAL);
                const workbook = await DataStore.load(DataStore.KEYS.WORKBOOK);

                // 2. Remove key from session so next save is plain text
                sessionStorage.removeItem('USER_ENCRYPTION_KEY');

                // 3. Save data back -> Saves as plain text because key is gone
                if (journal) await DataStore.save(DataStore.KEYS.JOURNAL, journal);
                if (workbook) await DataStore.save(DataStore.KEYS.WORKBOOK, workbook);

                // 4. Update flag
                await DataStore.save('is_account_encrypted', false);

                setIsPinSet(false);
                setIsRemovingPin(false);
                setRemovalPinAttempt('');
                setPinMessage('Encryption removed. Data is now stored in plain text.');
            } catch (error) {
                console.error("Encryption removal failed:", error);
                setPinMessage('Error removing encryption.');
                // Restore key if it failed halfway to prevent lockout
                if (currentSessionKey) sessionStorage.setItem('USER_ENCRYPTION_KEY', currentSessionKey);
            }
        } else {
            setPinMessage('Incorrect PIN. Removal canceled.');
            setRemovalPinAttempt('');
        }
        setTimeout(() => setPinMessage(''), 3000);
    };

    const handleExportData = async () => {
        setExporting(true);
        const data = await DataStore.loadAll();
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

    const handleLogout = async () => {
        try {
            // Clear session key on logout for security
            sessionStorage.removeItem('USER_ENCRYPTION_KEY');
            await onLogout();
        } catch (error) {
            console.error("Error during logout:", error);
            alert("There was an issue logging out. Please try again.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>

            <h2 className="text-2xl font-bold text-deep-charcoal mb-4">Settings</h2>
            <p className="text-deep-charcoal/70 mb-6">Manage your core application details.</p>

            <div className="space-y-8">

                {/* --- New Custom Header Section --- */}
                <div className="p-4 bg-serene-teal/10 rounded-lg border border-teal-100">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-serene-teal mb-2">
                        Customize Sobriety Header
                    </h3>
                    <p className="text-sm text-deep-charcoal/80 mb-4">
                        Change the text above your sobriety counter (e.g., "You are sober for", "You have been clean for").
                    </p>

                    <label className="block text-sm font-bold text-deep-charcoal/80 mb-2">Sober Time Header</label>
                    <input
                        type="text"
                        value={headerText}
                        onChange={(e) => setHeaderText(e.target.value)}
                        className="w-full p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                        placeholder={DEFAULT_HEADER}
                        maxLength={50}
                    />
                    <button onClick={handleSaveHeaderText} disabled={!headerText.trim()} className="w-full mt-4 bg-serene-teal text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95 disabled:bg-gray-400">Save Header Text</button>
                    {headerStatus && <p className="mt-3 text-sm text-center text-green-600">{headerStatus}</p>}
                </div>
                
                {/* PIN Lock Management */}
                <div className="p-4 bg-serene-teal/10 rounded-lg border border-teal-100">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-serene-teal mb-2">
                        {isPinSet ? <LockIcon className="w-5 h-5" /> : <UnlockIcon className="w-5 h-5" />}
                        End-to-End Encryption
                    </h3>
                    <p className="text-sm text-deep-charcoal/80 mb-4">
                        {isPinSet 
                            ? "Your journal and workbook are currently encrypted. You will need your PIN to access them on any device." 
                            : "Secure your journal and workbook with a PIN. This encrypts your data so only you can read it."}
                    </p>

                    {isLoadingPin ? <Spinner small /> : (
                        <>
                            {isPinSet ? (
                                <div className="space-y-2">
                                    <p className="font-semibold text-serene-teal">Account is encrypted.</p>
                                    {isRemovingPin ? (
                                        <form onSubmit={(e) => { e.preventDefault(); handleConfirmRemovePin(); }} className="space-y-3 p-3 bg-hopeful-coral/10 rounded-lg">
                                            <p className="text-sm font-bold text-red-700">Confirm PIN to Remove Encryption:</p>
                                            <input
                                                type="password"
                                                inputMode="numeric"
                                                placeholder="Enter current PIN"
                                                value={removalPinAttempt}
                                                onChange={(e) => setRemovalPinAttempt(e.target.value.replace(/\D/g, ''))}
                                                className="w-full p-3 border border-red-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500"
                                                maxLength={6}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => { setIsRemovingPin(false); setRemovalPinAttempt(''); setPinMessage(''); }} className="flex-grow bg-pure-white/600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-600">Cancel</button>
                                                <button type="submit" disabled={removalPinAttempt.length < 4} className="flex-grow bg-hopeful-coral text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95 disabled:bg-gray-400">Decrypt & Remove</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button onClick={() => setIsRemovingPin(true)} className="w-full mt-2 bg-hopeful-coral text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-hopeful-coral">Remove Encryption</button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="Set Encryption PIN (4+ digits)"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                                        className="w-full p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                                        maxLength={6}
                                    />
                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        placeholder="Confirm PIN"
                                        value={confirmPin}
                                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                        className="w-full p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                                        maxLength={6}
                                    />
                                    <p className="text-xs text-red-500 font-semibold">Warning: If you forget this PIN, your data cannot be recovered.</p>
                                    <button onClick={handleSetPin} disabled={pin.length < 4 || pin !== confirmPin} className="w-full bg-serene-teal text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95 disabled:bg-gray-400">Encrypt My Data</button>
                                </div>
                            )}
                        </>
                    )}
                    {pinMessage && <p className={`mt-3 text-sm text-center ${pinMessage.includes('successfully') || pinMessage.includes('enabled') || pinMessage.includes('removed') ? 'text-green-600' : 'text-hopeful-coral'}`}>{pinMessage}</p>}
                </div>

                {/* Sobriety Date Picker */}
                <div className="p-4 bg-pure-white/60 rounded-lg">
                    <label className="block text-sm font-bold text-deep-charcoal/80 mb-2">Change Sobriety Start Date</label>
                    <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-deep-charcoal/60 mt-2">Current Date: {currentStartDate.toLocaleDateString()}</p>
                    <div className="flex items-start mt-4">
                        <input
                            id="journal-change"
                            type="checkbox"
                            checked={journalChecked}
                            onChange={(e) => setJournalChecked(e.target.checked)}
                            className="h-5 w-5 rounded border-light-stone text-serene-teal focus:ring-teal-500 mt-1"
                        />
                        <label htmlFor="journal-change" className="ml-3 text-sm text-deep-charcoal/70 cursor-pointer">
                            Journal about this date change?
                            <span className="block text-xs text-deep-charcoal/60">This can help you reflect on why your date is being adjusted.</span>
                        </label>
                    </div>
                    <button onClick={handleSaveDate} className="w-full mt-4 bg-serene-teal text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95">Update Date</button>
                    {saveDateStatus && <p className="mt-3 text-sm text-center text-green-600">{saveDateStatus}</p>}
                </div>
                
                {/* Data Export Section */}
                <div className="p-4 bg-hopeful-coral/10 rounded-lg border border-hopeful-coral/30">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-deep-charcoal mb-2"><FileTextIcon className="w-5 h-5"/> Data Management</h3>
                    <p className="text-sm text-deep-charcoal/80 mb-4">
                        Export all your data as a JSON file for backup. Since your data is now stored in the cloud, this is useful for keeping a personal copy.
                    </p>
                    <button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="w-full flex items-center justify-center gap-2 bg-hopeful-coral text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-700 disabled:bg-gray-400"
                    >
                        {exporting ? <Spinner small /> : <DownloadIcon className="w-5 h-5"/>}
                        {exporting ? 'Preparing Data...' : 'Export All Data (.json)'}
                    </button>
                </div>

                {/* Logout Section */}
                <div className="p-4 bg-hopeful-coral/10 rounded-lg border border-hopeful-coral/30">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-red-800 mb-2">
                        <LogOutIcon className="w-5 h-5"/> Account Actions
                    </h3>
                    <p className="text-sm text-deep-charcoal/80 mb-4">
                        Logging out will require you to sign in again to access your data.
                    </p>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-hopeful-coral text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95"
                    >
                        Log Out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;