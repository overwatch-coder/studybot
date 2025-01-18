import React from "react";

interface QuizQuestionProps {
  question: {
    question: string;
    options: string[];
  };
  onAnswer: (index: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  return (
    <>
      <p className="mb-4">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
};

export default QuizQuestion;