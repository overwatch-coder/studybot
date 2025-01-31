import React from "react";
import { useToast } from "@/hooks/use-toast";
import { apiKey } from "@/lib/api-key";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { extractTextFromPDF, generatePromptFromPDF } from "@/utils/pdfExtractor";
import CourseDetails from "./setup-form/CourseDetails";
import FileUpload from "./setup-form/FileUpload";
import SubmitButton from "./setup-form/SubmitButton";

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

  const processPDFs = async (files: File[]) => {
    try {
      // Process PDFs in parallel with a limit of 3 concurrent operations
      const batchSize = 3;
      const results: string[] = [];
      
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (pdf) => {
            const content = await extractTextFromPDF(pdf);
            return content;
          })
        );
        results.push(...batchResults);
      }

      return results.join('\n\n');
    } catch (error) {
      console.error('Error processing PDFs:', error);
      throw error;
    }
  };

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

        // Show processing toast
        toast({
          title: formData.language === "French" 
            ? "Traitement des PDFs" 
            : "Processing PDFs",
          description: formData.language === "French"
            ? "Veuillez patienter pendant que nous traitons vos fichiers..."
            : "Please wait while we process your files...",
        });

        const combinedContent = await processPDFs(formData.pdfs);
        const prompt = generatePromptFromPDF(
          combinedContent,
          formData.module,
          formData.level,
          formData.language
        );

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
      <CourseDetails
        module={formData.module}
        language={formData.language}
        level={formData.level}
        onModuleChange={(value) =>
          setFormData((prev) => ({ ...prev, module: value }))
        }
        onLanguageChange={(value) =>
          setFormData((prev) => ({ ...prev, language: value }))
        }
        onLevelChange={(value) =>
          setFormData((prev) => ({ ...prev, level: value }))
        }
      />

      <FileUpload
        pdfs={formData.pdfs}
        language={formData.language}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
      />

      <SubmitButton loading={loading} language={formData.language} />
    </form>
  );
};

export default SetupForm;