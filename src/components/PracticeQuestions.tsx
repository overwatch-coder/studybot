import React from "react";

interface PracticeQuestionsProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({ courseInfo }) => {
  const [questions, setQuestions] = React.useState<Array<{
    question: string;
    answer: string;
  }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Simulate AI content generation
    setTimeout(() => {
      const demoQuestions = [
        {
          question: courseInfo.language === "French"
            ? "Question pratique 1 en français"
            : "Practice question 1 in English",
          answer: courseInfo.language === "French"
            ? "Réponse détaillée 1 en français"
            : "Detailed answer 1 in English",
        },
        // Add more questions as needed
      ];
      setQuestions(demoQuestions);
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
        {courseInfo.language === "French" ? "Questions Pratiques" : "Practice Questions"}
      </h2>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="glass-card p-6 rounded-xl">
            <button
              className="w-full text-left font-medium"
              onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
            >
              {q.question}
            </button>
            {expandedQuestion === index && (
              <div className="mt-4 pt-4 border-t border-border">
                {q.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeQuestions;