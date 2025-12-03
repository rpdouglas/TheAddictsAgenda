import React from 'react';
import { PlusIcon, TrashIcon, ShieldIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton, ToolGuide } from './SmartToolsCommon.jsx';

export const BoundariesTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_boundaries', {
        boundaries: [],
        who: '',
        what: '',
        how: '',
        type: 'Small' // Small or Large
    });

    const explanation = "Learning to say 'no' is vital for protecting your recovery. This tool helps you script and plan boundaries, distinguishing between 'Small' practice boundaries and 'Large' necessary ones.";
    
    const walkthrough = [
        { title: "Select Type", desc: "Choose 'Small Boundary' (for low-stakes practice) or 'Large Boundary' (for major issues)." },
        { title: "Who & What", desc: "Enter the person's name and the specific issue (e.g., 'Coworker asking me to cover shifts')." },
        { title: "How", desc: "Draft your script. Keep it clear and firm (e.g., 'I cannot cover for you. Please don't ask me again.')." },
        { title: "Add to List", desc: "Save your plan. Reviewing this before the conversation gives you confidence." }
    ];

    const addBoundary = () => {
        if (state.who && state.what) {
            setState(prev => ({
                ...prev,
                boundaries: [...prev.boundaries, {
                    id: Date.now(),
                    who: prev.who,
                    what: prev.what,
                    how: prev.how,
                    type: prev.type
                }],
                who: '', what: '', how: ''
            }));
        }
    };

    const removeBoundary = (id) => {
        setState(prev => ({ ...prev, boundaries: prev.boundaries.filter(b => b.id !== id) }));
    };

    const updateInput = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    const handleJournalSave = () => {
        let content = `**Boundary Plan:**\n\n`;
        if (state.boundaries.length === 0) content += "(No boundaries set)";
        state.boundaries.forEach(b => {
            content += `**[${b.type}] With ${b.who}:**\nSubject: ${b.what}\nScript: "${b.how}"\n\n`;
        });
        return saveToJournal('Healthy Boundaries', content);
    };

    return (
        <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-orange-800">Tool 5.5: Healthy Boundaries</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-orange-700 font-semibold h-4">{status}</span>
                        <JournalButton onSave={handleJournalSave} />
                    </div>
                </div>

                <ToolGuide explanation={explanation} walkthrough={walkthrough} />
            </div>

            {/* Input Form */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-200 space-y-3">
                <h4 className="font-bold text-gray-700">Plan a New Boundary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select 
                        className="p-2 border rounded text-sm"
                        value={state.type}
                        onChange={(e) => updateInput('type', e.target.value)}
                    >
                        <option value="Small">Small Boundary (Practice)</option>
                        <option value="Large">Large Boundary</option>
                    </select>
                    <input
                        type="text" placeholder="Who? (e.g., Colleague)"
                        className="p-2 border rounded text-sm"
                        value={state.who}
                        onChange={(e) => updateInput('who', e.target.value)}
                    />
                    <input
                        type="text" placeholder="What? (e.g., Washing mugs)"
                        className="p-2 border rounded text-sm md:col-span-2"
                        value={state.what}
                        onChange={(e) => updateInput('what', e.target.value)}
                    />
                    <textarea
                        placeholder="How? (Draft your script here...)"
                        className="p-2 border rounded text-sm md:col-span-2 h-20"
                        value={state.how}
                        onChange={(e) => updateInput('how', e.target.value)}
                    />
                </div>
                <button onClick={addBoundary} className="w-full bg-orange-600 text-white font-bold py-2 rounded hover:bg-orange-700 flex items-center justify-center gap-2">
                    <PlusIcon className="w-4 h-4" /> Add to List
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.boundaries.map(b => (
                    <div key={b.id} className={`bg-white p-4 rounded-lg border-l-4 shadow-sm relative ${b.type === 'Small' ? 'border-green-500' : 'border-orange-500'}`}>
                        <button onClick={() => removeBoundary(b.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${b.type === 'Small' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                            {b.type}
                        </span>
                        <h5 className="font-bold text-gray-800 text-lg mt-2">{b.who}</h5>
                        <p className="text-sm font-semibold text-gray-600">{b.what}</p>
                        <p className="text-sm text-gray-500 italic mt-2">"{b.how}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};