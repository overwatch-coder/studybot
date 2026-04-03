import React from "react";
import { StudyOption } from "@/components/StudyOptions";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Brain,
  FileQuestion,
  Library,
  ListChecks,
  MessageSquare,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

const TOOL_CONFIG: Record<
  StudyOption,
  { icon: React.ElementType; label: string; labelFr: string }
> = {
  summary: { icon: BookOpen, label: "Summary", labelFr: "Résumé" },
  flashcards: { icon: Library, label: "Flashcards", labelFr: "Cartes" },
  quiz: { icon: Brain, label: "Quiz", labelFr: "Quiz" },
  questions: { icon: FileQuestion, label: "Practice", labelFr: "Pratique" },
  guide: { icon: ListChecks, label: "Guide", labelFr: "Guide" },
  chat: { icon: MessageSquare, label: "Chat", labelFr: "Chat" },
};

const ALL_OPTIONS: StudyOption[] = [
  "summary",
  "flashcards",
  "quiz",
  "questions",
  "guide",
  "chat",
];

interface StudyToolSwitcherProps {
  currentOption: StudyOption;
  onSwitch: (option: StudyOption) => void;
  onBackToOptions: () => void;
  onStartOver: () => void;
  language?: string;
}

export const StudyToolSwitcher: React.FC<StudyToolSwitcherProps> = ({
  currentOption,
  onSwitch,
  onBackToOptions,
  onStartOver,
  language,
}) => {
  const isFrench = language === "French";
  const otherOptions = ALL_OPTIONS.filter((o) => o !== currentOption);

  return (
    <div className="mb-6 space-y-3">
      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToOptions}
          className="text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          {isFrench ? "Tous les outils" : "All Tools"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartOver}
          className="text-xs text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          {isFrench ? "Nouveau sujet" : "New Topic"}
        </Button>
      </div>

      {/* Quick-switch strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap mr-1">
          {isFrench ? "Passer à :" : "Switch to:"}
        </span>
        {otherOptions.map((option) => {
          const config = TOOL_CONFIG[option];
          const Icon = config.icon;
          return (
            <Button
              key={option}
              variant="outline"
              size="sm"
              onClick={() => onSwitch(option)}
              className="text-xs h-7 px-2.5 shrink-0"
            >
              <Icon className="h-3.5 w-3.5 mr-1" />
              {isFrench ? config.labelFr : config.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
