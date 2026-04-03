import React from "react";

import { buildDashboardStats, type DashboardStats } from "@/lib/storage/dashboard";
import { getAnonymousId } from "@/utils/anonymousId";

const initialStats: DashboardStats = {
  totalSessions: 0,
  questionsAnswered: 0,
  flashcardsReviewed: 0,
  averageScore: 0,
  recentModules: [],
  quizHistory: [],
  modulePerformance: [],
  summariesGenerated: 0,
  studyGuidesCreated: 0,
  chatMessagesExchanged: 0,
  practiceQuestionsGenerated: 0,
  timeSpentMinutes: 0,
};

export const useDashboardStats = () => {
  const [stats, setStats] = React.useState<DashboardStats>(initialStats);

  React.useEffect(() => {
    const fetchStats = async () => {
      const nextStats = await buildDashboardStats(getAnonymousId());
      setStats(nextStats);
    };

    void fetchStats();
  }, []);

  return stats;
};