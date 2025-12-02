import React from 'react';
import { useAutoSave, saveToJournal, JournalButton } from './SmartToolsCommon.jsx';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

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

    const handleJournalSave = () => {
        let content = `**Lifestyle Balance Snapshot:**\n\n`;
        categories.forEach(cat => {
            content += `- **${cat.name}:** ${state.scores[cat.id]}/10\n`;
        });
        return saveToJournal('Lifestyle Balance', content);
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
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-indigo-800">Tool 4.2: Lifestyle Balance</h3>
                        <p className="text-sm text-indigo-600 mb-4">Rate your satisfaction in each area (1-10).</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-indigo-700 font-semibold h-4">{status}</span>
                        <JournalButton onSave={handleJournalSave} />
                    </div>
                </div>
                
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