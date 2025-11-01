import React, { useState } from 'react';
import { jeopardyData } from './jeopardyData';

const FinalJeopardy = ({ players, onUpdateScore, onRestartGame }) => {
    const [wagers, setWagers] = useState(Array(players.length).fill(0));
    const [answers, setAnswers] = useState(Array(players.length).fill(''));
    const [stage, setStage] = useState('wager'); // wager -> answer -> reveal

    // Safely access final jeopardy data
    const finalJeopardyQuestion = jeopardyData?.finalJeopardy;

    const handleWagerChange = (index, value) => {
        const maxWager = Math.max(0, players[index].score);
        const newWagers = [...wagers];
        newWagers[index] = Math.min(maxWager, parseInt(value, 10) || 0);
        setWagers(newWagers);
    };

    const lockInWagers = () => {
        setStage('answer');
    };

    const revealAnswers = () => {
        if (!finalJeopardyQuestion) return; // Guard against missing data

        // Update scores based on answers and wagers
        players.forEach((player, index) => {
            const answerIsCorrect = answers[index].toLowerCase() === finalJeopardyQuestion.answer.toLowerCase();
            const amount = answerIsCorrect ? wagers[index] : -wagers[index];
            onUpdateScore(index, amount);
        });
        setStage('reveal');
    };
    
    // If data is missing, prevent the component from rendering and crashing
    if (!finalJeopardyQuestion) {
        return (
            <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-red-600">Error</h2>
                <p className="mt-2">Final Jeopardy question data could not be found.</p>
                <button
                    onClick={onRestartGame}
                    className="mt-6 bg-gray-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600"
                >
                    Restart Game
                </button>
            </div>
        );
    }


    const renderWagerStage = () => (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Final Jeopardy Category:</h2>
            <p className="text-4xl font-bold mb-8">{finalJeopardyQuestion.category}</p>
            <h3 className="text-2xl font-bold mb-4">Place Your Wagers:</h3>
            <div className="flex flex-col items-center gap-4">
                {players.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <label className="font-bold">{player.name}:</label>
                        <input
                            type="number"
                            min="0"
                            max={Math.max(0, player.score)}
                            value={wagers[index]}
                            onChange={(e) => handleWagerChange(index, e.target.value)}
                            className="p-2 border rounded w-32 text-center"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={lockInWagers}
                className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700"
            >
                Lock In Wagers
            </button>
        </div>
    );

    const renderAnswerStage = () => (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Final Jeopardy Question:</h2>
            <p className="text-4xl font-bold mb-8">{finalJeopardyQuestion.question}</p>
            <h3 className="text-2xl font-bold mb-4">Enter Your Answers:</h3>
            <div className="flex flex-col items-center gap-4">
                {players.map((player, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <label className="font-bold">{player.name}:</label>
                        <input
                            type="text"
                            value={answers[index]}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[index] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            className="p-2 border rounded w-64"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={revealAnswers}
                className="mt-8 bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700"
            >
                Reveal Final Scores
            </button>
        </div>
    );

    const renderRevealStage = () => {
        // Find the winner (handles ties by picking the first one)
        const winner = players.reduce((prev, current) => (prev.score > current.score) ? prev : current, { name: '', score: -Infinity });

        return (
            <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">Correct Answer:</h2>
                <p className="text-4xl font-bold mb-8">{finalJeopardyQuestion.answer}</p>
                <h3 className="text-2xl font-bold mb-4">Final Scores:</h3>
                <div className="flex flex-col items-center gap-2">
                    {players.map((player, index) => (
                        <p key={index} className="text-xl">
                            <span className="font-bold">{player.name}:</span> ${player.score}
                        </p>
                    ))}
                </div>
                <h2 className="text-4xl font-bold mt-8 text-green-600">
                    Congratulations, {winner.name}!
                </h2>
                <button
                    onClick={onRestartGame}
                    className="mt-8 bg-gray-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-600"
                >
                    Play Again
                </button>
            </div>
        );
    }


    return (
        <div className="p-8 bg-white rounded-lg shadow-lg">
            {stage === 'wager' && renderWagerStage()}
            {stage === 'answer' && renderAnswerStage()}
            {stage === 'reveal' && renderRevealStage()}
        </div>
    );
};

export default FinalJeopardy;