import { database, type SessionRecord } from "./db";

const CURRENT_SESSION_KEY = "current_session_id";
const LEGACY_CURRENT_SESSION_KEY = "current_session";

export interface CreateSessionInput {
  anonymousId: string;
  module: string;
  level: string;
  language: string;
  pdfContent?: string;
}

export type SessionCounterUpdates = Partial<
  Pick<
    SessionRecord,
    | "questions_answered"
    | "flashcards_reviewed"
    | "summaries_generated"
    | "study_guides_created"
    | "chat_messages_exchanged"
    | "practice_questions_generated"
    | "time_spent"
  >
>;

const createSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const createSession = async ({
  anonymousId,
  module,
  level,
  language,
  pdfContent,
}: CreateSessionInput): Promise<SessionRecord> => {
  const now = new Date().toISOString();
  const session: SessionRecord = {
    id: createSessionId(),
    anonymous_id: anonymousId,
    module,
    level,
    language,
    pdf_content: pdfContent,
    created_at: now,
    updated_at: now,
    questions_answered: 0,
    flashcards_reviewed: 0,
    summaries_generated: 0,
    study_guides_created: 0,
    chat_messages_exchanged: 0,
    practice_questions_generated: 0,
    time_spent: 0,
  };

  await database.sessions.put(session);
  return session;
};

export const getSessionById = async (sessionId: string) => {
  return database.sessions.get(sessionId) ?? null;
};

export const listSessionsByAnonymousId = async (anonymousId: string) => {
  const sessions = await database.sessions.where("anonymous_id").equals(anonymousId).toArray();
  return sessions.sort((left, right) => right.created_at.localeCompare(left.created_at));
};

export const incrementSessionCounters = async (
  sessionId: string,
  updates: SessionCounterUpdates,
) => {
  const existingSession = await database.sessions.get(sessionId);

  if (!existingSession) {
    return null;
  }

  const nextSession: SessionRecord = {
    ...existingSession,
    ...Object.fromEntries(
      Object.entries(updates).map(([key, value]) => [
        key,
        (existingSession[key as keyof SessionCounterUpdates] as number | undefined ?? 0) + (value ?? 0),
      ]),
    ),
    updated_at: new Date().toISOString(),
  };

  await database.sessions.put(nextSession);
  return nextSession;
};

export const setCurrentSessionId = (sessionId: string) => {
  localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
  localStorage.removeItem(LEGACY_CURRENT_SESSION_KEY);
};

export const getCurrentSessionId = () => {
  return localStorage.getItem(CURRENT_SESSION_KEY);
};

export const clearCurrentSessionId = () => {
  localStorage.removeItem(CURRENT_SESSION_KEY);
  localStorage.removeItem(LEGACY_CURRENT_SESSION_KEY);
};

export const getCurrentSessionRecord = async () => {
  const sessionId = getCurrentSessionId();

  if (!sessionId) {
    return null;
  }

  return getSessionById(sessionId);
};

export const resetStorage = async () => {
  await database.sessions.clear();
  await database.quizResults.clear();
  await database.generatedContent.clear();
};