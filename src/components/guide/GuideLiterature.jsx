import React from 'react';

const GuideLiterature = () => (
    <>
        <p className="mb-6">Read the foundational texts of Alcoholics Anonymous, Narcotics Anonymous, and Recovery Dharma directly in the app. The reader is designed for study and reflection.</p>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3">How to Use the Reader</h3>
        <div className="space-y-6">
            
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📚 Browsing Books & Chapters</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li>On the main Literature screen, tap <strong>"Read in App"</strong> below any book title (e.g., "The Big Book").</li>
                    <li>You will see a Table of Contents. For larger books like the Big Book, chapters are grouped into sections like <strong>"The Chapters"</strong> and <strong>"Personal Stories"</strong>.</li>
                    <li>Tap a section to expand it, then tap any chapter title to start reading.</li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">📖 Reading Mode</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Pagination:</strong> Long chapters are split into pages. Use the <strong>"Next"</strong> and <strong>"Previous"</strong> buttons at the bottom to navigate.</li>
                    <li><strong>Progress:</strong> The page indicator (e.g., "Page 3 of 12") helps you keep your place.</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">🖊️ Highlighting & Journaling</h4>
                <p className="text-sm text-gray-600 mb-2">Found a passage that speaks to you? You can save it instantly.</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                    <li><strong>Highlight Text:</strong> Long-press (on mobile) or click and drag (on desktop) to select any text on the page.</li>
                    <li><strong>Save to Journal:</strong> A customized button labeled <strong>"Journal Highlight"</strong> will appear. Tap it to automatically create a new journal entry containing your selected quote.</li>
                    <li><strong>Reflect on Page:</strong> Even without selecting text, you can tap <strong>"Journal about this page"</strong> to start a blank entry tagged with the current book and chapter title.</li>
                </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-teal-600 mb-2">⬇️ PDF Downloads</h4>
                <p className="text-sm text-gray-600">
                    Need a copy for offline sharing? Tap the green <strong>"PDF"</strong> button next to any book title on the main list to open the official PDF version in your browser.
                </p>
            </div>
        </div>
    </>
);

export default GuideLiterature;