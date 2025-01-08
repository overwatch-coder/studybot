import React from "react";
import { useToast } from "@/hooks/use-toast";
import { apiKey } from "@/lib/api-key";
import { generateAIContent } from "@/utils/aiContentGenerator";
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

        const allContent = await Promise.all(
          formData.pdfs.map(async (pdf) => {
            const content = await extractTextFromPDF(pdf);
            return content;
          })
        );

        const combinedContent = allContent.join("\n\n");
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