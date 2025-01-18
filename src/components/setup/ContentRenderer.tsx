import React from 'react';
import { StudyOption } from "@/components/StudyOptions";
import { CourseInfo } from "@/types/types";
import Summary from "@/components/Summary";
import Flashcards from "@/components/Flashcards";
import Quiz from "@/components/Quiz";
import PracticeQuestions from "@/components/PracticeQuestions";
import StudyGuide from "@/components/StudyGuide";
import Chat from "@/components/Chat";

interface ContentRendererProps {
  courseInfo: CourseInfo | null;
  selectedOption: StudyOption | null;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ courseInfo, selectedOption }) => {
  if (!courseInfo || !selectedOption) return null;

  const props = {
    courseInfo: {
      ...courseInfo,
      pdfContent: courseInfo.pdfContent,
    },
  };

  switch (selectedOption) {
    case "summary":
      return <Summary {...props} />;
    case "flashcards":
      return <Flashcards {...props} />;
    case "quiz":
      return <Quiz {...props} />;
    case "questions":
      return <PracticeQuestions {...props} />;
    case "guide":
      return <StudyGuide {...props} />;
    case "chat":
      return <Chat studyOption={selectedOption} {...props} />;
    default:
      return null;
  }
};