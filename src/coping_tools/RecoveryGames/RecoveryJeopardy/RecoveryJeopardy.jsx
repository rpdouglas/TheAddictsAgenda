import React, { useState } from 'react';
import { jeopardyData } from './jeopardyData.js';
import JeopardyBoard from './JeopardyBoard.jsx';
import Scoreboard from './Scoreboard.jsx';
import FinalJeopardy from './FinalJeopardy.jsx';
import QuestionModal from './QuestionModal.jsx';
import PlayerSetup from './PlayerSetup.jsx'; 

// Total questions per round: 6 categories * 5 questions = 30
const TOTAL_QUESTIONS_PER_ROUND = 30; 

/**
 * Shuffles an array in place (Fisher-Yates algorithm).
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
};

const RecoveryJeopardy = ({ onBack }) => {
    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentRound, setCurrentRound] = useState('setup'); // setup -> jeopardy -> double -> final
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null); // { category, question }

    // NEW STATE: Holds the distinct category objects for each round
    const [jeopardyCategories, setJeopardyCategories] = useState([]);
    const [doubleJeopardyCategories, setDoubleJeopardyCategories] = useState([]);

    const handleStartGame = (playerList) => {
        setPlayers(playerList);
        setCurrentPlayerIndex(0);
        setCurrentRound('jeopardy');

        // Logic to select 12 unique categories and split them:
        const allCategories = [...jeopardyData.categories];
        const shuffledCategories = shuffle(allCategories);
        
        // Use the first 6 for Round 1 (Jeopardy)
        setJeopardyCategories(shuffledCategories.slice(0, 6));
        
        // Use the next 6 for Round 2 (Double Jeopardy)
        // Note: The total categories in jeopardyData is 24, so selecting 12 unique ones is safe.
        setDoubleJeopardyCategories(shuffledCategories.slice(6, 12));
    };

    const handleSelectQuestion = (category, question) => {
        setCurrentQuestion({ category, question });
    };

    const handleAnswerOutcome = (wasCorrect) => {
        const { question } = currentQuestion;
        // The value calculation in double jeopardy remains correct based on question.value
        const amount = currentRound === 'double' ? question.value * 2 : question.value;
        const scoreChange = wasCorrect ? amount : -amount;

        // Update player score
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].score += scoreChange;
        setPlayers(updatedPlayers);

        // Mark question as answered
        setAnsweredQuestions([...answeredQuestions, question.question]);
        
        const newTotalAnswered = totalAnswered + 1;
        setTotalAnswered(newTotalAnswered);

        // Switch to next player ONLY if they get it wrong
        if (!wasCorrect) {
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }
        // If correct, the same player keeps control

        // Check for round change
        if (newTotalAnswered === TOTAL_QUESTIONS_PER_ROUND && currentRound === 'jeopardy') {
            setCurrentRound('double');
            setTotalAnswered(0); // Reset for next round
            setAnsweredQuestions([]); // Reset for next round
        } else if (newTotalAnswered === TOTAL_QUESTIONS_PER_ROUND && currentRound === 'double') {
            setCurrentRound('final');
        }
        
        // Close the modal
        setCurrentQuestion(null);
    };

    // Passed to FinalJeopardy
    const handleUpdateScore = (playerIndex, amount) => {
        const updatedPlayers = [...players];
        updatedPlayers[playerIndex].score += amount;
        setPlayers(updatedPlayers);
    };

    // Passed to FinalJeopardy
    const handleRestartGame = () => {
        setPlayers([]);
        setCurrentPlayerIndex(0);
        setCurrentRound('setup');
        setAnsweredQuestions([]);
        setTotalAnswered(0);
        setCurrentQuestion(null);
        // Reset category states
        setJeopardyCategories([]);
        setDoubleJeopardyCategories([]);
    };

    // Main render logic
    const renderGameContent = () => {
        const currentCategories = currentRound === 'jeopardy' 
            ? jeopardyCategories 
            : doubleJeopardyCategories;

        switch (currentRound) {
            case 'setup':
                return <PlayerSetup onStartGame={handleStartGame} />;
            case 'jeopardy':
            case 'double':
                return (
                    <>
                        <Scoreboard players={players} currentPlayerIndex={currentPlayerIndex} />
                        <JeopardyBoard
                            categories={currentCategories} // PASSES THE CORRECT, UNIQUE CATEGORIES
                            round={currentRound}
                            onSelectQuestion={handleSelectQuestion}
                            answeredQuestions={answeredQuestions}
                        />
                    </>
                );
            case 'final':
                return (
                    <FinalJeopardy
                        players={players}
                        onUpdateScore={handleUpdateScore}
                        onRestartGame={handleRestartGame}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg min-h-screen">
            <button onClick={onBack} className="mb-4 text-blue-600 font-semibold">
                &larr; Back to Coping Tools
            </button>
            {currentRound !== 'setup' && (
                 <h1 className="text-3xl font-bold text-center mb-4 text-blue-800">Recovery Jeopardy</h1>
            )}

            {renderGameContent()}

            {currentQuestion && (
                <QuestionModal
                    category={currentQuestion.category}
                    question={currentQuestion.question}
                    round={currentRound}
                    onAnswer={handleAnswerOutcome}
                    onClose={() => setCurrentQuestion(null)} // Allow closing modal
                />
            )}
        </div>
    );
};

export default RecoveryJeopardy;