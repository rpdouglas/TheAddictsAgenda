// src/components/journal/MoodGraph.jsx
import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon, TrendingUpIcon } from '../../utils/icons.jsx';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Area, 
  ComposedChart, Bar, Line, Legend
} from 'recharts';

const MoodGraphView = ({ items, onBack, onPointClick }) => {
    const [timeRange, setTimeRange] = useState('30'); // '7', '30', 'all'

    // --- Helper: Simple Linear Regression for Trendline ---
    const calculateTrendline = (data) => {
        if (data.length < 2) return data;

        const n = data.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;

        // X is the index (0, 1, 2...), Y is the Mood
        data.forEach((point, i) => {
            sumX += i;
            sumY += point.mood;
            sumXY += i * point.mood;
            sumXX += i * i;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return data.map((point, i) => ({
            ...point,
            trend: Number((slope * i + intercept).toFixed(1))
        }));
    };

    // --- Helper: Extract Temp from String "Cloudy, 22°C" ---
    const extractTemp = (weatherStr) => {
        if (!weatherStr) return null;
        const match = weatherStr.match(/(-?\d+)/); // Find integer (supports negative)
        return match ? parseInt(match[0], 10) : null;
    };

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

        const mappedData = filteredItems.map(item => ({
            id: item.id,
            date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            fullDate: new Date(item.timestamp).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }),
            mood: item.mood,
            temp: extractTemp(item.weather),
            weatherDesc: item.weather || 'No Data',
            entry: item,
        }));

        // Attach Trendline
        return calculateTrendline(mappedData);

    }, [items, timeRange]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Find payload items by dataKey to ensure correct display
            const moodData = payload.find(p => p.dataKey === 'mood');
            const tempData = payload.find(p => p.dataKey === 'temp');
            const trendData = payload.find(p => p.dataKey === 'trend');
            
            // Safety check for metadata
            const metadata = moodData ? moodData.payload : (payload[0] ? payload[0].payload : {});

            return (
                <div className="bg-white p-3 border border-blue-100 rounded-lg shadow-lg z-50">
                    <p className="text-sm font-bold text-gray-700 mb-1">{metadata.fullDate}</p>
                    
                    {moodData && (
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-sm font-semibold text-gray-600">Mood:</span>
                            <span className="text-sm font-bold text-blue-600">{moodData.value}/10</span>
                        </div>
                    )}
                    
                    {trendData && (
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                            <span className="text-xs text-gray-500">Trend: {trendData.value}</span>
                        </div>
                    )}

                    {tempData && tempData.value !== null && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                             <div className="w-2 h-2 bg-gray-300"></div>
                             <span className="text-xs text-gray-500">{metadata.weatherDesc}</span>
                        </div>
                    )}

                    <p className="text-[10px] text-gray-400 mt-2 italic">Click chart to view entry</p>
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
                        <ComposedChart 
                            data={chartData} 
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            onClick={handleChartClick}
                        >
                            <defs>
                                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            
                            {/* X-Axis: Dates */}
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12, fill: '#6b7280' }} 
                                tickLine={false} 
                                axisLine={{ stroke: '#e5e7eb' }} 
                                minTickGap={30} 
                            />
                            
                            {/* Y-Axis 1: Mood (Left) */}
                            <YAxis 
                                yAxisId="left"
                                domain={[0, 10]} 
                                tickCount={6} 
                                tick={{ fontSize: 12, fill: '#6b7280' }} 
                                tickLine={false} 
                                axisLine={false} 
                                label={{ value: 'Mood', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af', fontSize: 10 } }}
                            />

                            {/* Y-Axis 2: Temperature (Right) */}
                            <YAxis 
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 10, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                unit="°"
                                label={{ value: 'Temp', angle: 90, position: 'insideRight', style: { fill: '#9ca3af', fontSize: 10 } }}
                            />
                            
                            <Tooltip content={<CustomTooltip />} wrapperStyle={{ pointerEvents: 'none' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                            
                            {/* 1. Temperature Bars (Background) */}
                            <Bar 
                                yAxisId="right"
                                dataKey="temp" 
                                name="Temp (°C)"
                                fill="#e5e7eb" 
                                barSize={20}
                                radius={[4, 4, 0, 0]}
                            />

                            {/* 2. Mood Area (Middle) */}
                            <Area 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="mood" 
                                name="Mood Score"
                                stroke="#2563eb" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorMood)" 
                                dot={{ 
                                    r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#fff',
                                    cursor: 'pointer', onClick: handleChartClick 
                                }} 
                                activeDot={{ 
                                    r: 6, strokeWidth: 0, fill: '#1d4ed8',
                                    cursor: 'pointer', onClick: handleChartClick 
                                }} 
                            />

                            {/* 3. Trendline (Top) */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="trend"
                                name="Recovery Trend"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                activeDot={false}
                                isAnimationActive={false}
                            />
                            
                            <ReferenceLine yAxisId="left" y={5} stroke="#e5e7eb" strokeDasharray="3 3" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default MoodGraphView;