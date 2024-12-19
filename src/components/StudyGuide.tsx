import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiKey } from "@/lib/api-key";
import { CourseInfo } from "@/types/types";

interface StudyGuideProps {
  courseInfo: CourseInfo;
}

const StudyGuide: React.FC<StudyGuideProps> = ({ courseInfo }) => {
  const [guide, setGuide] = React.useState<
    Array<{
      title: string;
      content: string;
    }>
  >([]);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const generateGuide = async () => {
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
          ? `Crée un guide d'étude pour le module "${courseInfo.module}" de niveau ${courseInfo.level}. Format: JSON array avec "title" et "content" pour chaque section. Inclure: objectifs d'apprentissage, plan d'étude, ressources recommandées. Commence directement par la réponse formatée. Aucun texte ou phrase avant ou après.`
          : `Create a study guide for the "${courseInfo.module}" module at ${courseInfo.level} level. Format: JSON array with "title" and "content" for each section. Include: learning objectives, study plan, recommended resources. Start directly with the formatted response. No texts or sentences before or after.`;

      const response = await generateAIContent(
        apiKey,
        prompt,
        courseInfo.language,
        courseInfo.pdfContent
      );
      const generatedGuide = JSON.parse(response);
      setGuide(generatedGuide);
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
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl font-bold">
        {courseInfo.language === "French" ? "Guide d'étude" : "Study Guide"}
      </h2>

      <div className="glass-card p-6 space-y-4">
        <Button onClick={generateGuide} disabled={loading} className="w-full">
          {loading
            ? courseInfo.language === "French"
              ? "Génération..."
              : "Generating..."
            : courseInfo.language === "French"
            ? "Générer"
            : "Generate"}
        </Button>
      </div>

      {guide.length > 0 && (
        <div className="space-y-6">
          {guide.map((section, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>

              {/* Check if content is an array of objects or strings */}
              {Array.isArray(section.content) ? (
                <div className="prose max-w-none">
                  {typeof section.content[0] === "string" ? (
                    // If content is an array of strings, render them directly
                    <ul className="list-disc pl-6">
                      {section.content.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    // If content is an array of objects, map through and render it in the desired format
                    section.content.map((obj, idx) => (
                      <div key={idx}>
                        {/* Custom rendering for the object structure based on its content */}
                        {Object.keys(obj).map((key) => (
                          <p key={key}>
                            <strong>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </strong>{" "}
                            {Array.isArray(obj[key])
                              ? obj[key].join(", ")
                              : obj[key]}
                          </p>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyGuide;
