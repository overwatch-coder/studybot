import React from "react";
import { Input } from "../ui/input";

interface CourseDetailsProps {
  module: string;
  language: string;
  level: string;
  onModuleChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  module,
  language,
  level,
  onModuleChange,
  onLanguageChange,
  onLevelChange,
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
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

      <div className="space-y-2">
        <label className="text-sm font-medium">
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
    </>
  );
};

export default CourseDetails;