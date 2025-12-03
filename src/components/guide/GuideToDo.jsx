import React from 'react';

const GuideToDo = () => (
    <>
        <p className="mb-4">A simple, effective tool to manage your daily tasks, step work, or life admin.</p>
        <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📝 Managing Tasks</h4>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Add:</strong> Type a task in the top box and tap the <strong>Plus (+)</strong> button.</li>
                    <li><strong>Complete:</strong> Tap the circle next to any task to mark it as done. It will move to the "Completed" list at the bottom.</li>
                    <li><strong>Delete:</strong> Tap the Trash icon to permanently remove a task.</li>
                </ul>
            </div>
            <p className="italic text-xs text-gray-500 mt-2">
                *Note: For detailed goal setting using the S.M.A.R.T. method, please see the "Effective Goal Setting" tool in the SMART Recovery section of the Workbook.
            </p>
        </div>
    </>
);

export default GuideToDo;