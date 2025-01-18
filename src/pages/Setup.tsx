import React from "react";
import SetupForm from "@/components/SetupForm";
import StudyOptions, { StudyOption } from "@/components/StudyOptions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseInfo } from "@/types/types";
import { SessionManager } from "@/components/setup/SessionManager";
import { SessionUpdater } from "@/components/setup/SessionUpdater";
import { ContentRenderer } from "@/components/setup/ContentRenderer";

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<"setup" | "options" | "content">("setup");
  const [courseInfo, setCourseInfo] = React.useState<CourseInfo | null>(null);
  const [selectedOption, setSelectedOption] = React.useState<StudyOption | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  const handleSetupComplete = async (data: CourseInfo) => {
    setCourseInfo(data);
    setStep("options");
  };

  const handleOptionSelect = async (option: StudyOption) => {
    setSelectedOption(option);
    setStep("content");
  };

  const handleGoBack = () => {
    if (step === "content") {
      setStep("options");
    } else if (step === "options") {
      setStep("setup");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-center text-transparent animate-fade-up">
            {courseInfo?.language === "French"
              ? "Assistant d'étude IA"
              : "AI Study Assistant"}
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="bg-primary/50 hover:bg-primary/70"
          >
            Dashboard
          </Button>
        </div>
        
        <div className="glass-card rounded-xl p-8 animate-fade-up">
          {step === "setup" && <SetupForm onComplete={handleSetupComplete} />}
          {step === "options" && <StudyOptions onSelect={handleOptionSelect} />}
          <SessionManager courseInfo={courseInfo} setSessionId={setSessionId} />
          <SessionUpdater sessionId={sessionId} selectedOption={selectedOption} />
          <ContentRenderer courseInfo={courseInfo} selectedOption={selectedOption} />
        </div>
      </div>
    </div>
  );
};

export default Setup;