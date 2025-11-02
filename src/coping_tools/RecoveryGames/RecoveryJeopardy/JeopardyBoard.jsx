import React from 'react';

const JeopardyBoard = ({ categories, round, onSelectQuestion, answeredQuestions }) => {
    const dollarValues = round === 'jeopardy' ? [200, 400, 600, 800, 1000] : [400, 800, 1200, 1600, 2000];

    return (
        <div className="grid grid-cols-6 gap-2 text-center">
            {/* Category Headers */}
            {categories.slice(0, 6).map((cat) => (
                <div 
                    key={cat.name} 
                    className="bg-blue-800 text-white p-4 font-bold h-24 flex items-center justify-center text-sm" // Reduced font size
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
                            return <div key={`${cat.name}-${value}`} className="bg-gray-400 p-4 h-24"></div>;
                        }

                        const isAnswered = answeredQuestions.includes(question.question);
                        
                        return (
                            <div
                                key={`${cat.name}-${value}`}
                                onClick={() => !isAnswered && onSelectQuestion(cat, question)}
                                className={`p-4 h-24 flex items-center justify-center cursor-pointer ${
                                    isAnswered ? 'bg-gray-500 text-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                                } text-white text-xl font-bold transition-colors`} // Reduced font size from 2xl to xl
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
