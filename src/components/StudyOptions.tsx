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
    },
    {
      id: "flashcards",
      icon: Library,
      title: "Flashcards",
      description: "Create study cards for quick revision",
    },
    {
      id: "quiz",
      icon: Brain,
      title: "Quiz",
      description: "Test your knowledge with interactive questions",
    },
    {
      id: "questions",
      icon: FileQuestion,
      title: "Practice Questions",
      description: "Generate sample questions with answers",
    },
    {
      id: "guide",
      icon: ListChecks,
      title: "Study Guide",
      description: "Create a comprehensive study plan",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Chat Assistant",
      description: "Have an interactive discussion about the topic",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up">
      {options.map((option, index) => (
        <motion.div
          key={option.id}
          className="study-option-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(option.id as StudyOption)}
        >
          <option.icon className="w-8 h-8 mb-3 text-primary" />
          <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
          <p className="text-sm text-muted-foreground">{option.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StudyOptions;