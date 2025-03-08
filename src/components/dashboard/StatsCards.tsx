
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsCardsProps {
  stats: {
    totalSessions: number;
    questionsAnswered: number;
    flashcardsReviewed: number;
    averageScore: number;
    recentModules: string[];
    summariesGenerated?: number;
    studyGuidesCreated?: number;
    chatMessagesExchanged?: number;
    timeSpentMinutes?: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  // Format minutes into hours and minutes
  const formatTime = (minutes?: number) => {
    if (!minutes) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  return (
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
              Questions Answered: <span className="font-medium">{stats.questionsAnswered}</span>
            </p>
            <p className="text-sm">
              Flashcards Reviewed: <span className="font-medium">{stats.flashcardsReviewed}</span>
            </p>
            {stats.summariesGenerated !== undefined && (
              <p className="text-sm">
                Summaries Generated: <span className="font-medium">{stats.summariesGenerated}</span>
              </p>
            )}
            {stats.studyGuidesCreated !== undefined && (
              <p className="text-sm">
                Study Guides Created: <span className="font-medium">{stats.studyGuidesCreated}</span>
              </p>
            )}
            {stats.chatMessagesExchanged !== undefined && (
              <p className="text-sm">
                Chat Messages: <span className="font-medium">{stats.chatMessagesExchanged}</span>
              </p>
            )}
            {stats.timeSpentMinutes !== undefined && (
              <p className="text-sm">
                Time Spent: <span className="font-medium">{formatTime(stats.timeSpentMinutes)}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
