// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';
import { SAMPLE_PROFILES } from '../data/sampleProfiles.js';
import { useAuth } from '/src/AuthContext.jsx'; 
import { 
    ArrowLeftIcon, 
    CalendarIcon, 
    DownloadIcon, 
    TrashIcon, 
    LockIcon, 
    UnlockIcon, 
    CloudIcon,
    UserIcon,
    ShieldIcon,
    LogOutIcon,
    SettingsIcon 
} from '../utils/icons.jsx';
import { auth } from '../firebase.jsx';
import { signOut } from 'firebase/auth';

// UPDATED: Added onNavigate to the destructured props list (passed from App.jsx)
const Settings = ({ currentStartDate, handleSobrietyDateUpdate, onBack, onLogout, currentHeaderText, onHeaderTextUpdate, onNavigate }) => { 
    
    // NEW: Get session information and define developer access
    const { session } = useAuth();
    const DEVELOPER_EMAIL = 'rpdouglas@gmail.com'; // CRITICAL: Placeholder for your email
    const isDeveloper = session?.email === DEVELOPER_EMAIL;

    const [date, setDate] = useState(currentStartDate ? currentStartDate.toISOString().split('T')[0] : '');
    const [headerTextInput, setHeaderTextInput] = useState(currentHeaderText);
    const [showExportConfirm, setShowExportConfirm] = useState(false);
    
    // Encryption State
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [showEncryptionSetup, setShowEncryptionSetup] = useState(false);

    // Demo Data State
    const [selectedProfileKey, setSelectedProfileKey] = useState(Object.keys(SAMPLE_PROFILES)[0]);
    const [isImporting, setIsImporting] = useState(false);

    useEffect(() => {
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

        sessionStorage.setItem('USER_ENCRYPTION_KEY', pin);
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
    const handleLoadProfile = async () => {
        const profile = SAMPLE_PROFILES[selectedProfileKey];
        if (!window.confirm(`⚠️ LOAD DEMO MODE?\n\nThis will switch to "Guest Mode" and load the "${profile.name}" profile.\n\nYour real account data is safe in the cloud. To return, simply Log Out.`)) {
            return;
        }

        setIsImporting(true);
        
        try {
            await signOut(auth); // Sign out of Firebase first
            localStorage.setItem('isGuest', 'true');
            localStorage.removeItem('addictsAgendaLocalData'); 

            const localDataStore = {};
            for (const [key, value] of Object.entries(profile.data)) {
                localDataStore[key] = value;
            }
            localStorage.setItem('addictsAgendaLocalData', JSON.stringify(localDataStore));

            alert(`Profile "${profile.name}" loaded! reloading...`);
            window.location.reload();
        } catch (error) {
            console.error("Error loading profile:", error);
            alert("Failed to load profile. Check console for details.");
        } finally {
            setIsImporting(false);
        }
    };

    return (
        // Removed height/flex properties to allow content to flow vertically
        <div className="bg-gray-50"> 
            
            {/* Header */}
            {/* FIX: Removed flex-shrink-0 to allow the header to flow naturally within the scrollable parent */}
            <div className="bg-white p-4 shadow-sm flex items-center justify-between">
                <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Dashboard</span>
                </button>
                <h2 className="text-xl font-bold text-deep-charcoal">Settings</h2>
                <div className="w-20"></div> {/* Spacer for alignment */}
            </div>

            {/* Content Area - Relies on parent App.jsx scrolling */}
            <div className="p-4 space-y-6">

                {/* --- CARD 1: PERSONALIZATION --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-teal-50 px-4 py-3 border-b border-teal-100 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-teal-600"/>
                        <h3 className="font-bold text-teal-800">Profile & Personalization</h3>
                    </div>
                    <div className="p-4 space-y-6">
                        <form onSubmit={handleSaveDate} className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Sobriety Date</label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                                />
                                <button type="submit" className="bg-teal-600 text-white text-sm font-bold px-4 rounded-lg hover:bg-teal-700">
                                    Save
                                </button>
                            </div>
                        </form>

                        <form onSubmit={handleSaveHeader} className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Dashboard Header</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={headerTextInput}
                                    onChange={(e) => setHeaderTextInput(e.target.value)}
                                    placeholder="You have been clean for"
                                    className="flex-grow p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                                />
                                <button type="submit" className="bg-teal-600 text-white text-sm font-bold px-4 rounded-lg hover:bg-teal-700">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* --- CARD 2: SECURITY --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
                        <ShieldIcon className="w-5 h-5 text-indigo-600"/>
                        <h3 className="font-bold text-indigo-800">Privacy & Security</h3>
                    </div>
                    <div className="p-4">
                        {isEncrypted ? (
                            <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                                <LockIcon className="w-6 h-6" />
                                <div>
                                    <p className="font-bold text-sm">Encryption Active</p>
                                    <p className="text-xs">Your data is secured with your PIN.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {!showEncryptionSetup ? (
                                    <button 
                                        onClick={() => setShowEncryptionSetup(true)}
                                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
                                    >
                                        <LockIcon className="w-4 h-4"/> Enable End-to-End Encryption
                                    </button>
                                ) : (
                                    <form onSubmit={handleEnableEncryption} className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <p className="text-xs text-red-600 font-bold">⚠️ If you lose this PIN, data cannot be recovered.</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="password"
                                                placeholder="New PIN"
                                                value={pin}
                                                onChange={(e) => setPin(e.target.value)}
                                                className="p-2 border rounded text-sm"
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm"
                                                value={confirmPin}
                                                onChange={(e) => setConfirmPin(e.target.value)}
                                                className="p-2 border rounded text-sm"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => setShowEncryptionSetup(false)} className="flex-1 bg-white border border-gray-300 text-gray-600 text-sm font-bold py-2 rounded">Cancel</button>
                                            <button type="submit" className="flex-1 bg-indigo-600 text-white text-sm font-bold py-2 rounded">Set PIN</button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* --- CARD 3: DATA MANAGEMENT --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
                        <DownloadIcon className="w-5 h-5 text-orange-600"/>
                        <h3 className="font-bold text-orange-800">Data Management</h3>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                        {!showExportConfirm ? (
                            <button 
                                onClick={() => setShowExportConfirm(true)}
                                className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                            >
                                <div className="bg-orange-100 p-2 rounded-full text-orange-600"><DownloadIcon className="w-5 h-5"/></div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">Export Data Backup</p>
                                    <p className="text-xs text-gray-500">Download a JSON file of your progress.</p>
                                </div>
                            </button>
                        ) : (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center animate-fade-in">
                                <p className="text-sm text-yellow-900 font-medium mb-2">Download full backup?</p>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={() => setShowExportConfirm(false)} className="text-xs font-bold text-gray-500 hover:text-gray-700 px-3">Cancel</button>
                                    <button onClick={handleExportData} className="bg-orange-500 text-white text-xs font-bold py-1.5 px-4 rounded hover:bg-orange-600">Confirm</button>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleClearData}
                            className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                        >
                            <div className="bg-red-100 p-2 rounded-full text-red-600"><TrashIcon className="w-5 h-5"/></div>
                            <div>
                                <p className="font-bold text-red-700 text-sm">Reset Application</p>
                                <p className="text-xs text-red-400">Wipe all data and start over.</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* --- CARD 4: DEMO & TESTING (Visual Selector) --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
                        <CloudIcon className="w-5 h-5 text-blue-600"/>
                        <h3 className="font-bold text-blue-800">Demo Mode</h3>
                    </div>
                    <div className="p-4">
                        <p className="text-xs text-gray-500 mb-3">
                            Select a sample persona to test the app. This switches you to <strong>Guest Mode</strong>.
                        </p>
                        
                        <div className="flex flex-col gap-3 mb-4">
                            {Object.keys(SAMPLE_PROFILES).map(key => {
                                const profile = SAMPLE_PROFILES[key];
                                const isSelected = selectedProfileKey === key;
                                const displayImage = profile.imageIcon || profile.avatar;
                                
                                return (
                                    <button 
                                        key={key} 
                                        onClick={() => setSelectedProfileKey(key)}
                                        className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                                            isSelected 
                                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {/* Profile Image with Fallback */}
                                        <div className="flex-shrink-0">
                                            {displayImage ? (
                                                <img 
                                                    src={displayImage} 
                                                    alt={profile.name} 
                                                    className="w-12 h-12 rounded-full object-cover bg-gray-200 border border-gray-300"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none'; // Hide broken image
                                                        e.target.nextSibling.style.display = 'flex'; // Show fallback
                                                    }}
                                                />
                                            ) : null}
                                            <div 
                                                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200"
                                                style={{ display: displayImage ? 'none' : 'flex' }}
                                            >
                                                <UserIcon className="w-6 h-6" />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p className={`text-sm font-bold ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                                                {profile.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {profile.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button 
                            onClick={handleLoadProfile}
                            disabled={isImporting}
                            className="w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isImporting ? 'Loading Profile...' : `Load ${SAMPLE_PROFILES[selectedProfileKey].name}`}
                        </button>
                    </div>
                </div>
                
                {/* --- DEVELOPER TOOLS (NEW BLOCK) --- */}
                {isDeveloper && (
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                        <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                            <SettingsIcon className="w-5 h-5 text-red-600"/>
                            <h3 className="font-bold text-red-800">Developer Tools</h3>
                        </div>
                        <div className="p-4">
                            <button 
                                onClick={() => onNavigate('ai-test')} 
                                className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition-colors"
                            >
                                <SettingsIcon className="w-5 h-5 mr-2" /> 
                                AI Test Component
                            </button>
                            <p className="text-xs text-gray-500 mt-2 text-center">Accessible only by {DEVELOPER_EMAIL}</p>
                        </div>
                    </div>
                )}

                {/* --- LOG OUT --- */}
                {onLogout && (
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-4 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all mt-4"
                    >
                        <LogOutIcon className="w-5 h-5"/> Log Out
                    </button>
                )}

            </div>
        </div>
    );
};

export default Settings;