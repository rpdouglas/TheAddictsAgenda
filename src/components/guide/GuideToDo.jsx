// src/components/guide/GuideToDo.jsx
import React from 'react';
import { 
    CheckCircleIcon, 
    PlusIcon, 
    ClockIcon, 
    FireIcon, 
    InfinityIcon, // Changed from RepeatIcon
    CalendarIcon,
    ArrowLeftIcon,
    PenIcon
} from '../../utils/icons.jsx';

const GuideToDo = () => {
    return (
        <div className="space-y-8 text-gray-700">
            {/* Introduction */}
            <section>
                <h3 className="text-xl font-bold text-teal-700 mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="w-6 h-6" />
                    Recovery Accountability Engine
                </h3>
                <p className="mb-4">
                    The To-Do List is more than just a checklist; it is designed to help you build consistency and manage your recovery actions. 
                    It separates your daily maintenance habits from your one-time growth tasks.
                </p>
            </section>

            {/* Feature 1: The Two Sections */}
            <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">1. Organization & Grouping</h4>
                <p className="mb-3 text-sm">
                    Your tasks are automatically sorted into two collapsible sections:
                </p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <div className="mt-1"><InfinityIcon className="w-5 h-5 text-teal-600" /></div>
                        <div>
                            <strong className="text-teal-700">Recurring Practices:</strong>
                            <p className="text-sm text-gray-600">
                                Habits you perform Daily or Weekly (e.g., "Morning Prayer," "Call Sponsor"). 
                                These items are marked with the <span className="font-semibold">Infinity Icon</span> to represent your ongoing journey.
                            </p>
                        </div>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="mt-1"><CheckCircleIcon className="w-5 h-5 text-yellow-600" /></div>
                        <div>
                            <strong className="text-yellow-700">Action Items & Tasks:</strong>
                            <p className="text-sm text-gray-600">
                                One-time goals or tasks saved from your Workbook AI Insights. 
                                These items are <span className="font-semibold">Yellow</span> (or <span className="font-semibold text-red-600">Red</span> for AI Action Items).
                            </p>
                        </div>
                    </li>
                </ul>
            </section>

            {/* Feature 2: Recurring Engine & Streaks */}
            <section className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                    <FireIcon className="w-5 h-5" />
                    Streaks & Recurrence
                </h4>
                <p className="text-sm mb-3">
                    Consistency is key to recovery. When you create a task, you can set it to repeat <strong>Daily</strong> or <strong>Weekly</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li>
                        <strong>Auto-Renewal:</strong> When you check off a recurring task, it moves to your history, and a <em>fresh copy</em> is automatically created for the next cycle.
                    </li>
                    <li>
                        <strong>Building Streaks:</strong> If you complete a Daily task consecutively, you will see a <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600"><FireIcon className="w-3 h-3 mr-1"/> 5 Days</span> badge. Missing a day resets the streak!
                    </li>
                </ul>
            </section>

            {/* Feature 3: Editing & Properties */}
            <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <PenIcon className="w-4 h-4" />
                    Editing & Due Dates
                </h4>
                <p className="text-sm mb-3">
                    You can edit tasks directly in the list without opening a menu:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="border-l-4 border-yellow-300 pl-3">
                        <strong>Edit Text:</strong>
                        <p className="text-gray-600">Click the task name (or the pencil icon) to rename it.</p>
                    </div>
                    <div className="border-l-4 border-teal-300 pl-3">
                        <strong>Edit Properties:</strong>
                        <p className="text-gray-600">Click the <strong>Due Date</strong> badge or the <strong>Recurrence</strong> badge (e.g., "Daily") to change them instantly.</p>
                    </div>
                </div>
                <div className="mt-3 p-2 bg-red-50 rounded border border-red-100 text-xs text-red-700">
                    <strong className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> Late Tasks:</strong>
                    If a task passes its due date, it will turn <span className="font-bold">RED</span> and be marked "Late".
                </div>
            </section>

            {/* Feature 4: History & Reactivation */}
            <section>
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-gray-500" />
                    History & Reactivation
                </h4>
                <p className="text-sm mb-3">
                    Click the <strong>"View Completion History"</strong> button at the top to see everything you've accomplished, grouped by date.
                </p>
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <ArrowLeftIcon className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                        <strong className="text-sm">Made a mistake?</strong>
                        <p className="text-xs text-gray-600">
                            In the History view, click the <strong>Arrow Icon</strong> next to any completed item to mark it as incomplete and send it back to your active list.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GuideToDo;