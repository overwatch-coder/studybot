import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { buildDashboardStats } from "./dashboard";
import { saveQuizResult } from "./quizResults";
import { createSession, incrementSessionCounters, resetStorage } from "./sessions";

describe("dashboard aggregation", () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetStorage();
  });

  it("aggregates sessions and quiz results from browser storage", async () => {
    const session = await createSession({
      anonymousId: "anon-1",
      module: "Biology",
      level: "Beginner",
      language: "English",
    });

    await incrementSessionCounters(session.id, {
      questions_answered: 2,
      flashcards_reviewed: 3,
      summaries_generated: 1,
      study_guides_created: 1,
      chat_messages_exchanged: 5,
      practice_questions_generated: 4,
      time_spent: 15,
    });

    await saveQuizResult({
      anonymousId: "anon-1",
      module: "Biology",
      score: 4,
      totalQuestions: 5,
      questions: [{ question: "Q1", options: ["A", "B"], correct: 0 }],
      userAnswers: [0],
    });

    const stats = await buildDashboardStats("anon-1");

    expect(stats.totalSessions).toBe(1);
    expect(stats.questionsAnswered).toBe(2);
    expect(stats.flashcardsReviewed).toBe(3);
    expect(stats.averageScore).toBe(80);
    expect(stats.recentModules).toEqual(["Biology"]);
    expect(stats.quizHistory).toHaveLength(1);
    expect(stats.modulePerformance).toEqual([
      { module: "Biology", averageScore: 80 },
    ]);
  });
});