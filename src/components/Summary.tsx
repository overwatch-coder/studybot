
import React, { useState } from "react";
import { streamAIContent } from "@/utils/aiContentGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";
import ChatMessage from "./chat/ChatMessage";

interface SummaryProps {
  courseInfo: CourseInfo;
}

const Summary: React.FC<SummaryProps> = ({ courseInfo }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      setIsStreaming(false);
      
      // Add a message indicating the generation was stopped
      const stopText = courseInfo.language === "French" 
        ? " (Génération arrêtée par l'utilisateur)"
        : " (Generation stopped by user)";
      
      setContent(prev => prev + stopText);
    }
  };

  const generateSummary = async () => {
    if (!apiKey) {
      toast({
        title: courseInfo.language === "French" ? "Clé API requise" : "API Key Required",
        description: courseInfo.language === "French"
          ? "Veuillez entrer votre clé API OpenAI"
          : "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setIsStreaming(true);
    setContent("");
    
    try {
      abortControllerRef.current = new AbortController();
      
      const prompt = courseInfo.language === "French"
        ? `Générez un résumé détaillé et structuré pour le module "${courseInfo.module}" au niveau ${courseInfo.level}. Utilisez des sections claires avec des titres appropriés (## pour les titres principaux, ### pour les sous-titres). Formatez le texte avec des paragraphes bien structurés et des listes à puces quand nécessaire (utilisez * ou - pour créer des listes). Laissez une ligne vide entre les paragraphes pour améliorer la lisibilité.`
        : `Generate a detailed and structured summary for the "${courseInfo.module}" module at ${courseInfo.level} level. Use clear sections with appropriate headings (## for main headings, ### for subheadings). Format the text with well-structured paragraphs and bullet points where necessary (use * or - to create lists). Leave an empty line between paragraphs to improve readability.`;

      await streamAIContent(
        apiKey,
        prompt,
        courseInfo.language,
        courseInfo.pdfContent,
        (chunk) => {
          setContent((prev) => prev + chunk);
        },
        abortControllerRef.current.signal
      );
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: courseInfo.language === "French" ? "Erreur" : "Error",
          description: String(error),
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="prose max-w-none animate-fade-up">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
        {courseInfo.language === "French" ? "Résumé" : "Summary"}
      </h2>

      {content && (
        <div className="mt-4 sm:mt-6">
          <ChatMessage
            content={content}
            sender="ai"
            isStreaming={isStreaming}
          />
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 max-w-xs sm:max-w-sm mx-auto">
        {isStreaming ? (
          <Button onClick={handleCancel} variant="outline" className="w-full text-xs sm:text-sm">
            {courseInfo.language === "French" ? "Arrêter" : "Stop"}
          </Button>
        ) : (
          <Button onClick={generateSummary} disabled={loading} className="w-full text-xs sm:text-sm">
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
        )}
      </div>
    </div>
  );
};

export default Summary;
