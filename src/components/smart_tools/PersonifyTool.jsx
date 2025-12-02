import React from 'react';
import { PlusIcon, TrashIcon, ShieldIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton } from './SmartToolsCommon.jsx';

export const PersonifyTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_personify', {
        personas: [],
        newName: '',
        newAction: '',
        newResult: ''
    });

    const addPersona = () => {
        if (state.newName && state.newAction) {
            setState(prev => ({
                ...prev,
                personas: [...prev.personas, {
                    id: Date.now(),
                    name: prev.newName,
                    action: prev.newAction,
                    result: prev.newResult
                }],
                newName: '', newAction: '', newResult: ''
            }));
        }
    };

    const removePersona = (id) => {
        setState(prev => ({ ...prev, personas: prev.personas.filter(p => p.id !== id) }));
    };

    const updateInput = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    const handleJournalSave = () => {
        let content = `**Personified Urges:**\n\n`;
        if (state.personas.length === 0) content += "(No personas added yet)";
        state.personas.forEach(p => {
            content += `**Name:** ${p.name}\n**I Say:** "${p.action}"\n**Result:** ${p.result}\n\n`;
        });
        return saveToJournal('Personify & Disarm', content);
    };

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-purple-800">Tool 4.6: Personify and Disarm</h3>
                    <p className="text-sm text-purple-700">Treat urges as an annoying salesperson or a whining child to reduce their power.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-purple-700 font-semibold h-4">{status}</span>
                    <JournalButton onSave={handleJournalSave} />
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200 space-y-3">
                <h4 className="font-bold text-gray-700">Add New Persona</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                        type="text" placeholder="Name (e.g., The Whiner)"
                        className="p-2 border rounded text-sm"
                        value={state.newName}
                        onChange={(e) => updateInput('newName', e.target.value)}
                    />
                    <input
                        type="text" placeholder="What you say to it..."
                        className="p-2 border rounded text-sm"
                        value={state.newAction}
                        onChange={(e) => updateInput('newAction', e.target.value)}
                    />
                    <input
                        type="text" placeholder="What happens next..."
                        className="p-2 border rounded text-sm"
                        value={state.newResult}
                        onChange={(e) => updateInput('newResult', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPersona()}
                    />
                </div>
                <button onClick={addPersona} className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-2">
                    <PlusIcon className="w-4 h-4" /> Add Persona
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {state.personas.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm relative">
                        <button onClick={() => removePersona(p.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                        <h5 className="font-bold text-purple-800 text-lg mb-1">{p.name}</h5>
                        <div className="text-sm text-gray-700">
                            <p><span className="font-semibold">You Say:</span> "{p.action}"</p>
                            <p className="mt-1"><span className="font-semibold">Result:</span> {p.result}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};