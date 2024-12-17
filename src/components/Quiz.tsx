import React from "react";

interface QuizProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const Quiz: React.FC<QuizProps> = ({ courseInfo }) => {
  const [questions, setQuestions] = React.useState<Array<{
    question: string;
    options: string[];
    correct: number;
  }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);

  React.useEffect(() => {
    // Simulate AI content generation
    setTimeout(() => {
      const demoQuestions = [
        {
          question: courseInfo.language === "French" 
            ? "Question de quiz 1 en français" 
            : "Quiz question 1 in English",
          options: courseInfo.language === "French"
            ? ["Option 1 FR", "Option 2 FR", "Option 3 FR", "Option 4 FR"]
            : ["Option 1", "Option 2", "Option 3", "Option 4"],
          correct: 0,
        },
        // Add more questions as needed
      ];
      setQuestions(demoQuestions);
      setLoading(false);
    }, 1500);
  }, [courseInfo]);

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

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
        {courseInfo.language === "French" ? "Quiz" : "Quiz"}
      </h2>
      <div className="glass-card p-6 rounded-xl">
        {!showResult ? (
          <>
            <p className="mb-4">{questions[currentQuestion].question}</p>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              {courseInfo.language === "French" ? "Résultats" : "Results"}
            </h3>
            <p>
              {courseInfo.language === "French"
                ? `Score: ${score}/${questions.length}`
                : `Score: ${score}/${questions.length}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;