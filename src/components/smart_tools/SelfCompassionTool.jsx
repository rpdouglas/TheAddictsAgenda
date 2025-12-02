import React from 'react';
import { HeartIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton } from './SmartToolsCommon.jsx';

export const SelfCompassionTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_compassion', {
        kindness: '',
        humanity: '',
        mindfulness: ''
    });

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
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-pink-800">Tool 2.2: Practice Self-Compassion</h3>
                    <p className="text-sm text-pink-700">Counter feelings of hopelessness by being kind to yourself.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-pink-700 font-semibold h-4">{status}</span>
                    <JournalButton onSave={handleJournalSave} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Self Kindness */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                    <div className="flex items-center gap-2 mb-2 text-pink-600">
                        <HeartIcon className="w-5 h-5" />
                        <h4 className="font-bold text-sm uppercase">Self-Kindness</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">How can you be kind to yourself instead of judging? (e.g., Talk to yourself like a friend).</p>
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
                    <p className="text-xs text-gray-500 mb-3">Recognize that your struggle is shared by others. You are not alone.</p>
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
                    <p className="text-xs text-gray-500 mb-3">Practice staying present rather than over-identifying with emotions.</p>
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