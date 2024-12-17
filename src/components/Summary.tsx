import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";

interface SummaryProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const Summary: React.FC<SummaryProps> = ({ courseInfo }) => {
  const [content, setContent] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!apiKey) {
      toast({
        title:
          courseInfo.language === "French"
            ? "Clé API requise"
            : "API Key Required",
        description:
          courseInfo.language === "French"
            ? "Veuillez entrer votre clé API OpenAI"
            : "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt =
        courseInfo.language === "French"
          ? `Crée un résumé concis et structuré pour le module "${courseInfo.module}" de niveau ${courseInfo.level}.`
          : `Create a concise and structured summary for the "${courseInfo.module}" module at ${courseInfo.level} level.`;

      const response = await generateAIContent(
        apiKey,
        prompt,
        courseInfo.language
      );
      setContent(response);
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
    <div className="prose max-w-none animate-fade-up">
      <h2 className="text-2xl font-bold mb-4">
        {courseInfo.language === "French" ? "Résumé" : "Summary"}
      </h2>

      <div className="glass-card p-6 space-y-4">
        <Button onClick={generateSummary} disabled={loading} className="w-full">
          {loading
            ? courseInfo.language === "French"
              ? "Génération..."
              : "Generating..."
            : courseInfo.language === "French"
            ? "Générer"
            : "Generate"}
        </Button>
      </div>

      {content && (
        <div className="glass-card p-6 rounded-xl mt-6">{content}</div>
      )}
    </div>
  );
};

export default Summary;
