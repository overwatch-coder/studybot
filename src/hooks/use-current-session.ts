import React from "react";

import { clearCurrentSessionId, getCurrentSessionRecord } from "@/lib/storage/sessions";
import { CourseInfo } from "@/types/types";

export const useCurrentSession = () => {
  const [courseInfo, setCourseInfo] = React.useState<CourseInfo | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const restoreSession = async () => {
      const session = await getCurrentSessionRecord();

      if (!session) {
        return;
      }

      setSessionId(session.id);
      setCourseInfo({
        module: session.module,
        language: session.language,
        level: session.level,
        pdfContent: session.pdf_content,
      });
    };

    void restoreSession();
  }, []);

  const clearSession = () => {
    clearCurrentSessionId();
    setCourseInfo(null);
    setSessionId(null);
  };

  return {
    courseInfo,
    sessionId,
    setCourseInfo,
    setSessionId,
    clearSession,
  };
};