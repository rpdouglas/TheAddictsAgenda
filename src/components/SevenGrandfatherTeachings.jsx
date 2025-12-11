// src/components/SevenGrandfatherTeachings.jsx
import React, { useState } from 'react';
import { XIcon, BookOpenIcon, InfoIcon, ArrowLeftIcon } from '../utils/icons.jsx';

// --- 1. The Data Structure ---
const TEACHINGS_DATA = [
  {
    id: 'wisdom',
    english: 'Wisdom',
    ojibwe: 'Nbwaakaawin',
    animal: 'Beaver',
    color: 'bg-amber-100',
    description: 'To cherish knowledge is to know Wisdom. The Beaver uses its natural gift (teeth) to alter the environment for the good of its family.',
    deepDive: 'Wisdom is given by the Creator to be used for the good of the people. In the Anishinaabe language, this word expresses the idea of putting down your thoughts to consider them before acting.'
  },
  {
    id: 'love',
    english: 'Love',
    ojibwe: 'Zaagi\'idiwin',
    animal: 'Eagle',
    color: 'bg-red-100',
    description: 'To know Love is to know peace. The Eagle flies highest and carries our prayers to the Creator.',
    deepDive: 'Love must be unconditional. When people are weak, they need love the most. The Eagle represents this because it has the strength to carry all the teachings.'
  },
  {
    id: 'respect',
    english: 'Respect',
    ojibwe: 'Minaadendmowin',
    animal: 'Buffalo',
    color: 'bg-stone-200',
    description: 'To honor all creation is to have Respect. The Buffalo gives its whole self for the people.',
    deepDive: 'Respect is placing others before yourself. It is not just about showing manners, but about understanding that you are part of a greater whole.'
  },
  {
    id: 'bravery',
    english: 'Bravery',
    ojibwe: 'Aakdehewin',
    animal: 'Bear',
    color: 'bg-orange-100',
    description: 'Bravery is to face the foe with integrity. The Bear teaches us to face our fears and step up for what is right.',
    deepDive: 'Bravery isn’t just about fighting; it’s about doing the right thing when it’s hard. It’s choosing the difficult path of honesty over the easy path of deception.'
  },
  {
    id: 'honesty',
    english: 'Honesty',
    ojibwe: 'Gwekwaadziwin',
    animal: 'Sabe (Giant)',
    color: 'bg-blue-100',
    description: 'Honesty in facing a situation is to be brave. The Sabe represents standing tall and being true to who you are.',
    deepDive: 'Honesty means knowing who you are in your heart and living by that truth. It is about transparency with yourself and others.'
  },
  {
    id: 'humility',
    english: 'Humility',
    ojibwe: 'Dbaadendiziwin',
    animal: 'Wolf',
    color: 'bg-purple-100',
    description: 'Humility is to know yourself as a sacred part of Creation. The Wolf lives for the pack, not the self.',
    deepDive: 'Humility is acknowledging that you are no better or worse than anyone else. It is recognizing your place in the circle of life.'
  },
  {
    id: 'truth',
    english: 'Truth',
    ojibwe: 'Debwewin',
    animal: 'Turtle',
    color: 'bg-green-100',
    description: 'Truth is to know all of these things. The Turtle carries the teachings on its back and moves slowly but surely.',
    deepDive: 'Truth is the synthesis of all other teachings. To live in truth is to walk the path of Wisdom, Love, Respect, Bravery, Honesty, and Humility.'
  }
];

// --- 2. Modal Sub-Component ---
const TeachingModal = ({ teaching, onClose }) => {
  if (!teaching) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header Color Band */}
        <div className={`h-24 ${teaching.color} flex items-center justify-center relative`}>
          <h2 className="text-3xl font-bold text-gray-800 opacity-90">{teaching.english}</h2>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-indigo-700 mb-1">{teaching.ojibwe}</h3>
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-full">
              The {teaching.animal}
            </span>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
               <p className="font-medium">{teaching.description}</p>
            </div>
            
            <div className="flex items-start gap-3 mt-4">
              <BookOpenIcon className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
              <p className="text-sm">{teaching.deepDive}</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main Component ---
const SevenGrandfatherTeachings = ({ onBack }) => {
  const [selectedTeaching, setSelectedTeaching] = useState(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
      {/* Header with Back Button */}
      <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-semibold flex-shrink-0 w-fit">
          <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Library</span>
      </button>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">The Seven Grandfather Teachings</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Timeless Anishinaabe principles for living a good life (Mno Bmaadziwin). 
          Tap a card to explore the deeper meaning.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
        {TEACHINGS_DATA.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTeaching(item)}
            className={`
              relative group overflow-hidden rounded-2xl p-6 text-left transition-all duration-300
              hover:shadow-xl hover:-translate-y-1 border border-gray-100
              ${item.color}
            `}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-50 transition-opacity">
              <InfoIcon className="w-6 h-6 text-gray-700" />
            </div>
            
            <div className="mb-4">
               <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                 {item.animal}
               </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {item.english}
            </h3>
            <p className="text-sm font-medium text-gray-600 italic mb-4">
              {item.ojibwe}
            </p>
            <p className="text-gray-700 text-sm line-clamp-3">
              {item.description}
            </p>
          </button>
        ))}
      </div>

      {/* Modal Overlay */}
      {selectedTeaching && (
        <TeachingModal 
          teaching={selectedTeaching} 
          onClose={() => setSelectedTeaching(null)} 
        />
      )}
    </div>
  );
};

export default SevenGrandfatherTeachings;