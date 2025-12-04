// src/components/Settings.jsx
import React, { useState } from 'react';
import DataStore from '../utils/dataStore.js';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.js';
import { ArrowLeftIcon, CalendarIcon, DownloadIcon, TrashIcon, LockIcon, UnlockIcon, CloudIcon } from '../utils/icons.jsx';
// NEW IMPORTS to handle sign out
import { auth } from '../firebase.jsx';
import { signOut } from 'firebase/auth';

const Settings = ({ currentStartDate, handleSobrietyDateUpdate, onBack, onLogout, currentHeaderText, onHeaderTextUpdate }) => {
    const [date, setDate] = useState(currentStartDate ? currentStartDate.toISOString().split('T')[0] : '');
    const [headerTextInput, setHeaderTextInput] = useState(currentHeaderText);
    const [showExportConfirm, setShowExportConfirm] = useState(false);
    
    // Encryption State
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [showEncryptionSetup, setShowEncryptionSetup] = useState(false);

    // Demo Data State
    const [isImporting, setIsImporting] = useState(false);

    React.useEffect(() => {
        const checkEncryptionStatus = async () => {
            const encryptedStatus = await DataStore.load('is_account_encrypted');
            setIsEncrypted(!!encryptedStatus);
        };
        checkEncryptionStatus();
    }, []);

    const handleSaveDate = (e) => {
        e.preventDefault();
        const newDate = new Date(date);
        handleSobrietyDateUpdate(newDate);
        alert('Sobriety date updated!');
    };

    const handleSaveHeader = async (e) => {
        e.preventDefault();
        onHeaderTextUpdate(headerTextInput);
        await DataStore.save(DataStore.KEYS.HEADER_TEXT, headerTextInput);
        alert('Header text updated!');
    };

    const handleExportData = async () => {
        const allData = await DataStore.loadAll();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "recovery_toolkit_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        setShowExportConfirm(false);
    };

    const handleClearData = async () => {
        if (window.confirm("Are you SURE? This will delete all journal entries, settings, and progress. This cannot be undone.")) {
            await DataStore.deleteAll();
            window.location.reload();
        }
    };

    const handleEnableEncryption = async (e) => {
        e.preventDefault();
        if (pin.length < 4) {
            alert("PIN must be at least 4 digits.");
            return;
        }
        if (pin !== confirmPin) {
            alert("PINs do not match.");
            return;
        }

        // Save the PIN as the "Key" for this session
        sessionStorage.setItem('USER_ENCRYPTION_KEY', pin);
        
        // Mark account as encrypted
        await DataStore.save('is_account_encrypted', true);
        
        // Re-save sensitive data to trigger encryption
        const journal = await DataStore.load(DataStore.KEYS.JOURNAL);
        const workbook = await DataStore.load(DataStore.KEYS.WORKBOOK);
        
        if (journal) await DataStore.save(DataStore.KEYS.JOURNAL, journal);
        if (workbook) await DataStore.save(DataStore.KEYS.WORKBOOK, workbook);

        setIsEncrypted(true);
        setShowEncryptionSetup(false);
        alert("Encryption Enabled! Your data is now locked with your PIN.");
    };

    // --- DEMO DATA LOADER ---
    const loadSampleProfile = async (profileKey) => {
        const profile = SAMPLE_PROFILES[profileKey];
        if (!window.confirm(`⚠️ LOAD DEMO MODE?\n\nThis will temporarily switch the app to "Guest Mode" and load the "${profile.name}" profile.\n\nYour actual account data is safe in the cloud. To return to your real account, simply Log Out/Log In again.`)) {
            return;
        }

        setIsImporting(true);
        
        try {
            // 1. CRITICAL: Sign out of Firebase first. 
            // If we don't do this, the app will reconnect to Firebase on reload 
            // and ignore the guest flag we are about to set.
            await signOut(auth);

            // 2. Force Guest Mode flag
            localStorage.setItem('isGuest', 'true');
            
            // 3. Clear existing local data to avoid mixing old guest data
            localStorage.removeItem('addictsAgendaLocalData'); 

            // 4. Inject new data directly into LocalStorage
            const localDataStore = {};
            for (const [key, value] of Object.entries(profile.data)) {
                localDataStore[key] = value;
            }
            localStorage.setItem('addictsAgendaLocalData', JSON.stringify(localDataStore));

            alert(`Profile "${profile.name}" loaded! The app will now reload in Guest Mode.`);
            window.location.reload();
        } catch (error) {
            console.error("Error loading profile:", error);
            alert("Failed to load profile. Check console for details.");
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col overflow-y-auto">
            <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Dashboard</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-6">Settings</h2>

            {/* --- Date Settings --- */}
            <section className="mb-8 border-b border-light-stone pb-6">
                <h3 className="font-bold text-lg text-deep-charcoal mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5"/> Sobriety Date
                </h3>
                <form onSubmit={handleSaveDate} className="flex flex-col gap-3">
                    <label className="text-sm text-deep-charcoal/70">Update your clean date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                    />
                    <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                        Update Date
                    </button>
                </form>
            </section>

            {/* --- Custom Header --- */}
            <section className="mb-8 border-b border-light-stone pb-6">
                <h3 className="font-bold text-lg text-deep-charcoal mb-4">Custom Header</h3>
                <form onSubmit={handleSaveHeader} className="flex flex-col gap-3">
                    <label className="text-sm text-deep-charcoal/70">Change the text above your counter (e.g., "Freedom Since"):</label>
                    <input
                        type="text"
                        value={headerTextInput}
                        onChange={(e) => setHeaderTextInput(e.target.value)}
                        placeholder="You have been clean for"
                        className="p-3 border border-light-stone rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500"
                    />
                    <button type="submit" className="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                        Update Header
                    </button>
                </form>
            </section>

            {/* --- Security --- */}
            <section className="mb-8 border-b border-light-stone pb-6">
                <h3 className="font-bold text-lg text-deep-charcoal mb-4 flex items-center gap-2">
                    {isEncrypted ? <LockIcon className="w-5 h-5 text-green-600"/> : <UnlockIcon className="w-5 h-5 text-gray-400"/>} 
                    Data Security
                </h3>
                {isEncrypted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                        <strong>Encryption Enabled.</strong> Your journal and workbook data are encrypted with your PIN.
                    </div>
                ) : (
                    <>
                        {!showEncryptionSetup ? (
                            <button 
                                onClick={() => setShowEncryptionSetup(true)}
                                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                Enable End-to-End Encryption
                            </button>
                        ) : (
                            <form onSubmit={handleEnableEncryption} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                                <p className="text-xs text-red-600 font-bold">WARNING: If you lose this PIN, your data cannot be recovered.</p>
                                <input
                                    type="password"
                                    placeholder="Create PIN (4+ chars)"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm PIN"
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setShowEncryptionSetup(false)} className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-400">Cancel</button>
                                    <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700">Set PIN</button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </section>

            {/* --- Data Management --- */}
            <section className="mb-8 border-b border-light-stone pb-6">
                <h3 className="font-bold text-lg text-deep-charcoal mb-4">Data Management</h3>
                <div className="space-y-3">
                    {!showExportConfirm ? (
                        <button 
                            onClick={() => setShowExportConfirm(true)}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-teal-600 text-teal-600 font-bold py-3 px-4 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                            <DownloadIcon className="w-5 h-5" /> Export All Data
                        </button>
                    ) : (
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center">
                            <p className="text-sm text-yellow-800 mb-2">Download a JSON backup of all your data?</p>
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => setShowExportConfirm(false)} className="text-sm text-gray-600 hover:text-gray-800 underline">Cancel</button>
                                <button onClick={handleExportData} className="bg-yellow-500 text-white text-sm font-bold py-1 px-3 rounded hover:bg-yellow-600">Confirm Download</button>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleClearData}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 font-bold py-3 px-4 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <TrashIcon className="w-5 h-5" /> Reset App Data
                    </button>
                </div>
            </section>

            {/* --- DEMO / DEV TOOLS --- */}
            <section className="mb-8 pb-6">
                <h3 className="font-bold text-lg text-deep-charcoal mb-4 flex items-center gap-2">
                    <CloudIcon className="w-5 h-5 text-blue-500"/> Demo Profiles
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                    Instantly load a sample persona for demonstration. 
                    <strong> This will temporarily switch you to Guest Mode.</strong>
                </p>
                <div className="space-y-3">
                    {Object.keys(SAMPLE_PROFILES).map(key => (
                        <button
                            key={key}
                            onClick={() => loadSampleProfile(key)}
                            disabled={isImporting}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                        >
                            <div className="font-bold text-gray-800 group-hover:text-blue-700">{SAMPLE_PROFILES[key].name}</div>
                            <div className="text-xs text-gray-500">{SAMPLE_PROFILES[key].description}</div>
                        </button>
                    ))}
                </div>
            </section>

            {onLogout && (
                <button 
                    onClick={onLogout}
                    className="mt-auto w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Log Out
                </button>
            )}
        </div>
    );
};

export default Settings;