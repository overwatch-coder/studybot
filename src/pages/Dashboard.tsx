import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { CourseInfo } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [progressData, setProgressData] = useState({
    completedModules: 0,
    totalModules: 0,
    lastActivity: "",
    timeSpent: "0m",
    questionsAnswered: 0,
    flashcardsReviewed: 0,
    studySessions: 0,
  });

  useEffect(() => {
    // Load course info from local storage
    const storedCourseInfo = localStorage.getItem("courseInfo");
    if (storedCourseInfo) {
      setCourseInfo(JSON.parse(storedCourseInfo));
    } else if (!location.state?.fromSetup) {
      toast({
        title: "No course information found",
        description: "Please set up your course first",
        variant: "destructive",
      });
      navigate("/setup");
    }

    // Load progress data from local storage
    const storedProgress = localStorage.getItem("userProgress");
    if (storedProgress) {
      setProgressData(JSON.parse(storedProgress));
    }

    // Track study session
    const currentSession = {
      startTime: new Date().toISOString(),
      module: JSON.parse(storedCourseInfo || '{}')?.module || 'Unknown',
    };
    
    localStorage.setItem('currentSession', JSON.stringify(currentSession));

    return () => {
      // Update study session data when component unmounts
      const session = JSON.parse(localStorage.getItem('currentSession') || '{}');
      if (session.startTime) {
        const duration = new Date().getTime() - new Date(session.startTime).getTime();
        const minutes = Math.round(duration / (1000 * 60));
        
        const updatedProgress = {
          ...progressData,
          timeSpent: `${parseInt(progressData.timeSpent) + minutes}m`,
          studySessions: progressData.studySessions + 1,
          lastActivity: session.module,
        };
        
        localStorage.setItem('userProgress', JSON.stringify(updatedProgress));
        setProgressData(updatedProgress);
      }
    };
  }, [navigate, location.state, toast]);

  const getProgressPercentage = () => {
    return progressData.completedModules > 0
      ? (progressData.completedModules / Math.max(progressData.totalModules, 1)) * 100
      : 0;
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
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Student Dashboard
            </h1>
            {courseInfo && (
              <p className="text-muted-foreground mt-1">
                {courseInfo.module} - {courseInfo.level}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={getProgressPercentage()}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                {progressData.completedModules} of {Math.max(progressData.totalModules, 1)} modules completed
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Last Activity</CardTitle>
              <CardDescription>Recent learning session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{progressData.lastActivity || "No activity yet"}</p>
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
                  Questions Answered:{" "}
                  <span className="font-medium">{progressData.questionsAnswered}</span>
                </p>
                <p className="text-sm">
                  Flashcards Reviewed:{" "}
                  <span className="font-medium">{progressData.flashcardsReviewed}</span>
                </p>
                <p className="text-sm">
                  Study Sessions:{" "}
                  <span className="font-medium">{progressData.studySessions}</span>
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