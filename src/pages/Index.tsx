import React from "react";
import SetupForm from "@/components/SetupForm";
import StudyOptions, { StudyOption } from "@/components/StudyOptions";
import Chat from "@/components/Chat";
import Summary from "@/components/Summary";
import Flashcards from "@/components/Flashcards";
import Quiz from "@/components/Quiz";
import PracticeQuestions from "@/components/PracticeQuestions";
import StudyGuide from "@/components/StudyGuide";

const Index = () => {
  const [step, setStep] = React.useState<"setup" | "options" | "content">("setup");
  const [courseInfo, setCourseInfo] = React.useState<{
    module: string;
    language: string;
    level: string;
    pdf?: File;
  } | null>(null);
  const [selectedOption, setSelectedOption] = React.useState<StudyOption | null>(
    null
  );

  const handleSetupComplete = (data: {
    module: string;
    language: string;
    level: string;
    pdf?: File;
  }) => {
    setCourseInfo(data);
    setStep("options");
  };

  const handleOptionSelect = (option: StudyOption) => {
    setSelectedOption(option);
    setStep("content");
  };

  const renderContent = () => {
    if (!courseInfo || !selectedOption) return null;

    switch (selectedOption) {
      case "summary":
        return <Summary courseInfo={courseInfo} />;
      case "flashcards":
        return <Flashcards courseInfo={courseInfo} />;
      case "quiz":
        return <Quiz courseInfo={courseInfo} />;
      case "questions":
        return <PracticeQuestions courseInfo={courseInfo} />;
      case "guide":
        return <StudyGuide courseInfo={courseInfo} />;
      case "chat":
        return <Chat studyOption={selectedOption} courseInfo={courseInfo} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 animate-fade-up">
          {courseInfo?.language === "French" ? "Assistant d'étude IA" : "AI Study Assistant"}
        </h1>
        <p className="text-center text-muted-foreground mb-8 animate-fade-up">
          {courseInfo?.language === "French" 
            ? "Votre tuteur IA personnel pour un apprentissage amélioré"
            : "Your personal AI tutor for enhanced learning"}
        </p>

        <div className="glass-card rounded-xl p-8">
          {step === "setup" && <SetupForm onComplete={handleSetupComplete} />}
          {step === "options" && <StudyOptions onSelect={handleOptionSelect} />}
          {step === "content" && renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;