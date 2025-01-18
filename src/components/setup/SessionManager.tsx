import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { StudyOption } from "@/components/StudyOptions";
import { CourseInfo } from "@/types/types";
import { getAnonymousId } from "@/utils/anonymousId";

interface SessionManagerProps {
  courseInfo: CourseInfo | null;
  setSessionId: (id: string) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ courseInfo, setSessionId }) => {
  const startSession = async (info: CourseInfo) => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          anonymous_id: getAnonymousId(),
          module: info.module,
          level: info.level,
          language: info.language,
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  React.useEffect(() => {
    if (courseInfo) {
      startSession(courseInfo);
    }
  }, [courseInfo]);

  return null;
};