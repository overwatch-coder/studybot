import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CourseInfo } from "@/types/types";

interface QuizGeneratorProps {
  courseInfo: CourseInfo;
  quantity: number;
  loading: boolean;
  setQuantity: (quantity: number) => void;
  onGenerate: () => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  courseInfo,
  quantity,
  loading,
  setQuantity,
  onGenerate,
}) => {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {courseInfo.language === "French"
            ? "Nombre de questions"
            : "Number of questions"}
        </label>
        <Input
          type="number"
          min="1"
          max="20"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <Button onClick={onGenerate} disabled={loading} className="w-full">
        {loading
          ? courseInfo.language === "French"
            ? "Génération..."
            : "Generating..."
          : courseInfo.language === "French"
          ? "Générer"
          : "Generate"}
      </Button>
    </div>
  );
};

export default QuizGenerator;