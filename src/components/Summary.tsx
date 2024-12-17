import React from "react";

interface SummaryProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const Summary: React.FC<SummaryProps> = ({ courseInfo }) => {
  const [content, setContent] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate AI content generation
    setTimeout(() => {
      const summaryContent = courseInfo.language === "French" 
        ? `Résumé du module ${courseInfo.module}`
        : `Summary of ${courseInfo.module}`;
      setContent(summaryContent);
      setLoading(false);
    }, 1500);
  }, [courseInfo]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="prose max-w-none animate-fade-up">
      <h2 className="text-2xl font-bold mb-4">
        {courseInfo.language === "French" ? "Résumé" : "Summary"}
      </h2>
      <div className="glass-card p-6 rounded-xl">
        {content}
      </div>
    </div>
  );
};

export default Summary;