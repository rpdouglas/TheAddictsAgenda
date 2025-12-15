// src/components/SevenGrandfatherTeachings.jsx
import React, { useState } from 'react';
import { XIcon, BookOpenIcon, InfoIcon, ArrowLeftIcon } from '../utils/icons.jsx';

// --- 1. The Data Structure (Expanded) ---
const TEACHINGS_DATA = [
  {
    id: 'wisdom',
    english: 'Wisdom',
    ojibwe: 'Nbwaakaawin',
    animal: 'Beaver',
    color: 'bg-amber-100',
    description: 'To cherish knowledge is to know Wisdom. The Beaver uses its natural gift to alter the environment for the good of its family.',
    deepDive: 'The Beaver has large teeth that never stop growing. If he does not use them to cut trees and build dams for his family, they will grow into his brain and kill him. **Lesson:** We must use the gifts and knowledge we are given for the good of our community, or our own knowledge will harm us.'
  },
  {
    id: 'love',
    english: 'Love',
    ojibwe: 'Zaagi\'idiwin',
    animal: 'Eagle',
    color: 'bg-red-100',
    description: 'To know Love is to know peace. The Eagle flies highest and carries our prayers to the Creator.',
    deepDive: 'The Eagle flies closest to the Creator and sees the furthest. Because he flies so high, he carries the prayers of the people to the Spirit World. **Lesson:** Love gives us the perspective to see the whole picture and the strength to carry the burdens of others.'
  },
  {
    id: 'respect',
    english: 'Respect',
    ojibwe: 'Minaadendmowin',
    animal: 'Buffalo',
    color: 'bg-stone-200',
    description: 'To honor all creation is to have Respect. The Buffalo gives its whole self for the people.',
    deepDive: 'The Buffalo provided everything the people needed to survive: food, shelter, clothing, and tools. He gave his entire life so others could live. **Lesson:** True respect is not just politeness; it is the willingness to give of yourself to sustain others.'
  },
  {
    id: 'bravery',
    english: 'Bravery',
    ojibwe: 'Aakdehewin',
    animal: 'Bear',
    color: 'bg-orange-100',
    description: 'Bravery is to face the foe with integrity. The Bear teaches us to face our fears.',
    deepDive: 'The mother Bear has the ferocity to protect her cubs against any danger, yet the gentleness to hibernate and dream. **Lesson:** Bravery is not just fighting; it is having the courage to do the right thing, even when you are afraid, and to protect those who cannot protect themselves.'
  },
  {
    id: 'honesty',
    english: 'Honesty',
    ojibwe: 'Gwekwaadziwin',
    animal: 'Sabe (Giant)',
    color: 'bg-blue-100',
    description: 'Honesty in facing a situation is to be brave. The Sabe represents standing tall and being true to who you are.',
    deepDive: 'The Sabe (Sasquatch/Giant) walks tall and does not hide. He represents the honest self that has nothing to conceal. **Lesson:** Honesty is the bravery to be exactly who you are, without masks or deception, standing tall in your own truth.'
  },
  {
    id: 'humility',
    english: 'Humility',
    ojibwe: 'Dbaadendiziwin',
    animal: 'Wolf',
    color: 'bg-purple-100',
    description: 'Humility is to know yourself as a sacred part of Creation. The Wolf lives for the pack, not the self.',
    deepDive: 'The Wolf bows his head in deference to others and never takes the first bite of the kill; he ensures the pack eats first. **Lesson:** Humility is thinking of yourself less, not thinking less of yourself. It is recognizing that the strength of the wolf is the pack.'
  },
  {
    id: 'truth',
    english: 'Truth',
    ojibwe: 'Debwewin',
    animal: 'Turtle',
    color: 'bg-green-100',
    description: 'Truth is to know all of these things. The Turtle carries the teachings on its back.',
    deepDive: 'The Turtle carries the markings of the 13 moons on his shell and the 28 days of the cycle. He carries the history of creation on his back. **Lesson:** Truth is constant and slow-moving. It is the understanding that all the other teachings (Wisdom, Love, Respect, Bravery, Honesty, Humility) must be integrated to live a true life.'
  }
];

// --- 2. Modal Sub-Component ---
const TeachingModal = ({ teaching, onClose }) => {
  if (!teaching) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header Color Band */}
        <div className={`h-32 ${teaching.color} flex flex-col items-center justify-center relative p-4`}>
          <h2 className="text-3xl font-bold text-gray-800 opacity-90">{teaching.english}</h2>
          <span className="text-gray-600/80 font-medium italic">{teaching.ojibwe}</span>
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
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-full mb-2">
              The {teaching.animal}
            </span>
            <img 
                src={`/images/teachings/${teaching.id}.png`}
                alt={teaching.animal}
                className="w-24 h-24 object-contain mx-auto my-2 opacity-90"
                onError={(e) => {e.target.style.display = 'none'}} // Hide if missing
            />
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
               <p className="font-medium text-center italic">"{teaching.description}"</p>
            </div>
            
            <div className="flex items-start gap-4 mt-6">
              <BookOpenIcon className="w-6 h-6 text-indigo-500 shrink-0 mt-1" />
              <div className="text-sm space-y-2">
                  {teaching.deepDive.split('**Lesson:**').map((part, i) => (
                      <p key={i}>
                          {i === 1 ? <strong className="text-indigo-800 block mt-2">Lesson:</strong> : null}
                          {part.trim()}
                      </p>
                  ))}
              </div>
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

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">The Seven Grandfather Teachings</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
          Timeless Anishinaabe principles for living a good life (Mno Bmaadziwin). 
          Tap a card to explore the deeper meaning.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6 overflow-y-auto">
        {TEACHINGS_DATA.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTeaching(item)}
            className={`
              relative group overflow-hidden rounded-2xl p-6 text-left transition-all duration-300
              hover:shadow-xl hover:-translate-y-1 border border-gray-100
              flex flex-col items-center
              ${item.color}
            `}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-50 transition-opacity">
              <InfoIcon className="w-6 h-6 text-gray-700" />
            </div>
            
            {/* Image Slot */}
            <div className="mb-4 h-24 w-full flex items-center justify-center">
                <img 
                    src={`/images/teachings/${item.id}.png`}
                    alt={item.animal}
                    className="h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.style.display = 'none'; 
                        // Fallback text if image fails
                        e.target.parentNode.innerHTML = `<span class="text-3xl opacity-20 font-bold">${item.english[0]}</span>`;
                    }}
                />
            </div>

            <div className="text-center w-full">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {item.english}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600/70 mb-2">
                    {item.animal}
                </p>
                <p className="text-sm font-medium text-gray-600 italic mb-4">
                {item.ojibwe}
                </p>
            </div>
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