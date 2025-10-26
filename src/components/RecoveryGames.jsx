import React, { useState } from 'react';
import { ArrowLeftIcon } from '../utils/icons.jsx';

// --- Main Component ---
const RecoveryGames = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'gratitude', name: 'Gratitude Jar', component: <GratitudeJar /> },
    { id: 'spinner', name: 'Serenity Spinner', component: <SerenitySpinner /> },
    { id: 'affirmation', name: 'Daily Affirmation', component: <DailyAffirmation /> },
  ];

  const selectedGame = games.find(game => game.id === activeGame);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in h-full flex flex-col">
        <button onClick={onBack} className="flex items-center text-teal-600 hover:text-teal-800 mb-6 font-semibold flex-shrink-0">
            <ArrowLeftIcon className="w-5 h-5" /><span className="ml-2">Back to Coping Tools</span>
        </button>
        <div className="bg-gray-100 p-5 rounded-lg shadow-inner flex-grow">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">Recovery Games Zone</h2>
          {!activeGame ? (
            <div className="flex justify-center gap-3 flex-wrap mb-5">
              {games.map(game => (
                <button
                  key={game.id}
                  className="py-2 px-4 text-base font-semibold cursor-pointer border-none rounded-md bg-teal-600 text-white shadow-md hover:bg-teal-700"
                  onClick={() => setActiveGame(game.id)}
                >
                  {game.name}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="text-center text-xl font-bold text-gray-700 mb-4">{selectedGame.name}</h3>
              <div className="p-5 border border-gray-200 rounded-lg bg-white">
                {selectedGame.component}
              </div>
              <button
                className="block mx-auto mt-5 py-2 px-4 text-sm font-semibold cursor-pointer border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => setActiveGame(null)}
              >
                Back to Games
              </button>
            </div>
          )}
        </div>
    </div>
  );
};

// --- Gratitude Jar Game ---
const GratitudeJar = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setItems([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="What are you grateful for?"
        className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
      />
      <button
        onClick={handleAddItem}
        className="w-full p-2 bg-green-600 text-white font-semibold border-none rounded-lg cursor-pointer hover:bg-green-700"
      >
        Add to Jar
      </button>
      <ul className="list-none p-0 mt-5 max-h-40 overflow-y-auto">
        {items.map((item, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded-md mb-1.5">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Serenity Spinner Game ---
const SerenitySpinner = () => {
  const activities = [
    'Take 5 deep breaths',
    'Stretch for 2 minutes',
    'Call a friend',
    'Listen to a favorite song',
    'Step outside for fresh air',
    'Write down your thoughts',
    'Drink a glass of water',
  ];
  const [result, setResult] = useState('');

  const spin = () => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    setResult(activities[randomIndex]);
  };

  return (
    <div>
      <p className="text-center text-gray-600">Click to find a calming activity.</p>
      <button
        onClick={spin}
        className="w-full p-3 my-3 text-lg font-semibold bg-yellow-400 text-gray-800 border-none rounded-lg cursor-pointer hover:bg-yellow-500"
      >
        Spin the Wheel
      </button>
      {result && <p className="mt-5 text-center text-lg font-bold text-teal-600">{result}</p>}
    </div>
  );
};

// --- Daily Affirmation Game ---
const DailyAffirmation = () => {
  const affirmations = [
    "I am strong, capable, and resilient.",
    "I choose to be happy and to love myself today.",
    "My past does not define my future.",
    "I am in control of my choices.",
    "I am worthy of a peaceful and sober life.",
    "Each day is a new opportunity for growth.",
    "I am grateful for my journey and my progress.",
  ];
  const [affirmation, setAffirmation] = useState('Click below for your affirmation!');

  const getNewAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setAffirmation(affirmations[randomIndex]);
  };

  return (
    <div>
      <p className="text-center text-lg italic text-gray-700 min-h-[60px] flex items-center justify-center">"{affirmation}"</p>
      <button
        onClick={getNewAffirmation}
        className="w-full p-2 mt-4 bg-blue-500 text-white font-semibold border-none rounded-lg cursor-pointer hover:bg-blue-600"
      >
        New Affirmation
      </button>
    </div>
  );
};

export default RecoveryGames;