// src/components/workbook/WorkbookTopicDetail.jsx
import React from 'react';
import jsPDF from 'jspdf';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon } from '../../utils/icons.jsx';
import { WorkbookQuestion, CollapsibleWorkbookSection } from './WorkbookComponents.jsx';

const WorkbookTopicDetail = ({ topic, onBack, initialResponses, onUpdate, onNext, onPrevious, hasNext, hasPrevious }) => {
    
    const handleExportPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const maxTextWidth = pageWidth - (margin * 2);
        let yPos = 20;

        doc.setFontSize(18);
        doc.text(topic.title, margin, yPos);
        yPos += 15;

        if (topic.quote) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'italic');
            const splitQuote = doc.splitTextToSize(`"${topic.quote}"`, maxTextWidth);
            doc.text(splitQuote, margin, yPos);
            yPos += (splitQuote.length * 7) + 10;
            doc.setFont(undefined, 'normal');
        }

        const addContent = (question, key) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(11);
            doc.setTextColor(50); 
            const splitQ = doc.splitTextToSize(question, maxTextWidth);
            doc.text(splitQ, margin, yPos);
            yPos += (splitQ.length * 6) + 2;

            const answer = initialResponses[key] || "(No answer provided)";
            doc.setFontSize(10);
            doc.setTextColor(0); 
            const splitA = doc.splitTextToSize(answer, maxTextWidth - 5);
            doc.text(splitA, margin + 5, yPos); 
            yPos += (splitA.length * 6) + 10; 
        };

        if (topic.sections) {
            topic.sections.forEach(section => {
                const keyPrefix = `${topic.id}-${section.id}`;
                
                if (yPos > 270) { doc.addPage(); yPos = 20; }
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.text(section.title, margin, yPos);
                doc.setFont(undefined, 'normal');
                yPos += 10;

                section.questions.forEach((q, i) => {
                    const key = `${keyPrefix}-${i + 1}`;
                    addContent(q, key);
                });
            });
        } else {
            addContent(topic.prompt, topic.id);
        }

        doc.save(`${topic.title.replace(/\s+/g, '_')}_Workbook.pdf`);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg animate-fade-in h-full flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-100 p-6 z-10">
                <div className="flex justify-between items-start mb-4">
                    <button onClick={onBack} className="flex items-center text-pink-600 hover:text-pink-700 font-semibold group">
                        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1"/><span className="ml-2">Back to Menu</span>
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 bg-gray-50 text-deep-charcoal text-xs font-bold py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        title="Download this topic as a PDF"
                    >
                        <DownloadIcon className="w-4 h-4" /> Export PDF
                    </button>
                </div>
                
                <h3 className="text-2xl font-bold text-deep-charcoal">{topic.title}</h3>
                {topic.quote && (
                    <div className="mt-3 p-3 bg-pink-50 border-l-4 border-pink-400 rounded-r-lg">
                        <p className="text-sm italic text-deep-charcoal/80">"{topic.quote}"</p>
                    </div>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-grow p-6 bg-gray-50/50">
                {topic.sections ? (
                    topic.sections.map((section, secIndex) => (
                        <CollapsibleWorkbookSection 
                            key={secIndex} 
                            section={section} 
                            stepId={topic.id} 
                            initialResponses={initialResponses}
                            onUpdate={onUpdate}
                        />
                    ))
                ) : (
                    <div className="bg-white p-4 rounded-xl border border-light-stone/50 shadow-sm">
                        <WorkbookQuestion 
                            questionText={topic.prompt} 
                            questionKey={topic.id} 
                            initialResponses={initialResponses} 
                            onUpdate={onUpdate}
                        />
                    </div>
                )}

                {/* Footer Navigation */}
                <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                    <button 
                        onClick={onPrevious} 
                        disabled={!hasPrevious}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${!hasPrevious ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                    >
                        <ArrowLeftIcon className="w-4 h-4" /> Previous Step
                    </button>
                    <button 
                        onClick={onNext} 
                        disabled={!hasNext}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-md transition-all ${!hasNext ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg'}`}
                    >
                        Next Step <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkbookTopicDetail;