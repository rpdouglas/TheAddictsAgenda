import React from 'react';

const JeopardyBoard = ({ categories, round, onSelectQuestion, answeredQuestions }) => {
    // Dollar values adjust based on the round
    const dollarValues = round === 'jeopardy' ? [200, 400, 600, 800, 1000] : [400, 800, 1200, 1600, 2000];

    return (
        <div className="grid grid-cols-6 gap-2 text-center">
            {/* Category Headers (FIX: text-xs and leading-tight for mobile) */}
            {categories.slice(0, 6).map((cat) => (
                <div 
                    key={cat.name} 
                    // Changed classes here: text-sm -> text-xs, added sm:text-sm, added leading-tight
                    className="bg-blue-800 text-white p-2 font-extrabold h-24 flex items-center justify-center text-xs sm:text-sm uppercase leading-tight" 
                >
                    {cat.name}
                </div>
            ))}

            {/* Questions Grid */}
            {dollarValues.map((value, rowIndex) => (
                <React.Fragment key={value}>
                    {categories.slice(0, 6).map((cat) => {
                        // Check if a question exists at this level
                        const question = cat.questions && cat.questions[rowIndex];
                        
                        // If no question, render an empty, unclickable cell
                        if (!question) {
                            // Using bg-gray-900 to ensure the gap is filled but unclickable cell is distinct
                            return <div key={`${cat.name}-${value}`} className="bg-gray-900 p-4 h-24"></div>;
                        }

                        // We check the question's text itself to see if it has been answered globally
                        const isAnswered = answeredQuestions.includes(question.question);
                        
                        return (
                            <div
                                key={`${cat.name}-${value}`}
                                onClick={() => !isAnswered && onSelectQuestion(cat, question)}
                                className={`p-4 h-24 flex items-center justify-center cursor-pointer ${
                                    isAnswered ? 'bg-gray-800 text-gray-800' : 'bg-blue-600 hover:bg-blue-700'
                                } text-white text-xl font-bold transition-colors`}
                            >
                                {isAnswered ? '' : `$${value}`}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    );
};

export default JeopardyBoard;