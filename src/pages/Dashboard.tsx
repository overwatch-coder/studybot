import React from "react";
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

const Dashboard = () => {
  const navigate = useNavigate();

  // Placeholder data - in a real app, this would come from your backend
  const progressData = {
    completedModules: 3,
    totalModules: 5,
    lastActivity: "Introduction to React",
    timeSpent: "2h 30m",
  };

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
            Student Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(progressData.completedModules / progressData.totalModules) * 100}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                {progressData.completedModules} of {progressData.totalModules} modules completed
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Last Activity</CardTitle>
              <CardDescription>Recent learning session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{progressData.lastActivity}</p>
              <p className="text-sm text-muted-foreground">
                Time spent: {progressData.timeSpent}
              </p>
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
                  Questions Answered: <span className="font-medium">42</span>
                </p>
                <p className="text-sm">
                  Flashcards Reviewed: <span className="font-medium">156</span>
                </p>
                <p className="text-sm">
                  Study Sessions: <span className="font-medium">15</span>
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