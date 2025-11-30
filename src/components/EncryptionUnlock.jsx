// src/components/EncryptionUnlock.jsx
import React, { useState } from 'react';
import { LockIcon } from '../utils/icons.jsx';

const EncryptionUnlock = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 1. Basic validation
        if (pin.length < 4) {
            setError('PIN must be at least 4 digits');
            return;
        }

        // 2. Save to Session Storage (This is where storage.js looks for it!)
        sessionStorage.setItem('USER_ENCRYPTION_KEY', pin);

        // 3. Trigger the app to try loading data
        onUnlock(); 
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center space-y-6">
                <div className="bg-serene-teal/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <LockIcon className="w-10 h-10 text-serene-teal" />
                </div>
                <h2 className="text-2xl font-bold text-deep-charcoal">Encrypted Storage</h2>
                <p className="text-deep-charcoal/70">
                    Your data is encrypted. Please enter your PIN to unlock your recovery journal.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full text-center text-2xl tracking-widest p-3 border border-light-stone rounded-lg focus:ring-2 focus:ring-serene-teal"
                        placeholder="• • • •"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button 
                        type="submit" 
                        className="w-full bg-serene-teal text-white font-bold py-3 px-4 rounded-lg shadow-md hover:brightness-95 transition-colors"
                    >
                        Unlock Data
                    </button>
                </form>
                <p className="text-xs text-red-500 mt-4">
                    <strong>Warning:</strong> If you forget this PIN, your journal entries cannot be recovered.
                </p>
            </div>
        </div>
    );
};

export default EncryptionUnlock;