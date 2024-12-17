import React from "react";

interface StudyGuideProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const StudyGuide: React.FC<StudyGuideProps> = ({ courseInfo }) => {
  const [guide, setGuide] = React.useState<Array<{
    title: string;
    content: string;
  }>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate AI content generation
    setTimeout(() => {
      const demoGuide = [
        {
          title: courseInfo.language === "French" ? "Objectifs d'apprentissage" : "Learning Objectives",
          content: courseInfo.language === "French"
            ? "Liste des objectifs en français"
            : "List of objectives in English",
        },
        {
          title: courseInfo.language === "French" ? "Plan d'étude" : "Study Plan",
          content: courseInfo.language === "French"
            ? "Plan détaillé en français"
            : "Detailed plan in English",
        },
        // Add more sections as needed
      ];
      setGuide(demoGuide);
      setLoading(false);
    }, 1500);
  }, [courseInfo]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">
        {courseInfo.language === "French" ? "Guide d'étude" : "Study Guide"}
      </h2>
      <div className="space-y-6">
        {guide.map((section, index) => (
          <div key={index} className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            <div className="prose max-w-none">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyGuide;