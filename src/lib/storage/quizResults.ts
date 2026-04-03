import { database, type QuizQuestionRecord, type QuizResultRecord } from "./db";

export interface SaveQuizResultInput {
  anonymousId: string;
  module: string;
  score: number;
  totalQuestions: number;
  questions: QuizQuestionRecord[];
  userAnswers: number[];
}

const createQuizResultId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const saveQuizResult = async ({
  anonymousId,
  module,
  score,
  totalQuestions,
  questions,
  userAnswers,
}: SaveQuizResultInput): Promise<QuizResultRecord> => {
  const quizResult: QuizResultRecord = {
    id: createQuizResultId(),
    anonymous_id: anonymousId,
    module,
    score,
    total_questions: totalQuestions,
    questions,
    user_answers: userAnswers,
    created_at: new Date().toISOString(),
  };

  await database.quizResults.put(quizResult);
  return quizResult;
};

export const listQuizResultsByAnonymousId = async (anonymousId: string) => {
  const quizResults = await database.quizResults.where("anonymous_id").equals(anonymousId).toArray();
  return quizResults.sort((left, right) => right.created_at.localeCompare(left.created_at));
};