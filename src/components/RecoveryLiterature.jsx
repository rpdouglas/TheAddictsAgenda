import React, { useState } from 'react';
import { literatureData } from '../utils/data.js';
import { ArrowLeftIcon, DownloadIcon } from '../utils/icons.jsx';

export const RecoveryLiterature = () => {
    const [selectedBook, setSelectedBook] = useState(null); 
    const [selectedChapter, setSelectedChapter] = useState(null);

    const formatContent = (content) => content.split('\n\n').map((paragraph, index) => <p key={index} className="mb-4 whitespace-pre-wrap">{paragraph.trim()}</p>);
    
    if (selectedChapter) { 
        return ( 
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col"> 
                <button onClick={() => setSelectedChapter(null)} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold flex-shrink-0"><ArrowLeftIcon /><span className="ml-2">Back to Chapters</span></button> 
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex-shrink-0">{selectedChapter.title}</h2> 
                <div className="prose-lg text-gray-700 overflow-y-auto flex-grow pr-2">{formatContent(selectedChapter.content)}</div> 
            </div> 
        ); 
    }
    if (selectedBook) { 
        return ( 
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in"> 
                <button onClick={() => setSelectedBook(null)} className="flex items-center text-teal-600 hover:text-teal-800 mb-4 font-semibold"><ArrowLeftIcon /><span className="ml-2">Back to Library</span></button> 
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800">{selectedBook.title}</h2><a href={selectedBook.pdfLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"><DownloadIcon />PDF</a></div> 
                <ul className="space-y-3">{selectedBook.chapters.map((chapter, index) => ( <li key={index}><button onClick={() => setSelectedChapter(chapter)} className="w-full text-left p-4 bg-gray-50 hover:bg-teal-50 rounded-lg shadow-sm"><h3 className="font-semibold text-gray-800">{chapter.title}</h3></button></li> ))}</ul> 
            </div> 
        ); 
    }
    return ( 
        <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Recovery Literature</h2>
            <p className="text-gray-600 mb-6">Read or download foundational recovery texts.</p>
            <ul className="space-y-4">
                {Object.keys(literatureData).map(key => { 
                    const book = literatureData[key]; 
                    return ( 
                        <li key={key}> 
                            <div className="p-4 bg-gray-50 rounded-lg shadow-sm"> 
                                <div className="flex justify-between items-start"> 
                                    <div><h3 className="font-semibold text-gray-800 text-lg">{book.title}</h3></div> 
                                    <a href={book.pdfLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 ml-4 flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 text-sm"><DownloadIcon />PDF</a>
                                </div> 
                                <button onClick={() => setSelectedBook(book)} className="mt-4 w-full bg-teal-50 text-teal-700 font-semibold py-2 px-4 rounded-lg hover:bg-teal-100">Read in App</button>
                            </div> 
                        </li> 
                    ); 
                })}
            </ul>
        </div> 
    );
};
