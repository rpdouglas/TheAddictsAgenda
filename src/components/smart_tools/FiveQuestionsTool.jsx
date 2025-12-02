import React from 'react';
import { StarIcon } from '../../utils/icons.jsx';
import { useAutoSave, saveToJournal, JournalButton } from './SmartToolsCommon.jsx';

export const FiveQuestionsTool = () => {
    const [state, setState, status] = useAutoSave('smart_tools_five_questions', {
        q1: '', q2: '', q3: '', q4: '', q5: ''
    });

    const update = (field, value) => setState(prev => ({ ...prev, [field]: value }));

    const handleJournalSave = () => {
        const content = 
            `**1. What do I want for my future?**\n${state.q1}\n\n` +
            `**2. What am I doing to achieve that now?**\n${state.q2}\n\n` +
            `**3. How do I feel about what I'm doing now?**\n${state.q3}\n\n` +
            `**4. What could I do differently?**\n${state.q4}\n\n` +
            `**5. How would changing make me feel?**\n${state.q5}`;
        return saveToJournal('Five Questions', content);
    };

    const questions = [
        { id: 'q1', text: "1. What do I want for my future?", sub: "(e.g., To be a good parent, financial independence, health)" },
        { id: 'q2', text: "2. What am I doing to achieve that now?", sub: "(e.g., Using habits, procrastinating, or taking small steps)" },
        { id: 'q3', text: "3. How do I feel about what I'm doing now?", sub: "(e.g., Dissatisfied, stuck, guilty, or hopeful)" },
        { id: 'q4', text: "4. What could I do differently to help me get what I want?", sub: "(Specific actions to align with your goal)" },
        { id: 'q5', text: "5. How would changing what I do make me feel?", sub: "(Compare this to question #3)" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-blue-800">Tool 3.3: Five Questions</h3>
                    <p className="text-sm text-blue-700">Align your current actions with your future goals.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-blue-700 font-semibold h-4">{status}</span>
                    <JournalButton onSave={handleJournalSave} />
                </div>
            </div>

            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <label className="block font-bold text-gray-800 mb-1">{q.text}</label>
                        <p className="text-xs text-gray-500 mb-2 italic">{q.sub}</p>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm h-20 focus:ring-2 focus:ring-blue-500"
                            placeholder="Type your answer here..."
                            value={state[q.id]}
                            onChange={(e) => update(q.id, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};