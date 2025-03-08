
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Brain, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="bg-primary/50 hover:bg-primary/70 text-xs sm:text-sm"
          >
            Dashboard
          </Button>
        </div>
        
        {/* Hero Section */}
        <div className="text-center space-y-4 sm:space-y-6 animate-fade-up max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            StudyBot
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground">
            Your AI-powered study companion that transforms learning into an engaging and personalized experience
          </p>
          <Button 
            onClick={() => navigate('/setup')}
            className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 animate-scale-up hover:scale-105 transition-all duration-300"
          >
            Get Started
            <Sparkles className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20">
          <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">Personalized Learning</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tailored study materials based on your course level and preferences
            </p>
          </div>

          <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">Interactive Study Tools</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Generate summaries, flashcards, quizzes, and study guides instantly
            </p>
          </div>

          <div className="glass-card p-4 sm:p-6 space-y-3 sm:space-y-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">AI-Powered Assistance</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Get instant answers and explanations for your course material
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 sm:mt-16 md:mt-20 space-y-4 sm:space-y-6 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who are already using StudyBot to excel in their studies
          </p>
          <Button 
            onClick={() => navigate('/setup')}
            className="btn-primary text-base sm:text-lg"
          >
            Start Learning Now
            <Sparkles className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
