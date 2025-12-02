import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon, TrendingUpIcon } from '../../utils/icons.jsx';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Area, AreaChart 
} from 'recharts';

const MoodGraphView = ({ items, onBack, onPointClick }) => {
    const [timeRange, setTimeRange] = useState('30'); // '7', '30', 'all'

    // 1. Prepare Data
    const chartData = useMemo(() => {
        let filteredItems = items
            .filter(item => typeof item.mood === 'number' && item.mood > 0)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        if (timeRange !== 'all') {
            const days = parseInt(timeRange);
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - days);
            filteredItems = filteredItems.filter(item => new Date(item.timestamp) >= cutoff);
        }

        return filteredItems.map(item => ({
            id: item.id,
            date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            fullDate: new Date(item.timestamp).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }),
            mood: item.mood,
            entry: item,
        }));
    }, [items, timeRange]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-blue-100 rounded-lg shadow-lg">
                    <p className="text-sm font-bold text-gray-700">{payload[0].payload.fullDate}</p>
                    <p className="text-sm text-blue-600 font-semibold">Mood: <span className="text-lg">{payload[0].value}</span>/10</p>
                    <p className="text-xs text-gray-400 mt-1">Tap dot to view entry</p>
                </div>
            );
        }
        return null;
    };

    // Helper to handle clicks safely
    const handleChartClick = (data) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            onPointClick(data.activePayload[0].payload.entry);
        } else if (data && data.payload && data.payload.entry) {
            // Fallback for direct dot clicks which pass the payload directly
            onPointClick(data.payload.entry);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-700 font-semibold flex-shrink-0">
                    <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back</span>
                </button>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['7', '30', 'all'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1 text-sm font-medium rounded-md transition-all ${timeRange === range ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {range === 'all' ? 'All Time' : `${range} Days`}
                        </button>
                    ))}
                </div>
            </div>

            {chartData.length < 2 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <TrendingUpIcon className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-600">Not Enough Data</h3>
                    <p className="text-gray-500 mt-2">{items.length > 0 ? "Try adjusting the time range." : "Record your mood in at least two entries."}</p>
                </div>
            ) : (
                <div className="flex-grow w-full bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart 
                            data={chartData} 
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            // 1. Chart Background Click (Best effort)
                            onClick={handleChartClick}
                        >
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} minTickGap={30} />
                            <YAxis domain={[0, 10]} tickCount={6} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                            
                            <Tooltip content={<CustomTooltip />} wrapperStyle={{ pointerEvents: 'none' }} />
                            
                            <ReferenceLine y={5} stroke="#e5e7eb" strokeDasharray="3 3" />
                            
                            <Area 
                                type="monotone" 
                                dataKey="mood" 
                                stroke="#2563eb" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorMood)" 
                                // 2. Explicit Dot Click (The Fix)
                                dot={{ 
                                    r: 6, 
                                    stroke: '#2563eb', 
                                    strokeWidth: 2, 
                                    fill: '#fff',
                                    cursor: 'pointer',
                                    onClick: handleChartClick // Direct click handler on dots
                                }} 
                                activeDot={{ 
                                    r: 8, 
                                    strokeWidth: 0, 
                                    fill: '#1d4ed8', 
                                    cursor: 'pointer',
                                    onClick: handleChartClick // Direct click handler on active dot
                                }} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default MoodGraphView;