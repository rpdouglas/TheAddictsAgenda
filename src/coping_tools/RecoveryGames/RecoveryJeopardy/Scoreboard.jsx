import React from 'react';

const Scoreboard = ({ players, currentPlayerIndex }) => {
    return (
        <div className="flex justify-around mb-6 p-4 bg-white rounded-lg shadow-md">
            {players.map((player, index) => (
                <div 
                    key={index} 
                    className={`text-center p-3 rounded-lg transition-all ${index === currentPlayerIndex ? 'bg-blue-100 shadow-inner' : ''}`}
                >
                    <h2 className={`text-xl font-bold ${index === currentPlayerIndex ? 'text-blue-700' : 'text-gray-700'}`}>
                        {player.name}
                    </h2>
                    <p className={`text-3xl font-bold ${player.score < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${player.score}
                    </p>
                    {index === currentPlayerIndex && (
                        <span className="text-xs font-semibold text-blue-600">CURRENT TURN</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Scoreboard;
