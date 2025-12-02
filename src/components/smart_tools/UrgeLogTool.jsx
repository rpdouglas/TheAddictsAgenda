import React from 'react';
import { useAutoSave, saveToJournal, JournalButton } from './SmartToolsCommon.jsx';

export const UrgeLogTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_urgelog', {
        urges: [],
        intensity: 5,
        trigger: '',
        response: ''
    });

    const addLog = () => {
        if (state.trigger) {
            setState(prev => ({
                ...prev,
                urges: [{
                    id: Date.now(),
                    date: new Date().toLocaleString(),
                    intensity: prev.intensity,
                    trigger: prev.trigger,
                    response: prev.response
                }, ...prev.urges],
                trigger: '',
                response: '',
                intensity: 5
            }));
        }
    };

    const handleJournalSave = () => {
        // Saves the current draft urge or the last logged one if draft is empty
        if (state.trigger) {
            const content = `**Trigger:** ${state.trigger}\n**Intensity:** ${state.intensity}/10\n**Response:** ${state.response}`;
            return saveToJournal('Urge Log', content);
        } else if (state.urges.length > 0) {
            const lastUrge = state.urges[0];
            const content = `**Trigger:** ${lastUrge.trigger}\n**Intensity:** ${lastUrge.intensity}/10\n**Response:** ${lastUrge.response}\n\n*(Logged: ${lastUrge.date})*`;
            return saveToJournal('Urge Log', content);
        } else {
            // Nothing to save
            return Promise.resolve(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-red-800">Tool 2.1: Urge Log</h3>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-red-700 font-semibold h-4">{status}</span>
                        <JournalButton onSave={handleJournalSave} />
                    </div>
                </div>
                <div className="mt-4 space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-red-800 uppercase">Intensity (1-10)</label>
                        <input 
                            type="range" min="1" max="10" 
                            className="w-full accent-red-600"
                            value={state.intensity} 
                            onChange={(e) => setState(prev => ({ ...prev, intensity: parseInt(e.target.value) }))} 
                        />
                        <p className="text-center font-bold text-red-600">{state.intensity}</p>
                    </div>
                    <input 
                        type="text" placeholder="Trigger (What happened?)" 
                        className="w-full p-2 border rounded"
                        value={state.trigger} 
                        onChange={(e) => setState(prev => ({ ...prev, trigger: e.target.value }))}
                    />
                    <input 
                        type="text" placeholder="How did you cope?" 
                        className="w-full p-2 border rounded"
                        value={state.response} 
                        onChange={(e) => setState(prev => ({ ...prev, response: e.target.value }))}
                    />
                    <button onClick={addLog} className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700">Log Urge</button>
                </div>
            </div>

            <div className="space-y-2">
                {state.urges.map(log => (
                    <div key={log.id} className="bg-white p-3 rounded border-l-4 border-red-500 shadow-sm">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{log.date}</span>
                            <span className="font-bold text-red-600">Intensity: {log.intensity}</span>
                        </div>
                        <p className="text-gray-800 font-medium">{log.trigger}</p>
                        <p className="text-gray-600 text-sm italic">" {log.response} "</p>
                    </div>
                ))}
            </div>
        </div>
    );
};