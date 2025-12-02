// src/components/SmartRecoveryTools.jsx
import React, { useState, useEffect } from 'react';
import DataStore from '../utils/dataStore.js';

import { 
    StarIcon, TrendingUpIcon, ShieldIcon, HeartIcon, 
    CollectionIcon, CheckIcon, TrashIcon, PlusIcon,
    EditIcon, ArrowLeftIcon 
} from '../utils/icons.jsx';

import { 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

// --- HELPER: Auto-Save Hook ---
// Handles loading data on mount and saving changes with a debounce
const useAutoSave = (key, initialState) => {
    const [data, setData] = useState(initialState);
    const [isLoaded, setIsLoaded] = useState(false);
    const [status, setStatus] = useState('');

    // Load on mount
    useEffect(() => {
        const load = async () => {
            const saved = await DataStore.load(key);
            if (saved) setData(saved);
            setIsLoaded(true);
        };
        load();
    }, [key]);

    // Save on change (Debounced)
    useEffect(() => {
        if (!isLoaded) return;
        setStatus('Saving...');
        const timer = setTimeout(async () => {
            await DataStore.save(key, data);
            setStatus('Saved');
            setTimeout(() => setStatus(''), 2000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [data, key, isLoaded]);

    return [data, setData, status];
};

// --- TOOL 1: SMART GOAL ---
export const SmartGoalTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_goal', {
        goal: { specific: '', measurable: '', agreeable: '', realistic: '', timeBound: '' },
        tasks: [],
        newTask: ''
    });

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

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-blue-800">Tool 6.3: Set an Effective Goal</h3>
                    <span className="text-xs text-blue-600 font-semibold">{status}</span>
                </div>
                <p className="text-sm text-blue-700 mb-4">Goals should be Specific, Measurable, Achievable, Realistic, and Time-bound.</p>
                
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

// --- TOOL 2: CBA (Cost Benefit Analysis) ---
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

    const Quadrant = ({ title, id, bg }) => (
        <div className={`p-4 rounded-lg border ${bg} h-full`}>
            <h4 className="font-bold text-sm text-gray-800 mb-3 border-b pb-2 border-gray-300">{title}</h4>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                    placeholder="Add item..."
                    value={state.inputs[id]}
                    onChange={(e) => updateInput(id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem(id)}
                />
                <button onClick={() => addItem(id)} className="text-blue-600 hover:bg-blue-100 rounded px-2"><PlusIcon className="w-4 h-4" /></button>
            </div>
            <ul className="space-y-1 max-h-40 overflow-y-auto">
                {state.quadrants[id].map(item => (
                    <li key={item.id} className="flex justify-between items-start text-sm bg-white/50 p-1 rounded">
                        <span>• {item.text}</span>
                        <button onClick={() => removeItem(id, item.id)} className="text-red-400 hover:text-red-600"><TrashIcon className="w-3 h-3" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex justify-between">
                    <h3 className="font-bold text-lg text-yellow-800">Tool 1.1: Cost Benefit Analysis</h3>
                    <span className="text-xs text-yellow-700 font-semibold">{status}</span>
                </div>
                <input
                    type="text"
                    className="w-full mt-2 p-2 border border-yellow-300 rounded bg-white"
                    placeholder="Target Behavior (e.g., Drinking, Isolating)..."
                    value={state.behavior}
                    onChange={(e) => setState(prev => ({ ...prev, behavior: e.target.value }))}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Quadrant title="Advantages of Using/Doing" id="advantages_doing" bg="bg-green-50 border-green-200" />
                <Quadrant title="Disadvantages of Using/Doing" id="disadvantages_doing" bg="bg-red-50 border-red-200" />
                <Quadrant title="Advantages of Stopping" id="advantages_stopping" bg="bg-blue-50 border-blue-200" />
                <Quadrant title="Disadvantages of Stopping" id="disadvantages_stopping" bg="bg-orange-50 border-orange-200" />
            </div>
        </div>
    );
};

// --- TOOL 3: ABC Tool ---
export const ABCTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_abc', {
        activatingEvent: '',
        beliefs: '',
        consequences: '',
        dispute: '',
        effectiveBelief: ''
    });

    const update = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg text-purple-800">Tool 3.1: The ABCs of Coping</h3>
                    {/* FIXED: Replaced "->" with "&rarr;" to fix JSX syntax error */}
                    <p className="text-sm text-purple-700">Activating Event &rarr; Beliefs &rarr; Consequences</p>
                </div>
                <span className="text-xs text-purple-700 font-semibold">{status}</span>
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

// --- TOOL 4: URGE LOG ---
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

    return (
        <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex justify-between">
                    <h3 className="font-bold text-lg text-red-800">Tool 2.1: Urge Log</h3>
                    <span className="text-xs text-red-700 font-semibold">{status}</span>
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

// --- TOOL 5: LIFESTYLE BALANCE (RADAR CHART) ---
export const LifestyleBalanceTool = () => {
    const categories = [
        { id: 'physical', name: 'Physical' },
        { id: 'mental', name: 'Mental' },
        { id: 'relationships', name: 'Relationships' },
        { id: 'work', name: 'Work/School' },
        { id: 'spiritual', name: 'Spirituality' },
        { id: 'leisure', name: 'Leisure' },
    ];

    const [state, setState, status] = useAutoSave('smart_tools_balance', {
        scores: { physical: 5, mental: 5, relationships: 5, work: 5, spiritual: 5, leisure: 5 }
    });

    const updateScore = (id, val) => {
        setState(prev => ({
            ...prev,
            scores: { ...prev.scores, [id]: parseInt(val) }
        }));
    };

    // Transform state for Recharts
    const chartData = categories.map(cat => ({
        subject: cat.name,
        A: state.scores[cat.id],
        fullMark: 10,
    }));

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex justify-between">
                    <h3 className="font-bold text-lg text-indigo-800">Tool 4.2: Lifestyle Balance</h3>
                    <span className="text-xs text-indigo-700 font-semibold">{status}</span>
                </div>
                <p className="text-sm text-indigo-600 mb-4">Rate your satisfaction in each area (1-10).</p>
                
                <div className="space-y-4">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center gap-4">
                            <label className="w-32 text-xs font-bold text-gray-700">{cat.name}</label>
                            <input 
                                type="range" min="1" max="10" 
                                className="flex-grow accent-indigo-600"
                                value={state.scores[cat.id]} 
                                onChange={(e) => updateScore(cat.id, e.target.value)} 
                            />
                            <span className="w-6 text-center font-bold text-indigo-600">{state.scores[cat.id]}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar name="Balance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};