import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiKey } from "@/lib/api-key";
import { generateAIContent } from "@/utils/aiContentGenerator";

interface SetupFormProps {
  onComplete: (data: {
    module: string;
    language: string;
    level: string;
    pdfs?: File[];
    pdfContent?: string;
  }) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = React.useState({
    module: "",
    language: "English",
    level: "",
    pdfs: [] as File[],
    pdfContent: undefined as string | undefined,
  });
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.pdfs.length > 0) {
        if (!apiKey) {
          toast({
            title:
              formData.language === "French"
                ? "Clé API requise"
                : "API Key Required",
            description:
              formData.language === "French"
                ? "Veuillez entrer votre clé API OpenAI"
                : "Please enter your OpenAI API key",
            variant: "destructive",
          });
          return;
        }

        // Process all PDFs and combine their content
        const allContent = await Promise.all(
          formData.pdfs.map(async (pdf) => {
            const content = await extractTextFromPDF(pdf);
            return content;
          })
        );

        const combinedContent = allContent.join("\n\n");

        // Process the combined content with OpenAI
        const prompt = `Analyze and combine the following PDF contents into a coherent knowledge base:\n\n${combinedContent}`;
        
        const processedContent = await generateAIContent(
          apiKey,
          prompt,
          formData.language
        );

        onComplete({ ...formData, pdfContent: processedContent });
      } else {
        onComplete(formData);
      }
    } catch (error) {
      toast({
        title: formData.language === "French" ? "Erreur" : "Error",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, pdfs: [...prev.pdfs, ...filesArray] }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pdfs: prev.pdfs.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
      <div className="space-y-2">
        <label className="text-sm font-medium">Module/Course Name</label>
        <Input
          required
          className="input-field"
          placeholder="e.g., Introduction to Computer Science"
          value={formData.module}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, module: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Course Language</label>
        <select
          className="input-field"
          value={formData.language}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, language: e.target.value }))
          }
        >
          <option value="English">English</option>
          <option value="French">French</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Education Level</label>
        <select
          className="input-field"
          required
          value={formData.level}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, level: e.target.value }))
          }
        >
          <option value="">Select Level</option>
          <option value="undergraduate-1">Undergraduate - First Year</option>
          <option value="undergraduate-2">Undergraduate - Second Year</option>
          <option value="undergraduate-3">Undergraduate - Third Year</option>
          <option value="masters">Masters</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Course Materials (PDFs)</label>
        <Input
          type="file"
          accept=".pdf"
          multiple
          className="input-field"
          onChange={handleFileChange}
        />
        {formData.pdfs.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.pdfs.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-accent/10 rounded-lg"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading
          ? formData.language === "French"
            ? "Traitement..."
            : "Processing..."
          : formData.language === "French"
          ? "Continuer"
          : "Continue"}
      </Button>
    </form>
  );
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export default SetupForm;