import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { loadGeneratedContent, saveGeneratedContent } from "./generatedContent";
import { createSession, resetStorage } from "./sessions";

describe("generated content storage", () => {
  beforeEach(async () => {
    localStorage.clear();
    await resetStorage();
  });

  it("persists the latest generated content for a session and content kind", async () => {
    const session = await createSession({
      anonymousId: "anon-1",
      module: "Biology",
      level: "Beginner",
      language: "English",
    });

    await saveGeneratedContent({
      sessionId: session.id,
      kind: "summary",
      content: "A stored summary",
    });

    const savedContent = await loadGeneratedContent(session.id, "summary");

    expect(savedContent?.content).toBe("A stored summary");
  });
});