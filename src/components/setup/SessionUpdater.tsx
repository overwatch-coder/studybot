import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { StudyOption } from "@/components/StudyOptions";

interface SessionUpdaterProps {
  sessionId: string | null;
  selectedOption: StudyOption | null;
}

export const SessionUpdater: React.FC<SessionUpdaterProps> = ({ sessionId, selectedOption }) => {
  const updateSession = async (option: StudyOption) => {
    if (!sessionId) return;

    try {
      const updates: Record<string, number> = {};
      
      if (option === 'quiz') {
        updates.questions_answered = 1;
      } else if (option === 'flashcards') {
        updates.flashcards_reviewed = 1;
      }

      await supabase
        .from('user_sessions')
        .update(updates)
        .eq('id', sessionId);
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