import React from 'react';
import { PlusIcon, TrashIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton, ToolGuide } from './SmartToolsCommon.jsx';

const CBAQuadrant = ({ title, id, bg, items, inputValue, onUpdateInput, onAddItem, onRemoveItem }) => (
    <div className={`p-4 rounded-lg border ${bg} h-full`}>
        <h4 className="font-bold text-sm text-gray-800 mb-3 border-b pb-2 border-gray-300">{title}</h4>
        <div className="flex gap-2 mb-2">
            <input
                type="text"
                className="w-full p-1 text-sm border border-gray-300 rounded"
                placeholder="Add item..."
                value={inputValue || ''}
                onChange={(e) => onUpdateInput(id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAddItem(id)}
            />
            <button onClick={() => onAddItem(id)} className="text-blue-600 hover:bg-blue-100 rounded px-2"><PlusIcon className="w-4 h-4" /></button>
        </div>
        <ul className="space-y-1 max-h-40 overflow-y-auto">
            {items.map(item => (
                <li key={item.id} className="flex justify-between items-start text-sm bg-white/50 p-1 rounded">
                    <span>• {item.text}</span>
                    <button onClick={() => onRemoveItem(id, item.id)} className="text-red-400 hover:text-red-600"><TrashIcon className="w-3 h-3" /></button>
                </li>
            ))}
        </ul>
    </div>
);

export const CBATool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_cba', {
        behavior: '',
        quadrants: {
            advantages_doing: [],
            disadvantages_doing: [],
            advantages_stopping: [],
            disadvantages_stopping: []
        },
        inputs: {
            advantages_doing: '',
            disadvantages_doing: '',
            advantages_stopping: '',
            disadvantages_stopping: ''
        }
    });

    const explanation = "The Cost Benefit Analysis (CBA) is a decision-making tool that helps you see the 'big picture' of your addictive behavior. By weighing the short-term and long-term pros and cons of using versus stopping, you can build motivation to change. It moves you from 'feeling' you should quit to 'knowing' why you must.";
    
    const walkthrough = [
        { title: "Define the Behavior", desc: "Type the specific behavior you are analyzing (e.g., 'Drinking alcohol,' 'Gambling,' 'Isolating') at the top." },
        { title: "Fill the Quadrants", desc: "List the Advantages/Disadvantages of using, and the Advantages/Disadvantages of stopping." },
        { title: "Review", desc: "Use the 'Add item' input to list as many points as possible. Seeing the costs of using pile up reinforces your recovery goal." },
        { title: "Save", desc: "Your work auto-saves. Tap 'Save to Journal' to keep a permanent record." }
    ];

    const addItem = (quadrant) => {
        if (state.inputs[quadrant].trim()) {
            setState(prev => ({
                ...prev,
                quadrants: {
                    ...prev.quadrants,
                    [quadrant]: [...prev.quadrants[quadrant], { id: Date.now(), text: prev.inputs[quadrant] }]
                },
                inputs: { ...prev.inputs, [quadrant]: '' }
            }));
        }
    };

    const removeItem = (quadrant, id) => {
        setState(prev => ({
            ...prev,
            quadrants: {
                ...prev.quadrants,
                [quadrant]: prev.quadrants[quadrant].filter(i => i.id !== id)
            }
        }));
    };

    const updateInput = (quadrant, val) => {
        setState(prev => ({ ...prev, inputs: { ...prev.inputs, [quadrant]: val } }));
    };

    const handleJournalSave = () => {
        let content = `**Target Behavior:** ${state.behavior}\n\n`;
        const labels = {
            advantages_doing: 'Advantages of Doing',
            disadvantages_doing: 'Disadvantages of Doing',
            advantages_stopping: 'Advantages of Stopping',
            disadvantages_stopping: 'Disadvantages of Stopping'
        };
        
        Object.entries(state.quadrants).forEach(([key, items]) => {
            content += `**${labels[key]}:**\n`;
            if (items.length === 0) content += `(None listed)\n`;
            items.forEach(i => content += `- ${i.text}\n`);
            content += `\n`;
        });

        return saveToJournal('Cost Benefit Analysis', content);
    };

    return (
        <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                        <h3 className="font-bold text-lg text-yellow-800">Tool 1.1: Cost Benefit Analysis</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-4">
                        <span className="text-xs text-yellow-700 font-semibold h-4">{status}</span>
                        <JournalButton onSave={handleJournalSave} />
                    </div>
                </div>

                <ToolGuide explanation={explanation} walkthrough={walkthrough} />

                <input
                    type="text"
                    className="w-full p-2 border border-yellow-300 rounded bg-white font-medium placeholder-gray-400"
                    placeholder="Target Behavior (e.g., Drinking, Isolating)..."
                    value={state.behavior}
                    onChange={(e) => setState(prev => ({ ...prev, behavior: e.target.value }))}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CBAQuadrant 
                    title="Advantages of Using/Doing" 
                    id="advantages_doing" 
                    bg="bg-green-50 border-green-200" 
                    items={state.quadrants.advantages_doing}
                    inputValue={state.inputs.advantages_doing}
                    onUpdateInput={updateInput}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                />
                <CBAQuadrant 
                    title="Disadvantages of Using/Doing" 
                    id="disadvantages_doing" 
                    bg="bg-red-50 border-red-200" 
                    items={state.quadrants.disadvantages_doing}
                    inputValue={state.inputs.disadvantages_doing}
                    onUpdateInput={updateInput}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                />
                <CBAQuadrant 
                    title="Advantages of Stopping" 
                    id="advantages_stopping" 
                    bg="bg-blue-50 border-blue-200" 
                    items={state.quadrants.advantages_stopping}
                    inputValue={state.inputs.advantages_stopping}
                    onUpdateInput={updateInput}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                />
                <CBAQuadrant 
                    title="Disadvantages of Stopping" 
                    id="disadvantages_stopping" 
                    bg="bg-orange-50 border-orange-200" 
                    items={state.quadrants.disadvantages_stopping}
                    inputValue={state.inputs.disadvantages_stopping}
                    onUpdateInput={updateInput}
                    onAddItem={addItem}
                    onRemoveItem={removeItem}
                />
            </div>
        </div>
    );
};