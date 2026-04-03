
import React from "react";
import SetupForm from "@/components/SetupForm";
import StudyOptions, { StudyOption } from "@/components/StudyOptions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap, BarChart3, RotateCcw, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseInfo } from "@/types/types";
import { SessionManager } from "@/components/setup/SessionManager";
import { SessionUpdater } from "@/components/setup/SessionUpdater";
import { ContentRenderer } from "@/components/setup/ContentRenderer";
import { useCurrentSession } from "@/hooks/use-current-session";
import {
  clearCurrentStudyOption,
  getCurrentStudyOption,
  setCurrentStudyOption,
} from "@/lib/storage/uiState";
import { StudyToolSwitcher } from "@/components/setup/StudyToolSwitcher";

type SetupStep = "setup" | "options" | "content";

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<SetupStep>("setup");
  const [previousStep, setPreviousStep] = React.useState<SetupStep | null>(null);
  const [selectedOption, setSelectedOption] = React.useState<StudyOption | null>(null);
  const { courseInfo, sessionId, setCourseInfo, setSessionId, clearSession } = useCurrentSession();
  const isChatView = step === "content" && selectedOption === "chat";

  React.useEffect(() => {
    const currentStudyOption = getCurrentStudyOption();

    if (!courseInfo || !sessionId) {
      return;
    }

    if (currentStudyOption) {
      setSelectedOption(currentStudyOption);
      setPreviousStep("options");
      setStep("content");
      return;
    }

    setPreviousStep("setup");
    setStep("options");
  }, [courseInfo, sessionId]);

  const handleSetupComplete = async (data: CourseInfo) => {
    setCourseInfo(data);
    setPreviousStep(step);
    setStep("options");
  };

  const handleOptionSelect = async (option: StudyOption) => {
    setSelectedOption(option);
    setCurrentStudyOption(option);
    setPreviousStep(step);
    setStep("content");
  };

  const handleGoBack = () => {
    if (step === "content" && previousStep) {
      setStep(previousStep);
      setSelectedOption(null);
      clearCurrentStudyOption();
    } else if (step === "options" && previousStep) {
      setStep(previousStep);
      clearSession();
      clearCurrentStudyOption();
    } else {
      navigate(-1);
    }
  };

  const handleGoToStep = (target: SetupStep) => {
    if (target === step) return;
    if (target === "setup") {
      clearSession();
      clearCurrentStudyOption();
      setSelectedOption(null);
      setStep("setup");
    } else if (target === "options" && courseInfo && sessionId) {
      setSelectedOption(null);
      clearCurrentStudyOption();
      setStep("options");
    }
  };

  const handleSwitchTool = (option: StudyOption) => {
    setSelectedOption(option);
    setCurrentStudyOption(option);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="border-b border-border/60 bg-white/60 backdrop-blur-sm sticky top-0 z-40">
        <div className={isChatView ? "max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14" : "max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14"}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
              {courseInfo?.language === "French"
                ? "Assistant d'étude IA"
                : "AI Study Assistant"}
            </span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <BarChart3 className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </div>
      </nav>

  <div className={isChatView ? "max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8" : "max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8"}>
        {/* Step indicator - clickable breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <button
            onClick={() => handleGoToStep("setup")}
            className={`hover:text-primary transition-colors ${step === "setup" ? "text-primary font-medium" : "hover:underline cursor-pointer"}`}
          >
            Setup
          </button>
          <span className="text-border">{"/"}</span>
          <button
            onClick={() => handleGoToStep("options")}
            disabled={!courseInfo || !sessionId}
            className={`transition-colors ${step === "options" ? "text-primary font-medium" : ""} ${courseInfo && sessionId ? "hover:text-primary hover:underline cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          >
            Choose tool
          </button>
          <span className="text-border">{"/"}</span>
          <span className={step === "content" ? "text-primary font-medium" : ""}>
            {selectedOption ? selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1) : "Study"}
          </span>
        </div>

        <div className={isChatView ? "glass-card animate-fade-up overflow-hidden border-border/50 bg-white/90 p-0" : "glass-card p-5 sm:p-7 md:p-8 animate-fade-up"}>
          {step === "setup" && <SetupForm onComplete={handleSetupComplete} />}
          {step === "options" && <StudyOptions onSelect={handleOptionSelect} />}
          {step === "content" && selectedOption && (
            <StudyToolSwitcher
              currentOption={selectedOption}
              onSwitch={handleSwitchTool}
              onBackToOptions={() => handleGoToStep("options")}
              onStartOver={() => handleGoToStep("setup")}
              language={courseInfo?.language}
            />
          )}
          <SessionManager courseInfo={courseInfo} sessionId={sessionId} setSessionId={setSessionId} />
          <SessionUpdater sessionId={sessionId} selectedOption={selectedOption} />
          <ContentRenderer courseInfo={courseInfo} selectedOption={selectedOption} />
        </div>
      </div>
    </div>
  );
};

export default Setup;
