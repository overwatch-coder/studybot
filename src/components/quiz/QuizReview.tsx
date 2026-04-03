import React from "react";
import { Button } from "@/components/ui/button";
import { CourseInfo } from "@/types/types";
import { CheckCircle2, XCircle } from "lucide-react";

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
  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Score summary */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-3">
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
        <p className="text-lg font-semibold text-foreground">
          {score}/{questions.length} correct
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {percentage >= 80 ? "Excellent work!" : percentage >= 60 ? "Good effort!" : "Keep practicing!"}
        </p>
      </div>

      {/* Question review */}
      <div className="space-y-4">
        {questions.map((q, index) => {
          const isCorrect = userAnswers[index] === q.correct;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                isCorrect
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-red-50/50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-2 mb-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <p className="font-medium text-sm text-foreground">{q.question}</p>
              </div>
              <div className="space-y-1.5 ml-7">
                {q.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-2.5 rounded-lg text-sm ${
                      optIndex === q.correct
                        ? "bg-emerald-100 text-emerald-800 font-medium"
                        : optIndex === userAnswers[index] && optIndex !== q.correct
                        ? "bg-red-100 text-red-700"
                        : "bg-white/60 text-muted-foreground"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="text-xs font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                      {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button onClick={onNewQuiz} className="w-full">
        {courseInfo.language === "French"
          ? "Nouveau Quiz"
          : "Take Another Quiz"}
      </Button>
    </div>
  );
};

export default QuizReview;
