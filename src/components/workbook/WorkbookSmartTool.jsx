// src/components/workbook/WorkbookSmartTool.jsx
import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../../utils/icons.jsx';
import { 
    SmartGoalTool, 
    CBATool, 
    ABCTool, 
    UrgeLogTool, 
    LifestyleBalanceTool,
    SelfCompassionTool,
    FiveQuestionsTool,
    DentsTool,
    PersonifyTool,
    BoundariesTool
} from '../SmartRecoveryTools.jsx';

const WorkbookSmartTool = ({ topic, onBack, onNext, onPrevious, hasNext, hasPrevious }) => {
    
    const renderCustomTool = () => {
        switch (topic.customComponent) {
            case 'SmartGoalTool': return <SmartGoalTool />;
            case 'CBATool': return <CBATool />;
            case 'ABCTool': return <ABCTool />;
            case 'UrgeLogTool': return <UrgeLogTool />;
            case 'LifestyleBalanceTool': return <LifestyleBalanceTool />;
            case 'SelfCompassionTool': return <SelfCompassionTool />;
            case 'FiveQuestionsTool': return <FiveQuestionsTool />;
            case 'DentsTool': return <DentsTool />;
            case 'PersonifyTool': return <PersonifyTool />;
            case 'BoundariesTool': return <BoundariesTool />;
            default: return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
                <button onClick={onBack} className="flex items-center text-pink-600 hover:text-pink-700 font-semibold">
                    <ArrowLeftIcon /><span className="ml-2">Back</span>
                </button>
            </div>
            <h3 className="text-2xl font-bold text-deep-charcoal mb-4 flex-shrink-0">{topic.title}</h3>
            <div className="overflow-y-auto flex-grow pr-2">
                {renderCustomTool()}
            </div>
            
            {/* Navigation Footer for Custom Tools */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
                <button 
                    onClick={onPrevious} 
                    disabled={!hasPrevious}
                    className={`flex items-center gap-2 font-semibold ${!hasPrevious ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-pink-600'}`}
                >
                    <ArrowLeftIcon className="w-4 h-4" /> Previous Tool
                </button>
                <button 
                    onClick={onNext} 
                    disabled={!hasNext}
                    className={`flex items-center gap-2 font-semibold ${!hasNext ? 'text-gray-300 cursor-not-allowed' : 'text-pink-600 hover:text-pink-700'}`}
                >
                    Next Tool <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default WorkbookSmartTool;