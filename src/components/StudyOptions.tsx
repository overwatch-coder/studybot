
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, FileQuestion, Library, ListChecks, MessageSquare } from "lucide-react";

export type StudyOption =
  | "summary"
  | "flashcards"
  | "quiz"
  | "questions"
  | "guide"
  | "chat";

interface StudyOptionsProps {
  onSelect: (option: StudyOption) => void;
}

const StudyOptions: React.FC<StudyOptionsProps> = ({ onSelect }) => {
  const options = [
    {
      id: "summary",
      icon: BookOpen,
      title: "Summary",
      description: "Get a concise overview of the topic",
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "flashcards",
      icon: Library,
      title: "Flashcards",
      description: "Create study cards for quick revision",
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "quiz",
      icon: Brain,
      title: "Quiz",
      description: "Test your knowledge with interactive questions",
      color: "text-violet-600 bg-violet-50",
    },
    {
      id: "questions",
      icon: FileQuestion,
      title: "Practice Questions",
      description: "Generate sample questions with answers",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "guide",
      icon: ListChecks,
      title: "Study Guide",
      description: "Create a comprehensive study plan",
      color: "text-rose-600 bg-rose-50",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Chat Assistant",
      description: "Have an interactive discussion about the topic",
      color: "text-cyan-600 bg-cyan-50",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-foreground">Choose a study tool</h2>
        <p className="text-sm text-muted-foreground">Select how you'd like to study this material</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            className="study-option-card group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => onSelect(option.id as StudyOption)}
          >
            <div className={`h-10 w-10 rounded-lg ${option.color} flex items-center justify-center mb-3`}>
              <option.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{option.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{option.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudyOptions;
