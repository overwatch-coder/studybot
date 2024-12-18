import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { extractTextFromPDF } from "@/utils/pdfProcessor";
import { useToast } from "@/hooks/use-toast";

interface SetupFormProps {
  onComplete: (data: {
    module: string;
    language: string;
    level: string;
    pdf?: File;
    pdfContent?: string;
  }) => void;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = React.useState({
    module: "",
    language: "English",
    level: "",
    pdf: undefined as File | undefined,
    pdfContent: undefined as string | undefined,
  });
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.pdf) {
        const pdfContent = await extractTextFromPDF(formData.pdf);
        onComplete({ ...formData, pdfContent });
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
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, pdf: e.target.files![0] }));
    }
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
        <label className="text-sm font-medium">Course Materials (PDF)</label>
        <Input
          type="file"
          accept=".pdf"
          className="input-field"
          onChange={handleFileChange}
        />
      </div>

      <Button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? (
          formData.language === "French" ? (
            "Traitement..."
          ) : (
            "Processing..."
          )
        ) : formData.language === "French" ? (
          "Continuer"
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
};

export default SetupForm;