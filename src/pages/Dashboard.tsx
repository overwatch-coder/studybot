import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { getAnonymousId } from "@/utils/anonymousId";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    totalSessions: 0,
    questionsAnswered: 0,
    flashcardsReviewed: 0,
    averageScore: 0,
    recentModules: [] as string[],
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
        const avgScore = quizResults.length > 0
          ? quizResults.reduce((sum, quiz) => sum + (quiz.score / quiz.total_questions * 100), 0) / quizResults.length
          : 0;
        const recentModules = [...new Set(sessions.slice(0, 5).map(s => s.module))];

        setStats({
          totalSessions: sessions.length,
          questionsAnswered: totalQuestions,
          flashcardsReviewed: totalFlashcards,
          averageScore: Math.round(avgScore),
          recentModules,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Learning Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Study Progress</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={stats.averageScore} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Average Quiz Score: {stats.averageScore}%
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest modules studied</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.recentModules.map((module, index) => (
                  <p key={index} className="text-sm">
                    {module}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Study Statistics</CardTitle>
              <CardDescription>Your learning analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Total Sessions: <span className="font-medium">{stats.totalSessions}</span>
                </p>
                <p className="text-sm">
                  Questions Answered:{" "}
                  <span className="font-medium">{stats.questionsAnswered}</span>
                </p>
                <p className="text-sm">
                  Flashcards Reviewed:{" "}
                  <span className="font-medium">{stats.flashcardsReviewed}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;