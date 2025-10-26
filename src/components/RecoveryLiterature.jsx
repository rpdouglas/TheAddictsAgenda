import React, { useState, useRef } from 'react';
import { literatureData } from '../utils/data.js';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon, PenIcon, HighlighterIcon } from '../utils/icons.jsx';

const BookReader = ({ chapter, bookTitle, onBack, onJournal }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [highlightedText, setHighlightedText] = useState('');
    const contentRef = useRef(null); // Ref to the content div

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, chapter.pages.length - 1));
        setHighlightedText(''); // Clear highlight on page change
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0));
        setHighlightedText(''); // Clear highlight on page change
    };

    const handleTextSelection = () => {
        if (window.getSelection) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                // Check if the selection is within the contentRef
                if (contentRef.current && contentRef.current.contains(range.commonAncestorContainer)) {
                    setHighlightedText(selection.toString().trim());
                } else {
                    setHighlightedText(''); // Clear if selection is outside content
                }
            }
        } else if (document.selection && document.selection.type !== "Control") {
            // For IE<9
            setHighlightedText(document.selection.createRange().text.trim());
        }
    };

    const handleJournalHighlight = () => {
        if (highlightedText) {
            onJournal(bookTitle, chapter.title, currentPage + 1, highlightedText);
            setHighlightedText(''); // Clear highlighted text after journaling
            if (window.getSelection) window.getSelection().removeAllRanges(); // Deselect text
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-4 font-semibold flex-shrink-0">
                <ArrowLeftIcon /><span className="ml-2">Back to Chapters</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4 flex-shrink-0">{chapter.title}</h2>
            
            <div 
                ref={contentRef} // Attach ref here
                className="prose-lg text-deep-charcoal/80 overflow-y-auto flex-grow pr-2 flex flex-col justify-between"
                onMouseUp={handleTextSelection} // Listen for text selection
                onTouchEnd={handleTextSelection} // For mobile selections
            >
                <div>
                    {chapter.pages[currentPage].split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 whitespace-pre-wrap">{paragraph.trim()}</p>
                    ))}
                </div>
                <div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <button 
                            onClick={() => onJournal(bookTitle, chapter.title, currentPage + 1)}
                            className="flex items-center justify-center gap-2 bg-serene-teal/10 text-serene-teal font-semibold py-2 px-4 rounded-lg hover:bg-serene-teal/20 transition-colors"
                        >
                            <PenIcon className="w-4 h-4"/> Journal about this page
                        </button>
                        {highlightedText && (
                            <button 
                                onClick={handleJournalHighlight}
                                className="flex items-center justify-center gap-2 bg-hopeful-coral/100 text-white font-semibold py-2 px-4 rounded-lg hover:bg-hopeful-coral transition-colors"
                            >
                                <HighlighterIcon className="w-4 h-4"/> Journal Highlight
                            </button>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t flex-shrink-0">
                        <button 
                            onClick={goToPreviousPage} 
                            disabled={currentPage === 0}
                            className="flex items-center gap-2 bg-light-stone/50 text-deep-charcoal/80 font-semibold py-2 px-4 rounded-lg hover:bg-light-stone/70 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeftIcon /> Previous
                        </button>
                        <span className="text-sm font-semibold text-deep-charcoal/70">
                            Page {currentPage + 1} of {chapter.pages.length}
                        </span>
                        <button 
                            onClick={goToNextPage} 
                            disabled={currentPage === chapter.pages.length - 1}
                            className="flex items-center gap-2 bg-light-stone/50 text-deep-charcoal/80 font-semibold py-2 px-4 rounded-lg hover:bg-light-stone/70 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <ArrowRightIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RecoveryLiterature = ({ onNavigate, setJournalTemplate }) => {
    const [selectedBook, setSelectedBook] = useState(null); 
    const [selectedChapter, setSelectedChapter] = useState(null);

    const handleJournal = (bookTitle, chapterTitle, pageNumber, highlightedText = '') => {
        let template = `Reflection on "${bookTitle}"\nChapter: ${chapterTitle}, Page ${pageNumber}\n\n`;
        if (highlightedText) {
            template += `Highlighted Passage:\n> ${highlightedText}\n\n`;
        }
        template += `My thoughts on this page/passage are:\n\n`;
        setJournalTemplate(template);
        onNavigate('journal');
    };

    const formatContent = (content) => content.split('\n\n').map((paragraph, index) => <p key={index} className="mb-4 whitespace-pre-wrap">{paragraph.trim()}</p>);
    
    if (selectedChapter) {
        if (selectedChapter.pages) {
            return <BookReader 
                chapter={selectedChapter} 
                bookTitle={selectedBook.title}
                onBack={() => setSelectedChapter(null)} 
                onJournal={handleJournal} 
            />;
        }
        return ( 
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col"> 
                <button onClick={() => setSelectedChapter(null)} className="flex items-center text-serene-teal hover:text-serene-teal mb-4 font-semibold flex-shrink-0"><ArrowLeftIcon /><span className="ml-2">Back to Chapters</span></button> 
                <h2 className="text-2xl font-bold text-deep-charcoal mb-4 flex-shrink-0">{selectedChapter.title}</h2> 
                <div className="prose-lg text-deep-charcoal/80 overflow-y-auto flex-grow pr-2">{formatContent(selectedChapter.content)}</div> 
            </div> 
        ); 
    }

    if (selectedBook) { 
        return ( 
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in"> 
                <button onClick={() => setSelectedBook(null)} className="flex items-center text-serene-teal hover:text-serene-teal mb-4 font-semibold"><ArrowLeftIcon /><span className="ml-2">Back to Library</span></button> 
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-deep-charcoal">{selectedBook.title}</h2>
                    <a href={selectedBook.pdfLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-healing-green text-white font-semibold py-2 px-4 rounded-lg hover:brightness-95 disabled:opacity-50" disabled={selectedBook.pdfLink === "#"}>
                        <DownloadIcon />PDF
                    </a>
                </div> 
                <ul className="space-y-3">{selectedBook.chapters.map((chapter, index) => ( <li key={index}><button onClick={() => setSelectedChapter(chapter)} className="w-full text-left p-4 bg-pure-white/60 hover:bg-serene-teal/10 rounded-lg shadow-sm"><h3 className="font-semibold text-deep-charcoal">{chapter.title}</h3></button></li> ))}</ul> 
            </div> 
        ); 
    }
    
    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">Recovery Literature</h2>
            <p className="text-deep-charcoal/70 mb-6">Read or download foundational recovery texts.</p>
            <ul className="space-y-4">
                {Object.keys(literatureData).map(key => { 
                    const book = literatureData[key]; 
                    return ( 
                        <li key={key}> 
                            <div className="p-4 bg-pure-white/60 rounded-lg shadow-sm"> 
                                <div className="flex justify-between items-start"> 
                                    <div><h3 className="font-semibold text-deep-charcoal text-lg">{book.title}</h3></div> 
                                    <a href={book.pdfLink} target="_blank" rel="noopener noreferrer" className={`flex-shrink-0 ml-4 flex items-center gap-2 bg-healing-green text-white font-semibold py-2 px-3 rounded-lg hover:brightness-95 text-sm ${book.pdfLink === "#" ? "opacity-50 cursor-not-allowed" : ""}`} aria-disabled={book.pdfLink === "#"} onClick={(e) => book.pdfLink === "#" && e.preventDefault()}>
                                        <DownloadIcon />PDF
                                    </a>
                                </div> 
                                <button onClick={() => setSelectedBook(book)} className="mt-4 w-full bg-serene-teal/10 text-serene-teal font-semibold py-2 px-4 rounded-lg hover:bg-serene-teal/20">Read in App</button>
                            </div> 
                        </li> 
                    ); 
                })}
            </ul>
        </div> 
    );
};