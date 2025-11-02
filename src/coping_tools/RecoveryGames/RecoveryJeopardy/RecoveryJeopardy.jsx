import React, { useState } from 'react';
import { jeopardyData } from './jeopardyData.js';
import JeopardyBoard from './JeopardyBoard.jsx';
import Scoreboard from './Scoreboard.jsx';
import FinalJeopardy from './FinalJeopardy.jsx';
import QuestionModal from './QuestionModal.jsx';
import PlayerSetup from './PlayerSetup.jsx'; // Import the new setup component

const TOTAL_QUESTIONS_PER_ROUND = 30; // 6 categories * 5 questions

const RecoveryJeopardy = ({ onBack }) => {
    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentRound, setCurrentRound] = useState('setup'); // setup -> jeopardy -> double -> final
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null); // { category, question }

    const handleStartGame = (playerList) => {
        setPlayers(playerList);
        setCurrentPlayerIndex(0);
        setCurrentRound('jeopardy');
    };

    const handleSelectQuestion = (category, question) => {
        setCurrentQuestion({ category, question });
    };

    const handleAnswerOutcome = (wasCorrect) => {
        const { question } = currentQuestion;
        const amount = currentRound === 'double' ? question.value * 2 : question.value;
        const scoreChange = wasCorrect ? amount : -amount;

        // Update player score
        const updatedPlayers = [...players];
        updatedPlayers[currentPlayerIndex].score += scoreChange;
        setPlayers(updatedPlayers);

        // Mark question as answered
        setAnsweredQuestions([...answeredQuestions, question.question]);
        setTotalAnswered(totalAnswered + 1);

        // Switch to next player ONLY if they get it wrong
        if (!wasCorrect) {
            setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        }
        // If correct, the same player keeps control

        // Check for round change
        if (totalAnswered + 1 === TOTAL_QUESTIONS_PER_ROUND && currentRound === 'jeopardy') {
            setCurrentRound('double');
            setTotalAnswered(0); // Reset for next round
            setAnsweredQuestions([]); // Reset for next round
        } else if (totalAnswered + 1 === TOTAL_QUESTIONS_PER_ROUND && currentRound === 'double') {
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
    };

    // Main render logic
    const renderGameContent = () => {
        switch (currentRound) {
            case 'setup':
                return <PlayerSetup onStartGame={handleStartGame} />;
            case 'jeopardy':
            case 'double':
                return (
                    <>
                        <Scoreboard players={players} currentPlayerIndex={currentPlayerIndex} />
                        <JeopardyBoard
                            categories={jeopardyData.categories}
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
