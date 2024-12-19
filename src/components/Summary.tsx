import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";

interface SummaryProps {
  courseInfo: CourseInfo;
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
          ? `Générez un résumé concis et structuré pour le module "${courseInfo.module}" au niveau ${courseInfo.level}. Le résumé doit être divisé en sections claires avec des titres appropriés et une brève description pour chaque section. Formatez-le de manière à ce qu'il puisse être utilisé directement dans du code HTML et reste visuellement attrayant même sans styles supplémentaires. Utilisez des balises HTML de base comme <h2>, <p>, et <ul>, et appliquez les styles nécessaires pour maintenir la lisibilité et une structure propre.`
          : `Generate a concise and structured summary for the "${courseInfo.module}" module at the ${courseInfo.level} level. The summary should be divided into clear sections with appropriate headings and a brief description for each section. Format it so that it can be used directly in HTML code and remains visually appealing even without additional styling. Use basic HTML tags like <h2>, <p>, and <ul>, and ensure that necessary inline styling is applied to maintain readability and a clean structure.
`;

      const response = await generateAIContent(
        apiKey,
        prompt,
        courseInfo.language,
        courseInfo.pdfContent
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

      {content && (
        <div className="glass-card p-6 rounded-xl mt-6 bg-white">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: content?.replace("html", "") }}
          />
        </div>
      )}

      <div className="p-6 space-y-4 max-w-sm mx-auto">
        <Button onClick={generateSummary} disabled={loading} className="w-full">
          {loading
            ? courseInfo.language === "French"
              ? "Génération..."
              : "Generating..."
            : content
            ? courseInfo.language === "French"
              ? "Générer à nouveau"
              : "Generate Again"
            : courseInfo.language === "French"
            ? "Générer"
            : "Generate"}
        </Button>
      </div>
    </div>
  );
};

export default Summary;
