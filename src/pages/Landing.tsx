import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Brain, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            StudyBot
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered study companion that transforms learning into an engaging and personalized experience
          </p>
          <Button 
            onClick={() => navigate('/setup')}
            className="btn-primary text-lg px-8 py-6 animate-scale-up hover:scale-105 transition-all duration-300"
          >
            Get Started
            <Sparkles className="ml-2" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="glass-card p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Personalized Learning</h3>
            <p className="text-muted-foreground">
              Tailored study materials based on your course level and preferences
            </p>
          </div>

          <div className="glass-card p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Interactive Study Tools</h3>
            <p className="text-muted-foreground">
              Generate summaries, flashcards, quizzes, and study guides instantly
            </p>
          </div>

          <div className="glass-card p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">AI-Powered Assistance</h3>
            <p className="text-muted-foreground">
              Get instant answers and explanations for your course material
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 space-y-6 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Study Experience?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who are already using StudyBot to excel in their studies
          </p>
          <Button 
            onClick={() => navigate('/setup')}
            className="btn-primary text-lg"
          >
            Start Learning Now
            <Sparkles className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;