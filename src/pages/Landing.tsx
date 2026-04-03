
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Brain, Sparkles, BarChart3, ArrowRight, Zap, Target } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/60 bg-white/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="container-responsive flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">StudyBot</span>
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium"
          >
            <BarChart3 className="h-4 w-4 mr-1.5" />
            Dashboard
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-responsive pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20">
        <div className="text-center space-y-6 animate-fade-up max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Study Platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-[1.1]">
            Master any subject with{" "}
            <span className="text-primary">intelligent</span> study tools
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your learning with AI-generated summaries, flashcards, quizzes, and personalized study guides tailored to your academic level.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => navigate('/setup')}
              size="lg"
              className="btn-primary text-base px-8 py-6 animate-scale-up"
            >
              Start studying
              <ArrowRight className="ml-2 h-4.5 w-4.5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="text-base px-8 py-6"
            >
              View progress
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container-responsive pb-20 sm:pb-28">
        <div className="text-center mb-12">
          <h2 className="section-title">Everything you need to excel</h2>
          <p className="section-subtitle mt-3 max-w-xl mx-auto">
            Six powerful tools designed for the way students actually study
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[
            {
              icon: BookOpen,
              title: "Smart Summaries",
              description: "Get concise, structured overviews of any topic with key takeaways highlighted.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Target,
              title: "Adaptive Flashcards",
              description: "Create study cards optimized for active recall and spaced repetition.",
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              icon: Brain,
              title: "Interactive Quizzes",
              description: "Test your knowledge with auto-generated questions and immediate feedback.",
              color: "bg-violet-50 text-violet-600",
            },
            {
              icon: Sparkles,
              title: "Practice Questions",
              description: "Generate sample exam questions with detailed explanations and answers.",
              color: "bg-amber-50 text-amber-600",
            },
            {
              icon: GraduationCap,
              title: "Study Guides",
              description: "Comprehensive learning plans with objectives, timelines, and resources.",
              color: "bg-rose-50 text-rose-600",
            },
            {
              icon: BarChart3,
              title: "AI Chat Assistant",
              description: "Ask questions and get detailed explanations in a conversational format.",
              color: "bg-cyan-50 text-cyan-600",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 space-y-4 animate-fade-up hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className={`h-11 w-11 rounded-lg ${feature.color} flex items-center justify-center`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/60 bg-white">
        <div className="container-responsive py-16 sm:py-20 text-center">
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
            <h2 className="section-title">
              Ready to study smarter?
            </h2>
            <p className="section-subtitle">
              Upload your course materials or just tell us what you're studying. Our AI handles the rest.
            </p>
            <Button
              onClick={() => navigate('/setup')}
              size="lg"
              className="btn-primary text-base px-8 py-6"
            >
              Get started for free
              <ArrowRight className="ml-2 h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
