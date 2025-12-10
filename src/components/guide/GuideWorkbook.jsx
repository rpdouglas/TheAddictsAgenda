// src/components/guide/GuideWorkbook.jsx
import React from 'react';
import { BookOpenIcon, SparklesIcon, TargetIcon } from '../../utils/icons.jsx';

const GuideWorkbook = () => {
    return (
        <div className="space-y-8 text-gray-700">
            {/* Intro */}
            <section>
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                    <BookOpenIcon className="w-6 h-6" />
                    Recovery Workbook
                </h3>
                <p className="mb-4">
                    The Workbook is your space for deep work. It includes step work, recovery dharma inquiries, and interactive SMART Recovery tools.
                </p>
            </section>

            {/* Navigation & Progress */}
            <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">Navigation & Progress</h4>
                <p className="text-sm mb-3">
                    Use the <strong>Menu</strong> to browse categories. A progress bar shows your completion percentage for each section.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    <li><strong>Next/Previous:</strong> Use the buttons at the bottom of each topic to move sequentially.</li>
                    <li><strong>Auto-Save:</strong> Your answers are saved automatically as you type.</li>
                </ul>
            </section>

            {/* AI Insights & Action Plans */}
            <section className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    AI Insights & Action Plans
                </h4>
                <p className="text-sm mb-3">
                    Once you have completed enough entries, you can use the <strong>"Generate Insights"</strong> button. The AI will analyze your writing for themes and patterns.
                </p>
                
                <div className="bg-white p-3 rounded border border-indigo-100">
                    <strong className="text-indigo-700 text-sm flex items-center gap-1 mb-1">
                        <TargetIcon className="w-4 h-4" />
                        From Insight to Action
                    </strong>
                    <p className="text-xs text-gray-600">
                        The AI will suggest a concrete <strong>Action Plan</strong>. When you save these items:
                    </p>
                    <ul className="list-decimal pl-5 mt-2 space-y-1 text-xs text-gray-600">
                        <li>They are instantly added to your <strong>To-Do List</strong>.</li>
                        <li>They are tagged as <span className="text-red-500 font-bold">Action Items</span>.</li>
                        <li>They are automatically given a <strong>7-Day Due Date</strong> to help you stay accountable.</li>
                    </ul>
                </div>
            </section>

            {/* Interactive Tools */}
            <section>
                <h4 className="font-bold text-gray-800 mb-2">Interactive Tools</h4>
                <p className="text-sm mb-2">
                    Some sections (like SMART Recovery) load special interactive tools instead of standard text prompts:
                </p>
                <ul className="space-y-2 text-sm">
                    <li className="border-l-4 border-blue-400 pl-2">
                        <strong>CBA (Cost-Benefit Analysis):</strong> Weigh the pros and cons of using vs. recovery.
                    </li>
                    <li className="border-l-4 border-green-400 pl-2">
                        <strong>ABC (Activating Event):</strong> Analyze triggers and beliefs to change consequences.
                    </li>
                    <li className="border-l-4 border-purple-400 pl-2">
                        <strong>Lifestyle Balance:</strong> Visual pie chart to assess your life balance.
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default GuideWorkbook;