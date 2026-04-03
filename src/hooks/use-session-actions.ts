import { StudyOption } from "@/components/StudyOptions";
import {
  createSession,
  getCurrentSessionRecord,
  incrementSessionCounters,
  setCurrentSessionId,
} from "@/lib/storage/sessions";
import { CourseInfo } from "@/types/types";
import { getAnonymousId } from "@/utils/anonymousId";

const getSessionUpdatesForOption = (option: StudyOption) => {
  const updates: Record<string, number> = {};

  if (option === "quiz") {
    updates.questions_answered = 1;
  } else if (option === "flashcards") {
    updates.flashcards_reviewed = 1;
  } else if (option === "summary") {
    updates.summaries_generated = 1;
    updates.time_spent = 5;
  } else if (option === "guide") {
    updates.study_guides_created = 1;
    updates.time_spent = 5;
  } else if (option === "chat") {
    updates.chat_messages_exchanged = 5;
    updates.time_spent = 5;
  } else if (option === "questions") {
    updates.practice_questions_generated = 5;
    updates.time_spent = 5;
  }

  return updates;
};

export const useSessionActions = () => {
  const startSession = async (courseInfo: CourseInfo) => {
    const session = await createSession({
      anonymousId: getAnonymousId(),
      module: courseInfo.module,
      level: courseInfo.level,
      language: courseInfo.language,
      pdfContent: courseInfo.pdfContent,
    });

    setCurrentSessionId(session.id);
    return session;
  };

  const updateSessionForOption = async (sessionId: string, option: StudyOption) => {
    const updates = getSessionUpdatesForOption(option);
    return incrementSessionCounters(sessionId, updates);
  };

  const incrementCurrentSession = async (updates: Record<string, number>) => {
    const currentSession = await getCurrentSessionRecord();

    if (!currentSession) {
      return null;
    }

    return incrementSessionCounters(currentSession.id, updates);
  };

  return {
    startSession,
    incrementCurrentSession,
    updateSessionForOption,
  };
};