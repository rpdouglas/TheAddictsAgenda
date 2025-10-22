import React, { useState, useMemo } from 'react';
import { copingStrategies } from '../utils/data.js';
import { ArrowLeftIcon, ShieldIcon, MapPinIcon, PhoneIcon, XIcon, ZapIcon } from '../utils/icons.jsx';

// Map string icon names from data.js to the imported JSX components
const iconMap = {
    MapPinIcon: MapPinIcon,
    PhoneIcon: PhoneIcon,
    ShieldIcon: ShieldIcon,
    LifeBuoyIcon: XIcon, // Using XIcon as a fallback, but we should import LifeBuoyIcon if available
    // Assuming you have ZapIcon (or similar) for a dynamic icon
    ZapIcon: ZapIcon
};

// Enhance cards with mapped icon component (needed for rendering)
const allCopingCards = copingStrategies.map(card => ({
    ...card,
    icon: iconMap[card.icon] || ShieldIcon
}));

export const CopingCards = ({ onJournal }) => {
    // Initialize with a random index to start fresh
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * allCopingCards.length));
    
    const card = allCopingCards[currentIndex];
    
    const maxIndex = allCopingCards.length - 1;

    // Function to select a new random card, ensuring it's not the same as the current one
    const showRandomCard = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * allCopingCards.length);
        } while (newIndex === currentIndex && allCopingCards.length > 1); // Loop until different, unless only 1 card exists
        
        setCurrentIndex(newIndex);
    };

    const CardIconComponent = card.icon;

    return ( 
        <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in"> 
            <div 
                className={`p-8 rounded-xl shadow-xl w-full max-w-md text-center flex-grow flex flex-col justify-between 
                           bg-gradient-to-br ${card.color} text-gray-900 border border-gray-100`}
            >
                <div className="flex justify-center items-start mb-4 w-full">
                    {/* Centered Icon and Category display */}
                    <div className="flex flex-col items-center">
                        {/* Using ZapIcon for a dynamic feel on the random card */}
                        <CardIconComponent className="w-8 h-8 text-teal-800 mb-2" />
                        <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">{card.category}</p>
                    </div>
                </div>
                
                <div className="flex flex-col justify-center flex-grow">
                    <h2 className="text-3xl font-bold text-teal-900 mb-4">{card.title}</h2>
                    <p className="text-gray-800 text-lg">{card.description}</p>
                </div>

                <p className="text-xs text-gray-600 mt-4">Card {currentIndex + 1} of {allCopingCards.length}</p>

            </div> 
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md"> 
                {/* New button for randomization */}
                <button onClick={showRandomCard} className="w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors flex items-center justify-center">
                    <ZapIcon className="mr-2 h-5 w-5" /> Get New Card
                </button>
                <button onClick={() => onJournal(card)} className="w-full bg-white text-teal-600 border-2 border-teal-600 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-50 transition-colors">Journal on This</button>
            </div> 
        </div> 
    );
};
