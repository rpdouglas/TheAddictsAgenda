import React, { useState } from 'react';
import { copingStrategies } from '../utils/data.js';
import { ArrowLeftIcon, ShieldIcon, MapPinIcon, PhoneIcon, LifeBuoyIcon, ZapIcon, XIcon } from '../utils/icons.jsx';

// Map all icon names from data.js to the imported JSX components
const iconMap = {
    MapPinIcon: MapPinIcon,
    PhoneIcon: PhoneIcon,
    ShieldIcon: ShieldIcon,
    LifeBuoyIcon: LifeBuoyIcon, // Correctly import and map this icon
    ZapIcon: ZapIcon,
};

// Enhance cards with the mapped icon component. This is now safe.
const allCopingCards = copingStrategies.map(card => ({
    ...card,
    icon: iconMap[card.icon] || ShieldIcon // Fallback to a default icon if needed
}));

const CopingCards = ({ onJournal, onBack }) => {
    // Initialize with a random index
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * allCopingCards.length));
    
    // This line is now safe because allCopingCards is guaranteed to be a valid array
    const card = allCopingCards[currentIndex];

    // Function to select a new random card
    const showRandomCard = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * allCopingCards.length);
        } while (newIndex === currentIndex && allCopingCards.length > 1);
        
        setCurrentIndex(newIndex);
    };

    const CardIconComponent = card.icon;

    return ( 
        <div className="flex flex-col items-center justify-center h-full p-4 animate-fade-in relative">
            <button onClick={onBack} className="absolute top-6 left-6 flex items-center text-serene-teal hover:text-serene-teal font-semibold z-10">
                <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Coping Tools</span>
            </button>
            
            <div 
                className={`p-8 rounded-xl shadow-xl w-full max-w-md text-center flex-grow flex flex-col justify-between 
                           bg-gradient-to-br ${card.color} text-deep-charcoal border border-gray-100`}
            >
                <div className="flex justify-center items-start mb-4 w-full">
                    <div className="flex flex-col items-center">
                        <CardIconComponent className="w-8 h-8 text-serene-teal mb-2" />
                        <p className="text-xs font-semibold uppercase tracking-wider text-serene-teal">{card.category}</p>
                    </div>
                </div>
                
                <div className="flex flex-col justify-center flex-grow">
                    <h2 className="text-3xl font-bold text-teal-900 mb-4">{card.title}</h2>
                    <p className="text-deep-charcoal text-lg">{card.description}</p>
                </div>

                <p className="text-xs text-deep-charcoal/70 mt-4">Card {currentIndex + 1} of {allCopingCards.length}</p>

            </div> 
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md"> 
                <button onClick={showRandomCard} className="w-full bg-serene-teal text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-95 transition-colors flex items-center justify-center">
                    <ZapIcon className="mr-2 h-5 w-5" /> Get New Card
                </button>
                <button onClick={() => onJournal(card)} className="w-full bg-white text-serene-teal border-2 border-teal-600 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-serene-teal/10 transition-colors">Journal on This</button>
            </div> 
        </div> 
    );
};

export default CopingCards;