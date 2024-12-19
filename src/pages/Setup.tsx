import React from "react";
import SetupForm from "@/components/SetupForm";
import StudyOptions, { StudyOption } from "@/components/StudyOptions";
import Chat from "@/components/Chat";
import Summary from "@/components/Summary";
import Flashcards from "@/components/Flashcards";
import Quiz from "@/components/Quiz";
import PracticeQuestions from "@/components/PracticeQuestions";
import StudyGuide from "@/components/StudyGuide";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseInfo } from "@/types/types";

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<"setup" | "options" | "content">(
    "setup"
  );
  const [courseInfo, setCourseInfo] = React.useState<CourseInfo | null>(null);
  const [selectedOption, setSelectedOption] =
    React.useState<StudyOption | null>(null);

  const handleSetupComplete = (data: CourseInfo) => {
    setCourseInfo(data);
    setStep("options");
  };

  const handleOptionSelect = (option: StudyOption) => {
    setSelectedOption(option);
    setStep("content");
  };

  const renderContent = () => {
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

  const handleGoToOptions = () => {
    if (!courseInfo) {
      toast.info(
        courseInfo?.language === "French"
          ? "Veuillez d'abord remplir les informations du cours"
          : "You must first fill in the course info"
      );
      return;
    }

    setStep("options");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-accent/10 absolute top-0 left-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-center text-transparent animate-fade-up mx-auto">
            {courseInfo?.language === "French"
              ? "Assistant d'étude IA"
              : "AI Study Assistant"}
          </h1>
        </div>
        <p className="text-center mx-auto text-muted-foreground mb-8 animate-fade-up">
          {courseInfo?.language === "French"
            ? "Votre tuteur IA personnel pour un apprentissage amélioré"
            : "Your personal AI tutor for enhanced learning"}
        </p>

        <div className="flex items-center justify-end w-full py-2 gap-3">
          {step !== "options" && step !== "setup" && (
            <p className="text-muted-foreground">Go To:</p>
          )}
          {step !== "setup" && (
            <Button
              variant="outline"
              onClick={() => setStep("setup")}
              className="bg-primary/50 hover:bg-primary/70"
            >
              Start Over
            </Button>
          )}

          {step !== "options" && step !== "setup" && (
            <Button
              variant="outline"
              onClick={handleGoToOptions}
              className="bg-primary/50 hover:bg-primary/70"
            >
              Options
            </Button>
          )}
        </div>

        <div className="glass-card rounded-xl p-8 animate-fade-up">
          {step === "setup" && <SetupForm onComplete={handleSetupComplete} />}
          {step === "options" && <StudyOptions onSelect={handleOptionSelect} />}
          {step === "content" && renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Setup;
