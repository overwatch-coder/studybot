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
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
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
  );
};

export default StatsCards;