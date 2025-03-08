
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
      
      // Update appropriate counters based on the selected study option
      if (option === 'quiz') {
        updates.questions_answered = 1;
      } else if (option === 'flashcards') {
        updates.flashcards_reviewed = 1;
      } else if (option === 'summary' || option === 'study-guide' || option === 'chat') {
        // For other options, increment the time_spent as a basic metric
        updates.time_spent = 5; // Add 5 minutes for these activities
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
