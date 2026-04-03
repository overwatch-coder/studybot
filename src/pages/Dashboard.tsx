
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCards from "@/components/dashboard/StatsCards";
import PerformanceCharts from "@/components/dashboard/PerformanceCharts";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const Dashboard = () => {
  const navigate = useNavigate();
  const stats = useDashboardStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="border-b border-border/60 bg-white/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">StudyBot</span>
          </button>
          <Button
            size="sm"
            onClick={() => navigate('/setup')}
          >
            New session
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Learning Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your study progress and performance across all modules.</p>
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
