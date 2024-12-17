import React from "react";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface StudyGuideProps {
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const StudyGuide: React.FC<StudyGuideProps> = ({ courseInfo }) => {
  const [guide, setGuide] = React.useState<Array<{
    title: string;
    content: string;
  }>>([]);
  const [loading, setLoading] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const { toast } = useToast();

  const generateGuide = async () => {
    if (!apiKey) {
      toast({
        title: courseInfo.language === "French" 
          ? "Clé API requise" 
          : "API Key Required",
        description: courseInfo.language === "French"
          ? "Veuillez entrer votre clé API Perplexity"
          : "Please enter your Perplexity API key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const prompt = courseInfo.language === "French"
        ? `Crée un guide d'étude pour le module "${courseInfo.module}" de niveau ${courseInfo.level}. Format: JSON array avec "title" et "content" pour chaque section. Inclure: objectifs d'apprentissage, plan d'étude, ressources recommandées.`
        : `Create a study guide for the "${courseInfo.module}" module at ${courseInfo.level} level. Format: JSON array with "title" and "content" for each section. Include: learning objectives, study plan, recommended resources.`;

      const response = await generateAIContent(apiKey, prompt, courseInfo.language);
      const generatedGuide = JSON.parse(response);
      setGuide(generatedGuide);
    } catch (error) {
      toast({
        title: courseInfo.language === "French" 
          ? "Erreur" 
          : "Error",
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Perplexity API Key</label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
            placeholder="sk-..."
          />
        </div>

        <Button 
          onClick={generateGuide} 
          disabled={loading}
          className="w-full"
        >
          {loading 
            ? (courseInfo.language === "French" ? "Génération..." : "Generating...") 
            : (courseInfo.language === "French" ? "Générer" : "Generate")}
        </Button>
      </div>

      {guide.length > 0 && (
        <div className="space-y-6">
          {guide.map((section, index) => (
            <div key={index} className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <div className="prose max-w-none">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyGuide;