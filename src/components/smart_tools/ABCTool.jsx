import React from 'react';
import { useAutoSave, saveToJournal, JournalButton } from './SmartToolsCommon.jsx';

export const ABCTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_abc', {
        activatingEvent: '',
        beliefs: '',
        consequences: '',
        dispute: '',
        effectiveBelief: ''
    });

    const update = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    const handleJournalSave = () => {
        const content = 
            `**Activating Event:**\n${state.activatingEvent}\n\n` +
            `**Beliefs:**\n${state.beliefs}\n\n` +
            `**Consequences:**\n${state.consequences}\n\n` +
            `**Dispute:**\n${state.dispute}\n\n` +
            `**Effective New Belief:**\n${state.effectiveBelief}`;
        
        return saveToJournal('ABCs of Coping', content);
    };

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-purple-800">Tool 3.1: The ABCs of Coping</h3>
                    <p className="text-sm text-purple-700">Activating Event &rarr; Beliefs &rarr; Consequences</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-purple-700 font-semibold h-4">{status}</span>
                    <JournalButton onSave={handleJournalSave} />
                </div>
            </div>

            <div className="space-y-4">
                {[
                    { key: 'activatingEvent', label: 'A - Activating Event', placeholder: 'What happened? Just the facts.' },
                    { key: 'beliefs', label: 'B - Beliefs', placeholder: 'What did you tell yourself about it? (Irrational thoughts)' },
                    { key: 'consequences', label: 'C - Consequences', placeholder: 'How did you feel and act?' },
                    { key: 'dispute', label: 'D - Dispute', placeholder: 'Challenge your irrational beliefs. Is it true? Helpful?' },
                    { key: 'effectiveBelief', label: 'E - Effective New Belief', placeholder: 'What is a more rational, helpful way to see this?' }
                ].map(field => (
                    <div key={field.key} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <label className="block font-bold text-gray-700 mb-2">{field.label}</label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm h-24 focus:ring-2 focus:ring-purple-500"
                            placeholder={field.placeholder}
                            value={state[field.key]}
                            onChange={(e) => update(field.key, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};