import React, { useState } from 'react';

const QuestionModal = ({ category, question, round, onAnswer, onClose }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);

    const dollarValue = round === 'double' ? question.value * 2 : question.value;

    const checkAnswer = () => {
        setIsRevealed(true);
    };

    const handleScoreUpdate = (isCorrect) => {
        onAnswer(isCorrect); // Send the result (true/false) to the parent
    };

    const isCorrectAnswer = userAnswer.trim().toLowerCase() === question.answer.toLowerCase();

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center flex flex-col min-h-[300px]">
                
                <h2 className="text-2xl font-bold text-blue-800 uppercase mb-2">{category.name}</h2>
                <p className="text-4xl font-bold text-green-600 mb-6">${dollarValue}</p>
                <p className="text-3xl font-semibold text-gray-800 flex-grow mb-8">{question.question}</p>

                {!isRevealed ? (
                    <>
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="What is...?"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-center text-xl"
                        />
                        <button
                            onClick={checkAnswer}
                            className="mt-6 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 w-full"
                        >
                            Reveal Answer
                        </button>
                    </>
                ) : (
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Correct Answer:</h3>
                        <p className="text-3xl font-bold text-green-700 mb-6">{question.answer}</p>
                        <p className="text-xl mb-6">
                            Your answer: <span className={isCorrectAnswer ? 'text-green-600' : 'text-red-600'}>{userAnswer.trim() || '(No answer)'}</span>
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleScoreUpdate(true)}
                                className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700"
                            >
                                I Was Correct
                            </button>
                            <button
                                onClick={() => handleScoreUpdate(false)}
                                className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-red-700"
                            >
                                I Was Incorrect
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default QuestionModal;
