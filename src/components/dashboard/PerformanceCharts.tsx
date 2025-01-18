import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface PerformanceChartsProps {
  quizHistory: Array<{
    date: string;
    score: number;
  }>;
  modulePerformance: Array<{
    module: string;
    averageScore: number;
  }>;
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  quizHistory,
  modulePerformance,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Quiz Performance History</CardTitle>
          <CardDescription>Your progress over time</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            className="h-full"
            config={{
              score: {
                theme: {
                  light: "var(--primary)",
                  dark: "var(--primary)",
                },
              },
            }}
          >
            <LineChart data={quizHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Module Performance</CardTitle>
          <CardDescription>Average scores by module</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            className="h-full"
            config={{
              averageScore: {
                theme: {
                  light: "var(--primary)",
                  dark: "var(--primary)",
                },
              },
            }}
          >
            <BarChart data={modulePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="module" />
              <YAxis />
              <ChartTooltip />
              <Bar
                dataKey="averageScore"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceCharts;