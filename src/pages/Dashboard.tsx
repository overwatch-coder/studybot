
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getAnonymousId } from "@/utils/anonymousId";
import StatsCards from "@/components/dashboard/StatsCards";
import PerformanceCharts from "@/components/dashboard/PerformanceCharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    totalSessions: 0,
    questionsAnswered: 0,
    flashcardsReviewed: 0,
    averageScore: 0,
    recentModules: [] as string[],
    quizHistory: [] as any[],
    modulePerformance: [] as any[],
    summariesGenerated: 0,
    studyGuidesCreated: 0,
    chatMessagesExchanged: 0,
    practiceQuestionsGenerated: 0,
    timeSpentMinutes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const anonymousId = getAnonymousId();

      // Fetch sessions data
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('anonymous_id', anonymousId)
        .order('created_at', { ascending: false });

      // Fetch quiz results
      const { data: quizResults } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('anonymous_id', anonymousId)
        .order('created_at', { ascending: false });

      if (sessions && quizResults) {
        const totalQuestions = sessions.reduce((sum, session) => sum + (session.questions_answered || 0), 0);
        const totalFlashcards = sessions.reduce((sum, session) => sum + (session.flashcards_reviewed || 0), 0);
        const summariesGenerated = sessions.reduce((sum, session) => sum + (session.summaries_generated || 0), 0);
        const studyGuidesCreated = sessions.reduce((sum, session) => sum + (session.study_guides_created || 0), 0);
        const chatMessagesExchanged = sessions.reduce((sum, session) => sum + (session.chat_messages_exchanged || 0), 0);
        const practiceQuestionsGenerated = sessions.reduce((sum, session) => sum + (session.practice_questions_generated || 0), 0);
        const timeSpentMinutes = sessions.reduce((sum, session) => sum + (session.time_spent || 0), 0);
        
        const avgScore = quizResults.length > 0
          ? quizResults.reduce((sum, quiz) => sum + (quiz.score / quiz.total_questions * 100), 0) / quizResults.length
          : 0;
        const recentModules = [...new Set(sessions.slice(0, 5).map(s => s.module))];

        // Prepare quiz history data for the line chart
        const quizHistory = quizResults.map(quiz => ({
          date: new Date(quiz.created_at || '').toLocaleDateString(),
          score: (quiz.score / quiz.total_questions) * 100,
        }));

        // Prepare module performance data for the bar chart
        const modulePerformance = Object.entries(
          quizResults.reduce((acc: any, quiz) => {
            if (!acc[quiz.module]) {
              acc[quiz.module] = { total: 0, count: 0 };
            }
            acc[quiz.module].total += (quiz.score / quiz.total_questions) * 100;
            acc[quiz.module].count += 1;
            return acc;
          }, {})
        ).map(([module, data]: [string, any]) => ({
          module,
          averageScore: data.total / data.count,
        }));

        setStats({
          totalSessions: sessions.length,
          questionsAnswered: totalQuestions,
          flashcardsReviewed: totalFlashcards,
          averageScore: Math.round(avgScore),
          recentModules,
          quizHistory,
          modulePerformance,
          summariesGenerated,
          studyGuidesCreated,
          chatMessagesExchanged,
          practiceQuestionsGenerated,
          timeSpentMinutes,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Learning Dashboard
          </h1>
        </div>

        <StatsCards stats={stats} />
        <PerformanceCharts
          quizHistory={stats.quizHistory}
          modulePerformance={stats.modulePerformance}
        />
      </div>
    </div>
  );
};

export default Dashboard;
