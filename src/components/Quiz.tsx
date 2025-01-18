import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";
import { supabase } from "@/integrations/supabase/client";
import { getAnonymousId } from "@/utils/anonymousId";
import QuizGenerator from "./quiz/QuizGenerator";
import QuizQuestion from "./quiz/QuizQuestion";
import QuizReview from "./quiz/QuizReview";

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

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold text-white">
        {courseInfo.language === "French" ? "Quiz" : "Quiz"}
      </h2>

      {!questions.length ? (
        <QuizGenerator
          courseInfo={courseInfo}
          quantity={quantity}
          loading={loading}
          setQuantity={setQuantity}
          onGenerate={generateQuiz}
        />
      ) : (
        <div className="glass-card p-6 rounded-xl">
          {!showResult ? (
            <QuizQuestion
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          ) : (
            <QuizReview
              courseInfo={courseInfo}
              questions={questions}
              userAnswers={userAnswers}
              score={score}
              onNewQuiz={generateQuiz}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;