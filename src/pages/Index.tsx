import React from "react";
import SetupForm from "@/components/SetupForm";
import StudyOptions, { StudyOption } from "@/components/StudyOptions";
import Chat from "@/components/Chat";

const Index = () => {
  const [step, setStep] = React.useState<"setup" | "options" | "chat">("setup");
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
    setStep("chat");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 animate-fade-up">
          AI Study Assistant
        </h1>
        <p className="text-center text-muted-foreground mb-8 animate-fade-up">
          Your personal AI tutor for enhanced learning
        </p>

        <div className="glass-card rounded-xl p-8">
          {step === "setup" && <SetupForm onComplete={handleSetupComplete} />}
          {step === "options" && <StudyOptions onSelect={handleOptionSelect} />}
          {step === "chat" && courseInfo && selectedOption && (
            <Chat studyOption={selectedOption} courseInfo={courseInfo} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;