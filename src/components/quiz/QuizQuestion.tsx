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
      <p className="mb-5 text-base font-medium text-foreground">{question.question}</p>
      <div className="space-y-2.5">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full text-left p-3.5 rounded-lg border border-border/60 bg-white hover:bg-primary/5 hover:border-primary/30 transition-all duration-150 text-sm text-foreground"
          >
            <span className="inline-flex items-center gap-3">
              <span className="h-6 w-6 rounded-full border border-border flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

export default QuizQuestion;
