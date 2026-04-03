import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import {
  clearCurrentSessionId,
  createSession,
  getCurrentSessionRecord,
  getCurrentSessionId,
  getSessionById,
  incrementSessionCounters,
  resetStorage,
  setCurrentSessionId,
} from "./sessions";

describe("session storage", () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetStorage();
  });

  it("creates and updates a study session without Supabase", async () => {
    const session = await createSession({
      module: "Biology",
      level: "Beginner",
      language: "English",
      anonymousId: "anon-1",
    });

    expect(session.module).toBe("Biology");
    expect(session.questions_answered).toBe(0);
    expect(session.created_at).toBeTruthy();

    await incrementSessionCounters(session.id, {
      questions_answered: 1,
      time_spent: 5,
    });

    const updatedSession = await getSessionById(session.id);

    expect(updatedSession?.questions_answered).toBe(1);
    expect(updatedSession?.time_spent).toBe(5);
  });

  it("stores the active session id in localStorage", async () => {
    expect(getCurrentSessionId()).toBeNull();

    setCurrentSessionId("session-123");
    expect(getCurrentSessionId()).toBe("session-123");

    clearCurrentSessionId();
    expect(getCurrentSessionId()).toBeNull();
  });

  it("hydrates the current session from IndexedDB using the stored session id", async () => {
    const session = await createSession({
      module: "Biology",
      level: "Beginner",
      language: "English",
      anonymousId: "anon-1",
      pdfContent: "Persisted PDF context",
    });

    setCurrentSessionId(session.id);

    const hydratedSession = await getCurrentSessionRecord();

    expect(hydratedSession?.id).toBe(session.id);
    expect(hydratedSession?.pdf_content).toBe("Persisted PDF context");
    expect(localStorage.getItem("current_session")).toBeNull();
  });
});