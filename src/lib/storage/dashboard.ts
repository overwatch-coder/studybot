import { listQuizResultsByAnonymousId } from "./quizResults";
import { listSessionsByAnonymousId } from "./sessions";

export interface DashboardStats {
  totalSessions: number;
  questionsAnswered: number;
  flashcardsReviewed: number;
  averageScore: number;
  recentModules: string[];
  quizHistory: Array<{ date: string; score: number }>;
  modulePerformance: Array<{ module: string; averageScore: number }>;
  summariesGenerated: number;
  studyGuidesCreated: number;
  chatMessagesExchanged: number;
  practiceQuestionsGenerated: number;
  timeSpentMinutes: number;
}

export const buildDashboardStats = async (anonymousId: string): Promise<DashboardStats> => {
  const sessions = await listSessionsByAnonymousId(anonymousId);
  const quizResults = await listQuizResultsByAnonymousId(anonymousId);

  const totalQuestions = sessions.reduce((sum, session) => sum + (session.questions_answered || 0), 0);
  const totalFlashcards = sessions.reduce((sum, session) => sum + (session.flashcards_reviewed || 0), 0);
  const summariesGenerated = sessions.reduce((sum, session) => sum + (session.summaries_generated || 0), 0);
  const studyGuidesCreated = sessions.reduce((sum, session) => sum + (session.study_guides_created || 0), 0);
  const chatMessagesExchanged = sessions.reduce((sum, session) => sum + (session.chat_messages_exchanged || 0), 0);
  const practiceQuestionsGenerated = sessions.reduce((sum, session) => sum + (session.practice_questions_generated || 0), 0);
  const timeSpentMinutes = sessions.reduce((sum, session) => sum + (session.time_spent || 0), 0);

  const averageScore = quizResults.length > 0
    ? quizResults.reduce((sum, quiz) => sum + (quiz.score / quiz.total_questions) * 100, 0) / quizResults.length
    : 0;

  const recentModules = [...new Set([...sessions].reverse().slice(0, 5).map((session) => session.module))];

  const quizHistory = [...quizResults].reverse().map((quiz) => ({
    date: new Date(quiz.created_at || "").toLocaleDateString(),
    score: (quiz.score / quiz.total_questions) * 100,
  }));

  const modulePerformance = Object.entries(
    quizResults.reduce<Record<string, { total: number; count: number }>>((accumulator, quiz) => {
      if (!accumulator[quiz.module]) {
        accumulator[quiz.module] = { total: 0, count: 0 };
      }

      accumulator[quiz.module].total += (quiz.score / quiz.total_questions) * 100;
      accumulator[quiz.module].count += 1;
      return accumulator;
    }, {}),
  ).map(([module, data]) => ({
    module,
    averageScore: data.total / data.count,
  }));

  return {
    totalSessions: sessions.length,
    questionsAnswered: totalQuestions,
    flashcardsReviewed: totalFlashcards,
    averageScore: Math.round(averageScore),
    recentModules,
    quizHistory,
    modulePerformance,
    summariesGenerated,
    studyGuidesCreated,
    chatMessagesExchanged,
    practiceQuestionsGenerated,
    timeSpentMinutes,
  };
};