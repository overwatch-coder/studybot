import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { createSession, listSessionsByAnonymousId, resetStorage } from "./sessions";
import { listQuizResultsByAnonymousId, saveQuizResult } from "./quizResults";

describe("quiz result storage", () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetStorage();
  });

  it("stores quiz attempts for the active anonymous user", async () => {
    await createSession({
      module: "Biology",
      level: "Beginner",
      language: "English",
      anonymousId: "anon-1",
    });

    await saveQuizResult({
      anonymousId: "anon-1",
      module: "Biology",
      score: 4,
      totalQuestions: 5,
      questions: [{ question: "Q1", options: ["A", "B"], correct: 0 }],
      userAnswers: [0],
    });

    const sessions = await listSessionsByAnonymousId("anon-1");
    const quizResults = await listQuizResultsByAnonymousId("anon-1");

    expect(sessions).toHaveLength(1);
    expect(quizResults).toHaveLength(1);
    expect(quizResults[0].score).toBe(4);
    expect(quizResults[0].total_questions).toBe(5);
  });
});