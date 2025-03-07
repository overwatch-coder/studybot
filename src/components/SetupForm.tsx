
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
    if (!files.length) return '';
    
    const results: string[] = [];
    let failedFiles = 0;
    
    // Create an array of promises for parallel processing
    const processingPromises = files.map(async (file, index) => {
      try {
        const progressMessage = formData.language === "French" 
          ? `Traitement du PDF ${index + 1}/${files.length}` 
          : `Processing PDF ${index + 1}/${files.length}`;
        
        toast({
          title: progressMessage,
          description: file.name,
        });

        // Process PDF and return the extracted text
        return await extractTextFromPDF(file);
      } catch (error) {
        // Log errors but continue processing other PDFs
        console.error(`Error processing ${file.name}:`, error);
        failedFiles++;
        
        toast({
          title: formData.language === "French" 
            ? "Erreur de traitement du PDF" 
            : "PDF Processing Error",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
        
        return ''; // Return empty string for failed files
      }
    });
    
    // Wait for all PDFs to be processed
    const extractedTexts = await Promise.all(processingPromises);
    
    // Combine successful extractions
    const validTexts = extractedTexts.filter(text => text.trim() !== '');
    
    if (validTexts.length === 0) {
      throw new Error(
        formData.language === "French"
          ? "Aucun contenu n'a pu être extrait des PDFs"
          : "No content could be extracted from any of the PDFs"
      );
    }
    
    // Report partial success
    if (failedFiles > 0 && failedFiles < files.length) {
      toast({
        title: formData.language === "French" 
          ? "Traitement partiel" 
          : "Partial Processing",
        description: formData.language === "French"
          ? `${failedFiles} fichier(s) n'ont pas pu être traités, mais nous continuons avec le contenu disponible.`
          : `${failedFiles} file(s) could not be processed, but we'll continue with the available content.`,
      });
    }
    
    return validTexts.join('\n\n').trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.pdfs.length > 0) {
        if (!apiKey) {
          toast({
            title: formData.language === "French" 
              ? "Clé API requise" 
              : "API Key Required",
            description: formData.language === "French"
              ? "Veuillez entrer votre clé API OpenAI"
              : "Please enter your OpenAI API key",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: formData.language === "French" 
            ? "Traitement des PDFs" 
            : "Processing PDFs",
          description: formData.language === "French"
            ? "Veuillez patienter pendant que nous traitons vos fichiers..."
            : "Please wait while we process your files...",
        });

        const combinedContent = await processPDFs(formData.pdfs);
        
        if (!combinedContent) {
          throw new Error(
            formData.language === "French"
              ? "Aucun contenu n'a pu être extrait des PDFs"
              : "No content could be extracted from the PDFs"
          );
        }

        try {
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
        } catch (error) {
          console.error('Error generating AI content:', error);
          throw new Error(
            formData.language === "French"
              ? "Erreur lors de la génération du contenu AI"
              : "Error generating AI content"
          );
        }
      } else {
        onComplete(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: formData.language === "French" ? "Erreur" : "Error",
        description: error instanceof Error ? error.message : String(error),
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
