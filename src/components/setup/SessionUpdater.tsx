
import React from 'react';
import { StudyOption } from "@/components/StudyOptions";
import { useSessionActions } from "@/hooks/use-session-actions";

interface SessionUpdaterProps {
  sessionId: string | null;
  selectedOption: StudyOption | null;
}

export const SessionUpdater: React.FC<SessionUpdaterProps> = ({ sessionId, selectedOption }) => {
  const { updateSessionForOption } = useSessionActions();

  const updateSession = async (option: StudyOption) => {
    if (!sessionId) return;

    try {
      await updateSessionForOption(sessionId, option);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  React.useEffect(() => {
    if (selectedOption) {
      updateSession(selectedOption);
    }
  }, [selectedOption, sessionId]);

  return null;
};
