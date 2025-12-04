// src/components/workbook/WorkbookMenu.jsx
import React from 'react';
import { SparklesIcon } from '../../utils/icons.jsx';

const WorkbookMenu = ({ workbookData, calculateCompletion, overallCompletion, onSelectCategory, onGenerateInsights }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">Recovery Workbook</h2> 
            <p className="text-deep-charcoal/70 mb-6">Track your progress through the exercises.</p> 
            
            <div className="mb-6"> 
                <div className="flex justify-between items-center mb-1"> 
                    <span className="text-sm font-semibold text-deep-charcoal/70">Overall Progress</span> 
                    <span className="text-sm font-semibold text-pink-600">{overallCompletion.percentage}%</span> 
                </div> 
                <div className="w-full bg-light-stone/50 rounded-full h-2.5">
                    <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${overallCompletion.percentage}%` }}></div>
                </div> 
            </div> 

            <div className="mt-6 mb-4 border-t pt-6">
                <button
                    onClick={onGenerateInsights}
                    className="w-full flex items-center justify-center gap-2 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:brightness-95 transition-colors"
                >
                    <SparklesIcon className="w-5 h-5"/> Get AI Insights on Your Work
                </button>
                <p className="text-xs text-deep-charcoal/60 text-center mt-2">Analyzes your completed entries to find themes and patterns in your recovery journey.</p>
            </div>

            <ul className="space-y-4"> 
                {Object.keys(workbookData).map(key => { 
                    const category = workbookData[key]; 
                    if (!category) return null; 
                    const { completed, total, percentage } = calculateCompletion(key); 
                    return ( 
                        <li key={key}> 
                            <button onClick={() => onSelectCategory(category)} className="w-full text-left p-4 bg-pure-white/60 hover:bg-pink-100 rounded-lg shadow-sm"> 
                                <h3 className="font-semibold text-deep-charcoal text-lg">{category.title}</h3> 
                                <p className="text-deep-charcoal/70 mt-1 text-sm">{category.description}</p> 
                                <div className="mt-3"> 
                                    <div className="flex justify-between items-center mb-1"> 
                                        <span className="text-xs font-semibold text-deep-charcoal/60">{completed} / {total} Completed</span> 
                                        <span className="text-xs font-semibold text-pink-600">{percentage}%</span> 
                                    </div> 
                                    <div className="w-full bg-light-stone/50 rounded-full h-1.5">
                                        <div className="bg-pink-600 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div> 
                                </div> 
                            </button> 
                        </li> 
                    ); 
                })} 
            </ul> 
        </div> 
    );
};

export default WorkbookMenu;