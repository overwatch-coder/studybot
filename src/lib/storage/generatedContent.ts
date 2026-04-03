import {
  database,
  type GeneratedContentKind,
  type GeneratedContentRecord,
} from "./db";

export interface SaveGeneratedContentInput {
  sessionId: string;
  kind: GeneratedContentKind;
  content: unknown;
}

const createGeneratedContentId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `content-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const saveGeneratedContent = async ({
  sessionId,
  kind,
  content,
}: SaveGeneratedContentInput): Promise<GeneratedContentRecord> => {
  const existingRecord = await database.generatedContent
    .where("session_id")
    .equals(sessionId)
    .filter((record) => record.kind === kind)
    .first();

  const now = new Date().toISOString();
  const nextRecord: GeneratedContentRecord = {
    id: existingRecord?.id ?? createGeneratedContentId(),
    session_id: sessionId,
    kind,
    content,
    created_at: existingRecord?.created_at ?? now,
    updated_at: now,
  };

  await database.generatedContent.put(nextRecord);
  return nextRecord;
};

export const loadGeneratedContent = async (sessionId: string, kind: GeneratedContentKind) => {
  const matchingRecords = await database.generatedContent.where("session_id").equals(sessionId).toArray();

  return matchingRecords
    .filter((record) => record.kind === kind)
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at))[0] ?? null;
};