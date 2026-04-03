
import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getApiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";
import { useGeneratedContent } from "@/hooks/use-generated-content";
import { useSessionActions } from "@/hooks/use-session-actions";

interface PracticeQuestionsProps {
  courseInfo: CourseInfo;
}

const PracticeQuestions: React.FC<PracticeQuestionsProps> = ({
  courseInfo,
}) => {
  const [questions, setQuestions] = React.useState<
    Array<{
      question: string;
      answer: string;
    }>
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(
    null
  );
  const [quantity, setQuantity] = React.useState(5);
  const { toast } = useToast();
  const { loadCurrentContent, saveCurrentContent } = useGeneratedContent<Array<{ question: string; answer: string }>>("questions");
  const { incrementCurrentSession } = useSessionActions();

  React.useEffect(() => {
    const restoreQuestions = async () => {
      const savedContent = await loadCurrentContent();

      if (Array.isArray(savedContent)) {
        setQuestions(savedContent);
      }
    };

    void restoreQuestions();
  }, []);

  const generateQuestions = async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      toast({
        title:
          courseInfo.language === "French"
            ? "Clé API requise"
            : "API Key Required",
        description:
          courseInfo.language === "French"
            ? "Veuillez configurer votre clé API dans les paramètres"
            : "Add your API key using the key button in the top-right corner",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt =
        courseInfo.language === "French"
          ? `Génère ${quantity} questions pratiques pour le module "${courseInfo.module}" de niveau ${courseInfo.level}. Format: JSON array avec "question" et "answer" pour chaque élément. Commence directement par la réponse formatée. Aucun texte ou phrase avant ou après.`
          : `Generate ${quantity} practice questions for the "${courseInfo.module}" module at ${courseInfo.level} level. Format: JSON array with "question" and "answer" for each item. Start directly with the formatted response. No texts or sentences before or after.`;

      const response = await generateAIContent(
        apiKey,
        prompt,
        courseInfo.language,
        courseInfo.pdfContent
      );
      const generatedQuestions = JSON.parse(response);
      setQuestions(generatedQuestions);
      await saveCurrentContent(generatedQuestions);
      
      await incrementCurrentSession({
        practice_questions_generated: quantity,
      });
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

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
        {courseInfo.language === "French"
          ? "Questions Pratiques"
          : "Practice Questions"}
      </h2>

      <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium">
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
            className="w-full text-xs sm:text-sm"
          />
        </div>

        <Button
          onClick={generateQuestions}
          disabled={loading}
          className="w-full text-xs sm:text-sm"
        >
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
        <div className="space-y-3 sm:space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="glass-card p-4 sm:p-5 rounded-xl">
              <button
                className="w-full text-left font-medium text-sm sm:text-base text-foreground flex items-center justify-between gap-2"
                onClick={() =>
                  setExpandedQuestion(expandedQuestion === index ? null : index)
                }
              >
                <span>{q.question}</span>
                <span className="text-muted-foreground text-xs shrink-0">{expandedQuestion === index ? "Hide" : "Show"}</span>
              </button>
              {expandedQuestion === index && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticeQuestions;
