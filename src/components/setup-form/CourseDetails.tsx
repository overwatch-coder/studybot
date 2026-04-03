import React from "react";
import { Input } from "../ui/input";

interface CourseDetailsProps {
  module: string;
  language: string;
  level: string;
  topic: string;
  description: string;
  onModuleChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  module,
  language,
  level,
  topic,
  description,
  onModuleChange,
  onLanguageChange,
  onLevelChange,
  onTopicChange,
  onDescriptionChange,
}) => {
  return (
    <>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {language === "French" ? "Nom du module/cours" : "Module/Course Name"}
        </label>
        <Input
          required
          className="input-field"
          placeholder={
            language === "French"
              ? "ex: Introduction à l'informatique"
              : "e.g., Introduction to Computer Science"
          }
          value={module}
          onChange={(e) => onModuleChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {language === "French" ? "Langue du cours" : "Course Language"}
        </label>
        <select
          className="input-field"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="English">English</option>
          <option value="French">French</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {language === "French" ? "Niveau d'études" : "Education Level"}
        </label>
        <select
          className="input-field"
          required
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          <option value="">
            {language === "French" ? "Sélectionner le niveau" : "Select Level"}
          </option>
          <option value="undergraduate-1">
            {language === "French"
              ? "Licence - Première année"
              : "Undergraduate - First Year"}
          </option>
          <option value="undergraduate-2">
            {language === "French"
              ? "Licence - Deuxième année"
              : "Undergraduate - Second Year"}
          </option>
          <option value="undergraduate-3">
            {language === "French"
              ? "Licence - Troisième année"
              : "Undergraduate - Third Year"}
          </option>
          <option value="masters">
            {language === "French" ? "Master" : "Masters"}
          </option>
          <option value="phd">
            {language === "French" ? "Doctorat" : "PhD"}
          </option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {language === "French" ? "Sujet / Section du cours" : "Topic / Course Section"}
          <span className="ml-1 text-xs text-muted-foreground">
            {language === "French" ? "(optionnel)" : "(optional)"}
          </span>
        </label>
        <Input
          className="input-field"
          placeholder={
            language === "French"
              ? "ex: Chapitre 3 – Les structures de données"
              : "e.g., Chapter 3 – Data Structures"
          }
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          {language === "French" ? "Description / Ce que vous voulez analyser" : "Description / What you want to focus on"}
          <span className="ml-1 text-xs text-muted-foreground">
            {language === "French" ? "(optionnel)" : "(optional)"}
          </span>
        </label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          placeholder={
            language === "French"
              ? "ex: Je veux comprendre les algorithmes de tri et leurs complexités..."
              : "e.g., I want to understand sorting algorithms and their time complexities..."
          }
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default CourseDetails;

