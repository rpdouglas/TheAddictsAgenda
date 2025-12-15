// src/components/guide/GuideLiterature.jsx
import React from 'react';
import { BookOpenIcon, DownloadIcon, SparklesIcon } from '../../utils/icons.jsx';

const GuideLiterature = () => {
    return (
        <div className="space-y-8 text-gray-700">
            {/* Intro */}
            <section>
                <h3 className="text-xl font-bold text-teal-700 mb-3 flex items-center gap-2">
                    <BookOpenIcon className="w-6 h-6" />
                    The Library
                </h3>
                <p className="mb-4">
                    Access foundational texts like the Big Book, 12 & 12, and Recovery Dharma directly in the app. 
                    The library supports an in-app E-Reader, PDF downloads, and interactive learning tools.
                </p>
            </section>

            {/* Feature 1: The Reader */}
            <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-2">📖 The E-Reader</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                    <li><strong>Navigation:</strong> Tap "Read in App" to open a book. Use the <strong>Next/Previous</strong> buttons to turn pages.</li>
                    <li><strong>Table of Contents:</strong> The Big Book is organized into "Prefaces," "Chapters," and "Personal Stories" for easy browsing.</li>
                    <li><strong>Journaling:</strong> Found a powerful quote? Tap <strong>"Journal about this page"</strong> to instantly create a new journal entry referenced to that specific chapter.</li>
                    <li><strong>Highlighting:</strong> Select any text with your cursor (or finger) and tap <strong>"Journal Highlight"</strong> to quote it directly in your entry.</li>
                </ul>
            </section>

            {/* NEW SECTION: Interactive Tools */}
            <section className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" />
                    Interactive Learning
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                    Some items in the library are more than just books. They are interactive experiences designed to deepen your understanding.
                </p>
                <div className="bg-white p-3 rounded-lg border border-indigo-200">
                    <strong className="text-indigo-700 text-sm">Example: Seven Grandfather Teachings</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-600">
                        <li>Look for the <strong>"Launch Interactive Tool"</strong> button on the card.</li>
                        <li>This opens a visual grid of the seven teachings (e.g., Wisdom, Love, Respect).</li>
                        <li>Tap any card to reveal the Anishinaabe language translation, the associated animal, and a deep-dive description of the principle.</li>
                    </ul>
                </div>
            </section>

            {/* Feature 3: PDFs */}
            <section className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h4 className="font-bold text-teal-800 mb-2 flex items-center gap-2">
                    <DownloadIcon className="w-4 h-4" />
                    PDF Downloads
                </h4>
                <p className="text-sm text-gray-700">
                    Prefer the original formatting? Tap the <strong>PDF button</strong> next to any title to open the official document in a new tab. 
                    You can then save it to your device for offline reading outside the app.
                </p>
            </section>
        </div>
    );
};

export default GuideLiterature;