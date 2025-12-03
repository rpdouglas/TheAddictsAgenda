import React from 'react';
import { PlusIcon, CheckIcon, TrashIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton, ToolGuide } from './SmartToolsCommon.jsx';

export const SmartGoalTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_goal', {
        goal: { specific: '', measurable: '', agreeable: '', realistic: '', timeBound: '' },
        tasks: [],
        newTask: ''
    });

    const explanation = "Vague goals like 'get better' are hard to achieve. This tool uses the S.M.A.R.T. criteria (Specific, Measurable, Achievable, Realistic, Time-bound) to turn wishes into actionable plans.";
    
    const walkthrough = [
        { title: "Define the Goal", desc: "Fill in the five fields to refine your goal (e.g., instead of 'Exercise,' write 'Walk 30 minutes' under Specific)." },
        { title: "Action Plan", desc: "Use the 'Action Plan' section to break the goal into small steps." },
        { title: "Track", desc: "Type a step (e.g., 'Buy shoes') and click '+'. Check the box when completed." }
    ];

    const updateGoal = (field, value) => {
        setState(prev => ({ ...prev, goal: { ...prev.goal, [field]: value } }));
    };

    const addTask = () => {
        if (state.newTask.trim()) {
            setState(prev => ({
                ...prev,
                tasks: [...prev.tasks, { id: Date.now(), text: prev.newTask, completed: false }],
                newTask: ''
            }));
        }
    };

    const toggleTask = (id) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));
    };

    const deleteTask = (id) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.filter(t => t.id !== id)
        }));
    };

    const handleJournalSave = () => {
        const content = `**Goal:**\n` +
            `- Specific: ${state.goal.specific}\n` +
            `- Measurable: ${state.goal.measurable}\n` +
            `- Achievable: ${state.goal.agreeable}\n` +
            `- Realistic: ${state.goal.realistic}\n` +
            `- Time-bound: ${state.goal.timeBound}\n\n` +
            `**Action Plan:**\n` +
            state.tasks.map(t => `- [${t.completed ? 'x' : ' '}] ${t.text}`).join('\n');
        
        return saveToJournal('Smart Goal', content);
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-blue-800">Tool 6.3: Set an Effective Goal</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-blue-600 font-semibold h-4">{status}</span>
                        <JournalButton onSave={handleJournalSave} />
                    </div>
                </div>

                <ToolGuide explanation={explanation} walkthrough={walkthrough} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(state.goal).map(key => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-blue-800 uppercase mb-1">{key}</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-blue-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                value={state.goal[key]}
                                onChange={(e) => updateGoal(key, e.target.value)}
                                placeholder={`Make it ${key}...`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-gray-700 mb-3">Action Plan (Tasks)</h4>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded text-sm"
                        placeholder="Add a step..."
                        value={state.newTask}
                        onChange={(e) => setState(prev => ({ ...prev, newTask: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />
                    <button onClick={addTask} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                <ul className="space-y-2">
                    {state.tasks.map(task => (
                        <li key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100">
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleTask(task.id)} className={`p-1 rounded-full border ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 text-transparent'}`}>
                                    <CheckIcon className="w-4 h-4" />
                                </button>
                                <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-700'}>{task.text}</span>
                            </div>
                            <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-600">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                    {state.tasks.length === 0 && <p className="text-center text-gray-400 text-sm italic">No tasks added yet.</p>}
                </ul>
            </div>
        </div>
    );
};