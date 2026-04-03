import React from "react";
import { useToast } from "@/hooks/use-toast";
import { getApiKey } from "@/lib/api-key";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { extractTextFromPDF, generatePromptFromPDF } from "@/utils/pdfExtractor";
import CourseDetails from "./setup-form/CourseDetails";
import FileUpload from "./setup-form/FileUpload";
import SubmitButton from "./setup-form/SubmitButton";
import ProcessingModal, { ProcessingStage, StageStatus } from "./ProcessingModal";

interface SetupFormProps {
  onComplete: (data: {
    module: string;
    language: string;
    level: string;
    topic?: string;
    description?: string;
    pdfs?: File[];
    pdfContent?: string;
  }) => void;
}

interface ProcessingState {
  open: boolean;
  stages: ProcessingStage[];
  isComplete: boolean;
  error: string | null;
  pendingComplete: {
    module: string;
    language: string;
    level: string;
    topic?: string;
    description?: string;
    pdfs: File[];
    pdfContent: string;
  } | null;
}

const INITIAL_PROCESSING: ProcessingState = {
  open: false,
  stages: [],
  isComplete: false,
  error: null,
  pendingComplete: null,
};

function makeStages(fileCount: number): ProcessingStage[] {
  return [
    {
      id: "extract",
      label:
        fileCount > 1
          ? `Extracting content from ${fileCount} files`
          : "Extracting file content",
      status: "pending" as StageStatus,
    },
    { id: "prepare", label: "Preparing study prompt", status: "pending" as StageStatus },
    { id: "generate", label: "Generating AI materials", status: "pending" as StageStatus },
  ];
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = React.useState({
    module: "",
    language: "English",
    level: "",
    topic: "",
    description: "",
    pdfs: [] as File[],
    pdfContent: undefined as string | undefined,
  });
  const [ps, setPs] = React.useState<ProcessingState>(INITIAL_PROCESSING);
  const { toast } = useToast();

  const updateStage = (
    id: string,
    patch: Partial<Pick<ProcessingStage, "status" | "subLabel">>
  ) => {
    setPs((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const processPDFs = async (files: File[]): Promise<string> => {
    updateStage("extract", {
      status: "active",
      subLabel: `Extracting file 1 of ${files.length}`,
    });

    const results: string[] = [];
    for (let i = 0; i < files.length; i++) {
      updateStage("extract", {
        subLabel: `Extracting file ${i + 1} of ${files.length}`,
      });
      try {
        results.push(await extractTextFromPDF(files[i]));
      } catch {
        results.push("");
      }
    }

    const valid = results.filter((t) => t.trim() !== "");
    if (valid.length === 0) {
      throw new Error("No content could be extracted from any of the files.");
    }

    updateStage("extract", {
      status: "complete",
      subLabel: `${valid.length} of ${files.length} file(s) extracted`,
    });
    return valid.join("\n\n").trim();
  };

  const runProcessing = async (files: File[], apiKey: string) => {
    try {
      const combined = await processPDFs(files);

      updateStage("prepare", { status: "active" });
      const prompt = generatePromptFromPDF(
        combined,
        formData.module,
        formData.level,
        formData.language,
        formData.topic || undefined,
        formData.description || undefined
      );
      updateStage("prepare", { status: "complete" });

      updateStage("generate", { status: "active" });
      const pdfContent = await generateAIContent(apiKey, prompt, formData.language);
      updateStage("generate", { status: "complete" });

      setPs((prev) => ({
        ...prev,
        isComplete: true,
        pendingComplete: { ...formData, pdfContent },
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setPs((prev) => ({
        ...prev,
        error: message,
        stages: prev.stages.map((s) =>
          s.status === "active" ? { ...s, status: "error" } : s
        ),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ps.open) return;

    if (formData.pdfs.length === 0) {
      onComplete(formData);
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      toast({
        title: formData.language === "French" ? "Clé API requise" : "API Key Required",
        description:
          formData.language === "French"
            ? "Veuillez configurer votre clé API dans les paramètres"
            : "Please add your API key using the key button in the top-right corner",
        variant: "destructive",
      });
      return;
    }

    setPs({ ...INITIAL_PROCESSING, open: true, stages: makeStages(formData.pdfs.length) });
    runProcessing(formData.pdfs, apiKey);
  };

  const handleContinue = () => {
    if (ps.pendingComplete) {
      onComplete(ps.pendingComplete);
    }
    setPs(INITIAL_PROCESSING);
  };

  const handleRetry = () => {
    const apiKey = getApiKey();
    if (!apiKey) return;
    setPs((prev) => ({
      ...prev,
      stages: makeStages(formData.pdfs.length),
      error: null,
      isComplete: false,
      pendingComplete: null,
    }));
    runProcessing(formData.pdfs, apiKey);
  };

  const handleRestart = () => {
    setPs(INITIAL_PROCESSING);
    setFormData((prev) => ({ ...prev, pdfs: [] }));
  };

  const handleClose = () => {
    setPs((prev) => ({ ...prev, open: false }));
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
    <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
        <CourseDetails
          module={formData.module}
          language={formData.language}
          level={formData.level}
          topic={formData.topic}
          description={formData.description}
          onModuleChange={(value) =>
            setFormData((prev) => ({ ...prev, module: value }))
          }
          onLanguageChange={(value) =>
            setFormData((prev) => ({ ...prev, language: value }))
          }
          onLevelChange={(value) =>
            setFormData((prev) => ({ ...prev, level: value }))
          }
          onTopicChange={(value) =>
            setFormData((prev) => ({ ...prev, topic: value }))
          }
          onDescriptionChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
        />
        <FileUpload
          pdfs={formData.pdfs}
          language={formData.language}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
        />
        <SubmitButton
          loading={ps.open && !ps.isComplete && !ps.error}
          language={formData.language}
        />
      </form>

      <ProcessingModal
        open={ps.open}
        stages={ps.stages}
        isComplete={ps.isComplete}
        error={ps.error}
        onContinue={handleContinue}
        onRetry={handleRetry}
        onRestart={handleRestart}
        onClose={handleClose}
      />
    </>
  );
};

export default SetupForm;
