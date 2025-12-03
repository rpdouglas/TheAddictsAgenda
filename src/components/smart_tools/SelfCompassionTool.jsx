import React from 'react';
import { HeartIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton, ToolGuide } from './SmartToolsCommon.jsx';

export const SelfCompassionTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_compassion', {
        kindness: '',
        humanity: '',
        mindfulness: ''
    });

    const explanation = "Recovery is hard, and beating yourself up often leads back to relapse. This tool helps you practice treating yourself with the same kindness you would offer a friend. It focuses on three core elements: Self-Kindness, Common Humanity, and Mindfulness.";
    
    const walkthrough = [
        { title: "Self-Kindness", desc: "Write a statement that counters self-judgment (e.g., 'It is okay to make mistakes; I am learning')." },
        { title: "Common Humanity", desc: "Remind yourself that you are not alone. Write about how others share this struggle." },
        { title: "Mindfulness", desc: "Write a plan to stay present (e.g., 'I will notice my feelings of shame without judging them as bad')." }
    ];

    const update = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    const handleJournalSave = () => {
        const content = 
            `**Self-Kindness Practices:**\n${state.kindness}\n\n` +
            `**Common Humanity (Connection):**\n${state.humanity}\n\n` +
            `**Mindfulness Practices:**\n${state.mindfulness}`;
        return saveToJournal('Self-Compassion Plan', content);
    };

    return (
        <div className="space-y-6">
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg text-pink-800">Tool 2.2: Practice Self-Compassion</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-pink-700 font-semibold h-4">{status}</span>
                        <JournalButton onSave={handleJournalSave} />
                    </div>
                </div>

                <ToolGuide explanation={explanation} walkthrough={walkthrough} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Self Kindness */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                    <div className="flex items-center gap-2 mb-2 text-pink-600">
                        <HeartIcon className="w-5 h-5" />
                        <h4 className="font-bold text-sm uppercase">Self-Kindness</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">How can you be kind to yourself instead of judging?</p>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded text-sm h-32 focus:ring-2 focus:ring-pink-500"
                        placeholder="I will practice self-kindness by..."
                        value={state.kindness}
                        onChange={(e) => update('kindness', e.target.value)}
                    />
                </div>

                {/* 2. Common Humanity */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                    <div className="flex items-center gap-2 mb-2 text-pink-600">
                        <HeartIcon className="w-5 h-5" />
                        <h4 className="font-bold text-sm uppercase">Common Humanity</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Recognize that your struggle is shared by others.</p>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded text-sm h-32 focus:ring-2 focus:ring-pink-500"
                        placeholder="I will connect with others by..."
                        value={state.humanity}
                        onChange={(e) => update('humanity', e.target.value)}
                    />
                </div>

                {/* 3. Mindfulness */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                    <div className="flex items-center gap-2 mb-2 text-pink-600">
                        <HeartIcon className="w-5 h-5" />
                        <h4 className="font-bold text-sm uppercase">Mindfulness</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Practice staying present rather than over-identifying.</p>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded text-sm h-32 focus:ring-2 focus:ring-pink-500"
                        placeholder="I will practice mindfulness by..."
                        value={state.mindfulness}
                        onChange={(e) => update('mindfulness', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};