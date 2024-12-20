import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";

interface QuizProps {
  courseInfo: CourseInfo;
}

const Quiz: React.FC<QuizProps> = ({ courseInfo }) => {
  const [questions, setQuestions] = React.useState<
    Array<{
      question: string;
      options: string[];
      correct: number;
    }>
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [quantity, setQuantity] = React.useState(5);
  const { toast } = useToast();

  const generateQuiz = async () => {
    if (!apiKey) {
      toast({
        title:
          courseInfo.language === "French"
            ? "Clé API requise"
            : "API Key Required",
        description:
          courseInfo.language === "French"
            ? "Veuillez entrer votre clé API Perplexity"
            : "Please enter your Perplexity API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt =
        courseInfo.language === "French"
          ? `Génère ${quantity} questions de quiz pour le module "${courseInfo.module}" de niveau ${courseInfo.level}. Format: JSON array avec "question", "options" (array de 4 choix), et "correct" (index 0-3) pour chaque question. Commence directement par la réponse formatée. Aucun texte ou phrase avant ou après.`
          : `Generate ${quantity} quiz questions for the "${courseInfo.module}" module at ${courseInfo.level} level. Format: JSON array with "question", "options" (array of 4 choices), and "correct" (index 0-3) for each question. Start directly with the formatted response. No texts or sentences before or after.`;

      const response = await generateAIContent(
        apiKey,
        prompt,
        courseInfo.language,
        courseInfo.pdfContent
      );
      const generatedQuestions = JSON.parse(response);
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
    } catch (error) {
      toast({
        title: courseInfo.language === "French" ? "Erreur" : "Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold text-white">
        {courseInfo.language === "French" ? "Quiz" : "Quiz"}
      </h2>

      <div className="glass-card p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {courseInfo.language === "French"
              ? "Nombre de questions"
              : "Number of questions"}
          </label>
          <Input
            type="number"
            min="1"
            max="20"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <Button onClick={generateQuiz} disabled={loading} className="w-full">
          {loading
            ? courseInfo.language === "French"
              ? "Génération..."
              : "Generating..."
            : courseInfo.language === "French"
            ? "Générer"
            : "Generate"}
        </Button>
      </div>

      {questions.length > 0 && (
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
      )}
    </div>
  );
};

export default Quiz;
