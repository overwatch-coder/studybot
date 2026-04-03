import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

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

const chartTooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid hsl(220 13% 91%)',
  borderRadius: '10px',
  color: '#1e293b',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontSize: '13px',
  padding: '8px 12px',
};

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  quizHistory,
  modulePerformance,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
      <div className="glass-card p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Quiz Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your scores over time</p>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={quizHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#28509e"
                strokeWidth={2.5}
                dot={{ fill: '#28509e', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#4e72c9', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Module Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Average scores by module</p>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modulePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="module" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar
                dataKey="averageScore"
                fill="#28509e"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;
