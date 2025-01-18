import React from "react";
import { Button } from "@/components/ui/button";
import { CourseInfo } from "@/types/types";

interface QuizReviewProps {
  courseInfo: CourseInfo;
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
  userAnswers: number[];
  score: number;
  onNewQuiz: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({
  courseInfo,
  questions,
  userAnswers,
  score,
  onNewQuiz,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">
        {courseInfo.language === "French" ? "Révision du Quiz" : "Quiz Review"}
      </h3>
      <div className="text-center mb-6">
        <p>
          {courseInfo.language === "French"
            ? `Score: ${score}/${questions.length}`
            : `Score: ${score}/${questions.length}`}
        </p>
      </div>
      {questions.map((q, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            userAnswers[index] === q.correct
              ? "bg-green-500/10"
              : "bg-red-500/10"
          }`}
        >
          <p className="font-medium mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`p-2 rounded ${
                  optIndex === q.correct
                    ? "bg-green-500/20"
                    : optIndex === userAnswers[index]
                    ? "bg-red-500/20"
                    : "bg-accent/10"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button onClick={onNewQuiz} className="w-full">
        {courseInfo.language === "French"
          ? "Nouveau Quiz"
          : "Take Another Quiz"}
      </Button>
    </div>
  );
};

export default QuizReview;