import React from 'react';
import { ShieldIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton } from './SmartToolsCommon.jsx';

export const DentsTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_dents', {
        deny: '', escape: '', neutralize: '', tasks: '', swap: ''
    });

    const update = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    const handleJournalSave = () => {
        const content = 
            `**Deny/Delay:** ${state.deny}\n` +
            `**Escape:** ${state.escape}\n` +
            `**Neutralize:** ${state.neutralize}\n` +
            `**Tasks:** ${state.tasks}\n` +
            `**Swap:** ${state.swap}`;
        return saveToJournal('DENTS Strategy', content);
    };

    const strategies = [
        { id: 'deny', label: 'D - Deny or Delay', desc: 'How long do urges last? How bad do they get before fading? (e.g., "I will wait 15 mins")' },
        { id: 'escape', label: 'E - Escape', desc: 'What triggers can you get away from? (e.g., Leave the room/situation)' },
        { id: 'neutralize', label: 'N - Neutralize', desc: 'Techniques to sit with urges. (e.g., "This is just a thought, not a command")' },
        { id: 'tasks', label: 'T - Tasks', desc: 'What activities absorb you fully? (e.g., Cooking, Puzzles, Work)' },
        { id: 'swap', label: 'S - Swap', desc: 'What healthy activity can replace the urge? (e.g., Swap beer for sparkling water)' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-teal-800">Tool 4.5: Customize DENTS</h3>
                    <p className="text-sm text-teal-700">Develop strategies to get through an urge.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-teal-700 font-semibold h-4">{status}</span>
                    <JournalButton onSave={handleJournalSave} />
                </div>
            </div>

            <div className="space-y-4">
                {strategies.map((s) => (
                    <div key={s.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldIcon className="w-5 h-5 text-teal-600" />
                            <h4 className="font-bold text-gray-800">{s.label}</h4>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 ml-7">{s.desc}</p>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-teal-500"
                            placeholder={`My strategy for ${s.id}...`}
                            value={state[s.id]}
                            onChange={(e) => update(s.id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};