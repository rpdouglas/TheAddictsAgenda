import React from 'react';

const GuideToDo = () => (
    <>
        <p className="mb-4 text-gray-600">A simple, effective tool to manage your daily tasks, step work, or life admin.</p>
        
        <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-yellow-700 mb-2">📝 Managing Tasks</h4>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Add:</strong> Type a task and tap the <strong>Plus (+)</strong> button.</li>
                    <li><strong>Complete:</strong> Tap the circle to mark as done. 
                        <br/><span className="text-xs text-gray-500">Pro Tip: Completing a task automatically creates a "Daily Log" entry in your journal!</span>
                    </li>
                    <li><strong>AI Integration:</strong> Items saved from your Journal Analysis or Workbook Insights will appear here automatically.</li>
                </ul>
            </div>
        </div>
    </>
);

export default GuideToDo;