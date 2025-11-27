import React, { useState, useRef } from 'react';
import { literatureManifest, getLiteratureBook } from '../utils/data.js';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon, PenIcon, HighlighterIcon } from '../utils/icons.jsx';
import { Spinner } from './common.jsx';

// --- SUB-COMPONENT: BOOK READER (The Text View) ---
const BookReader = ({ chapter, bookTitle, onBack, onJournal }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [highlightedText, setHighlightedText] = useState('');
    const contentRef = useRef(null);

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, chapter.pages.length - 1));
        setHighlightedText('');
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 0));
        setHighlightedText('');
    };

    const handleTextSelection = () => {
        if (window.getSelection) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (contentRef.current && contentRef.current.contains(range.commonAncestorContainer)) {
                    setHighlightedText(selection.toString().trim());
                } else {
                    setHighlightedText('');
                }
            }
        }
    };

    const handleJournalHighlight = () => {
        if (highlightedText) {
            onJournal(bookTitle, chapter.title, currentPage + 1, highlightedText);
            setHighlightedText('');
            if (window.getSelection) window.getSelection().removeAllRanges();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
            <button onClick={onBack} className="flex items-center text-serene-teal hover:text-serene-teal mb-4 font-semibold flex-shrink-0">
                <ArrowLeftIcon /><span className="ml-2">Back to Chapters</span>
            </button>
            <h2 className="text-2xl font-bold text-deep-charcoal mb-4 flex-shrink-0">{chapter.title}</h2>
            
            <div 
                ref={contentRef}
                className="prose-lg text-deep-charcoal/80 overflow-y-auto flex-grow pr-2 flex flex-col justify-between"
                onMouseUp={handleTextSelection}
                onTouchEnd={handleTextSelection}
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

// --- HELPER: COLLAPSIBLE CHAPTER SECTION ---
const ChapterSection = ({ title, chapters, onSelect }) => (
    <details className="group bg-pure-white/60 rounded-lg shadow-sm ring-1 ring-black/5 open:bg-white open:shadow-md transition-all duration-200 mb-3">
        <summary className="list-none flex justify-between items-center p-4 cursor-pointer select-none">
            <h3 className="font-bold text-deep-charcoal text-lg">{title}</h3>
            <span className="transform group-open:rotate-90 transition-transform duration-200 text-serene-teal">
                <ArrowRightIcon className="w-5 h-5" />
            </span>
        </summary>
        <ul className="px-2 pb-2 space-y-1 border-t border-gray-100">
            {chapters.map((chapter, index) => (
                <li key={index}>
                    <button 
                        onClick={() => onSelect(chapter)} 
                        className="w-full text-left p-3 hover:bg-serene-teal/10 rounded-md transition-colors flex items-center justify-between group/item"
                    >
                        <span className="text-deep-charcoal/80 font-medium">{chapter.title}</span>
                        <ArrowRightIcon className="w-4 h-4 text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                </li>
            ))}
        </ul>
    </details>
);

// --- MAIN COMPONENT ---
const RecoveryLiterature = ({ onNavigate, setJournalTemplate }) => {
    const [selectedBook, setSelectedBook] = useState(null); 
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectBook = async (bookKey) => {
        setIsLoading(true);
        try {
            const bookData = await getLiteratureBook(bookKey);
            setSelectedBook({ ...(bookData.default || bookData), key: bookKey });
        } catch (error) {
            console.error("Failed to load literature:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
    
    // --- RENDER: CHAPTER READER VIEW ---
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

    // --- RENDER: BOOK TABLE OF CONTENTS VIEW ---
    if (selectedBook) { 
        // 1. AA Big Book (4th Edition) Layout
        if (selectedBook.key === 'aa_big_book_v4') {
            const prefaces = selectedBook.chapters.slice(0, 5);
            const coreChapters = selectedBook.chapters.slice(5, 17);
            const personalStories = selectedBook.chapters.slice(17);

            return (
                <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                    <button onClick={() => setSelectedBook(null)} className="flex items-center text-serene-teal hover:text-serene-teal mb-4 font-semibold"><ArrowLeftIcon /><span className="ml-2">Back to Library</span></button>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-deep-charcoal">{selectedBook.title}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <ChapterSection title="Prefaces & Forewords" chapters={prefaces} onSelect={setSelectedChapter} />
                        <ChapterSection title="The Chapters" chapters={coreChapters} onSelect={setSelectedChapter} />
                        <ChapterSection title="Personal Stories" chapters={personalStories} onSelect={setSelectedChapter} />
                    </div>
                </div>
            );
        }

        // 2. Recovery Dharma Guidebook Layout
        if (selectedBook.key === 'recovery_dharma_guidebook') {
            // Slices based on parser manifest order:
            // 0-24: Basics (Preface -> Recovery is Possible)
            // 25-38: Personal Stories (Amy -> Eunsung)
            // 39+: Appendix (Meditations -> Dedication)
            const basics = selectedBook.chapters.slice(0, 25);
            const stories = selectedBook.chapters.slice(25, 39);
            const appendix = selectedBook.chapters.slice(39);

            return (
                <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                    <button onClick={() => setSelectedBook(null)} className="flex items-center text-serene-teal hover:text-serene-teal mb-4 font-semibold"><ArrowLeftIcon /><span className="ml-2">Back to Library</span></button>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-deep-charcoal">{selectedBook.title}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <ChapterSection title="Practice & Principles" chapters={basics} onSelect={setSelectedChapter} />
                        <ChapterSection title="Personal Stories" chapters={stories} onSelect={setSelectedChapter} />
                        <ChapterSection title="Appendix & Meditations" chapters={appendix} onSelect={setSelectedChapter} />
                    </div>
                </div>
            );
        }

        // 3. Default Layout (Flat List)
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
    
    // --- RENDER: MAIN LIBRARY LIST ---
    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-deep-charcoal mb-2">Recovery Literature</h2>
            <p className="text-deep-charcoal/70 mb-6">Read or download foundational recovery texts.</p>
            {isLoading ? <Spinner /> : (
                <ul className="space-y-4">
                    {Object.values(literatureManifest).map(book => ( 
                        <li key={book.key}> 
                            <div className="p-4 bg-pure-white/60 rounded-lg shadow-sm"> 
                                <div className="flex justify-between items-start"> 
                                    <div><h3 className="font-semibold text-deep-charcoal text-lg">{book.title}</h3></div> 
                                    <a href={book.pdfLink} target="_blank" rel="noopener noreferrer" className={`flex-shrink-0 ml-4 flex items-center gap-2 bg-healing-green text-white font-semibold py-2 px-3 rounded-lg hover:brightness-95 text-sm ${book.pdfLink === "#" ? "opacity-50 cursor-not-allowed" : ""}`} aria-disabled={book.pdfLink === "#"} onClick={(e) => book.pdfLink === "#" && e.preventDefault()}>
                                        <DownloadIcon />PDF
                                    </a>
                                </div> 
                                <button onClick={() => handleSelectBook(book.key)} className="mt-4 w-full bg-serene-teal/10 text-serene-teal font-semibold py-2 px-4 rounded-lg hover:bg-serene-teal/20">Read in App</button>
                            </div> 
                        </li> 
                    ))}
                </ul>
            )}
        </div> 
    );
};

export default RecoveryLiterature;