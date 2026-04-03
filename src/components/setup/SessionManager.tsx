
import React from 'react';
import { CourseInfo } from "@/types/types";
import { useSessionActions } from "@/hooks/use-session-actions";

interface SessionManagerProps {
  courseInfo: CourseInfo | null;
  sessionId: string | null;
  setSessionId: (id: string) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ courseInfo, sessionId, setSessionId }) => {
  const { startSession: startPersistedSession } = useSessionActions();

  const startSession = async (info: CourseInfo) => {
    try {
      const session = await startPersistedSession(info);

      setSessionId(session.id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  React.useEffect(() => {
    if (courseInfo && !sessionId) {
      startSession(courseInfo);
    }
  }, [courseInfo, sessionId]);

  return null;
};
