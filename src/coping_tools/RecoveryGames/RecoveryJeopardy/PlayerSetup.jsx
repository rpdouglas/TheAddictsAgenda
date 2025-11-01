import React, { useState } from 'react';

const PlayerSetup = ({ onStartGame }) => {
    const [playerCount, setPlayerCount] = useState(1);
    const [playerNames, setPlayerNames] = useState(['Team 1', 'Team 2', 'Team 3']);

    const handleNameChange = (index, newName) => {
        const updatedNames = [...playerNames];
        updatedNames[index] = newName;
        setPlayerNames(updatedNames);
    };

    const handleStart = () => {
        const players = playerNames.slice(0, playerCount).map(name => ({
            name: name || `Player ${playerNames.indexOf(name) + 1}`, // Default name if empty
            score: 0
        }));
        onStartGame(players);
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-lg text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Game Setup</h1>
            
            <div className="mb-6">
                <label className="text-xl font-semibold mb-2 block">Select Number of Players/Teams:</label>
                <div className="flex justify-center gap-4">
                    {[1, 2, 3].map(num => (
                        <button
                            key={num}
                            onClick={() => setPlayerCount(num)}
                            className={`py-3 px-6 text-xl font-bold rounded-lg ${playerCount === num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label className="text-xl font-semibold mb-2 block">Enter Team Names:</label>
                <div className="flex flex-col items-center gap-4">
                    {Array.from({ length: playerCount }).map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            value={playerNames[index]}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            className="p-2 border rounded-lg w-64 text-center text-lg"
                            placeholder={`Team ${index + 1} Name`}
                        />
                    ))}
                </div>
            </div>

            <button
                onClick={handleStart}
                className="bg-green-600 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-green-700 text-xl"
            >
                Start Game
            </button>
        </div>
    );
};

export default PlayerSetup;
