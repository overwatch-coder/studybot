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
import { supabase } from "@/integrations/supabase/client";
import { getAnonymousId } from "@/utils/anonymousId";

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<"setup" | "options" | "content">("setup");
  const [courseInfo, setCourseInfo] = React.useState<CourseInfo | null>(null);
  const [selectedOption, setSelectedOption] = React.useState<StudyOption | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  const startSession = async (info: CourseInfo) => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          anonymous_id: getAnonymousId(),
          module: info.module,
          level: info.level,
          language: info.language,
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const updateSession = async (option: StudyOption) => {
    if (!sessionId) return;

    try {
      const updates: Record<string, number> = {};
      
      if (option === 'quiz') {
        updates.questions_answered = 1;
      } else if (option === 'flashcards') {
        updates.flashcards_reviewed = 1;
      }

      await supabase
        .from('user_sessions')
        .update(updates)
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleSetupComplete = async (data: CourseInfo) => {
    setCourseInfo(data);
    setStep("options");
    await startSession(data);
  };

  const handleOptionSelect = async (option: StudyOption) => {
    setSelectedOption(option);
    setStep("content");
    await updateSession(option);
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
          {step === "content" && renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Setup;