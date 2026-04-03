
import React from "react";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Brain, Clock, MessageSquare, FileText, ListChecks, Target, HelpCircle } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalSessions: number;
    questionsAnswered: number;
    flashcardsReviewed: number;
    averageScore: number;
    recentModules: string[];
    summariesGenerated: number;
    studyGuidesCreated: number;
    chatMessagesExchanged: number;
    timeSpentMinutes: number;
    practiceQuestionsGenerated?: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatTime = (minutes?: number) => {
    if (!minutes) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  const statItems = [
    { label: "Sessions", value: stats.totalSessions, icon: Target, color: "text-blue-600 bg-blue-50" },
    { label: "Quiz Score", value: `${stats.averageScore}%`, icon: Brain, color: "text-violet-600 bg-violet-50" },
    { label: "Questions", value: stats.questionsAnswered, icon: HelpCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Flashcards", value: stats.flashcardsReviewed, icon: BookOpen, color: "text-amber-600 bg-amber-50" },
    { label: "Summaries", value: stats.summariesGenerated, icon: FileText, color: "text-cyan-600 bg-cyan-50" },
    { label: "Study Guides", value: stats.studyGuidesCreated, icon: ListChecks, color: "text-rose-600 bg-rose-50" },
    { label: "Chat Messages", value: stats.chatMessagesExchanged, icon: MessageSquare, color: "text-indigo-600 bg-indigo-50" },
    { label: "Time Spent", value: formatTime(stats.timeSpentMinutes), icon: Clock, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">Average Quiz Score</span>
          <span className="text-sm font-semibold text-primary">{stats.averageScore}%</span>
        </div>
        <Progress value={stats.averageScore} className="h-2" />
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="stat-card flex flex-col gap-3">
            <div className={`h-9 w-9 rounded-lg ${item.color} flex items-center justify-center`}>
              <item.icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent modules */}
      {stats.recentModules.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Modules</h3>
          <div className="flex flex-wrap gap-2">
            {stats.recentModules.map((module, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-medium"
              >
                {module}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCards;
