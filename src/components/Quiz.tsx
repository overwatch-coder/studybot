import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";
import { supabase } from "@/integrations/supabase/client";
import { getAnonymousId } from "@/utils/anonymousId";

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
  const [userAnswers, setUserAnswers] = React.useState<number[]>([]);
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
      setUserAnswers([]);
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

  const saveQuizResult = async (score: number, total: number, answers: number[]) => {
    try {
      await supabase.from('quiz_results').insert({
        anonymous_id: getAnonymousId(),
        module: courseInfo.module,
        score,
        total_questions: total,
        questions: questions,
        user_answers: answers,
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const handleAnswer = async (selectedOption: number) => {
    const newUserAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newUserAnswers);

    if (selectedOption === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      await saveQuizResult(
        score + (selectedOption === questions[currentQuestion].correct ? 1 : 0),
        questions.length,
        newUserAnswers
      );
    }
  };

  const renderQuizReview = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4">
        {courseInfo.language === "French" ? "Révision du Quiz" : "Quiz Review"}
      </h3>
      {questions.map((q, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            userAnswers[index] === q.correct
              ? "bg-green-500/10"
              : "bg-red-500/10"
          }`}
        >
          <p className="font-medium mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`p-2 rounded ${
                  optIndex === q.correct
                    ? "bg-green-500/20"
                    : optIndex === userAnswers[index]
                    ? "bg-red-500/20"
                    : "bg-accent/10"
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button onClick={generateQuiz} className="w-full">
        {courseInfo.language === "French"
          ? "Nouveau Quiz"
          : "Take Another Quiz"}
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold text-white">
        {courseInfo.language === "French" ? "Quiz" : "Quiz"}
      </h2>

      {!questions.length && (
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
      )}

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
              <p className="mb-6">
                {courseInfo.language === "French"
                  ? `Score: ${score}/${questions.length}`
                  : `Score: ${score}/${questions.length}`}
              </p>
              {renderQuizReview()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;