import Dexie, { type Table } from "dexie";

export interface SessionRecord {
  id: string;
  anonymous_id: string;
  module: string;
  level: string;
  language: string;
  pdf_content?: string;
  created_at: string;
  updated_at: string;
  questions_answered: number;
  flashcards_reviewed: number;
  summaries_generated: number;
  study_guides_created: number;
  chat_messages_exchanged: number;
  practice_questions_generated: number;
  time_spent: number;
}

export interface QuizQuestionRecord {
  question: string;
  options: string[];
  correct: number;
}

export interface QuizResultRecord {
  id: string;
  anonymous_id: string;
  module: string;
  score: number;
  total_questions: number;
  questions: QuizQuestionRecord[];
  user_answers: number[];
  created_at: string;
}

export type GeneratedContentKind = "summary" | "flashcards" | "questions" | "guide" | "chat";

export interface GeneratedContentRecord {
  id: string;
  session_id: string;
  kind: GeneratedContentKind;
  content: unknown;
  created_at: string;
  updated_at: string;
}

class StudybotDatabase extends Dexie {
  sessions!: Table<SessionRecord, string>;
  quizResults!: Table<QuizResultRecord, string>;
  generatedContent!: Table<GeneratedContentRecord, string>;

  constructor() {
    super("studybot");

    this.version(1).stores({
      sessions: "id, anonymous_id, created_at, module",
      quizResults: "id, anonymous_id, created_at, module",
      generatedContent: "id, session_id, kind, updated_at",
    });
  }
}

export const database = new StudybotDatabase();