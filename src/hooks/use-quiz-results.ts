import { saveQuizResult } from "@/lib/storage/quizResults";
import { getAnonymousId } from "@/utils/anonymousId";

interface SaveQuizAttemptInput {
  module: string;
  score: number;
  totalQuestions: number;
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
  userAnswers: number[];
}

export const useQuizResults = () => {
  const saveQuizAttempt = async ({
    module,
    score,
    totalQuestions,
    questions,
    userAnswers,
  }: SaveQuizAttemptInput) => {
    return saveQuizResult({
      anonymousId: getAnonymousId(),
      module,
      score,
      totalQuestions,
      questions,
      userAnswers,
    });
  };

  return {
    saveQuizAttempt,
  };
};