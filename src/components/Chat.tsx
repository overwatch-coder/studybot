
import React from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { generateAIContent } from "@/utils/aiContentGenerator";
import { apiKey } from "@/lib/api-key";
import { useToast } from "@/hooks/use-toast";
import { CourseInfo } from "@/types/types";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "system";
  isStreaming?: boolean;
}

interface ChatProps {
  studyOption: string;
  courseInfo: CourseInfo;
}

const Chat: React.FC<ChatProps> = ({ studyOption, courseInfo }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      content: `Welcome! I'm your AI study assistant for ${courseInfo.module}. I'm here to help you with your ${studyOption} needs. What would you like to know about this topic?`,
      sender: "system" as const,
    };
    setMessages([welcomeMessage]);
  }, [courseInfo.module, studyOption]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast({
        title:
          courseInfo.language === "French"
            ? "Clé API requise"
            : "API Key Required",
        description:
          courseInfo.language === "French"
            ? "Veuillez entrer votre clé API Perplexity"
            : "Please enter your Perplexity API key",
        variant: "destructive",
      });
      return;
    }

    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Create a new AI message placeholder with streaming state
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      sender: "ai" as const,
      isStreaming: true
    };
    
    setMessages(prev => [...prev, aiMessage]);

    try {
      // Create abort controller for the fetch request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const prompt =
        courseInfo.language === "French"
          ? `Génère une réponse à la question suivante : "${input}" pour le module "${courseInfo.module}" au niveau ${courseInfo.level}. Formattez bien les reponses. Formatez-le de manière à ce qu'il puisse être utilisé directement dans du code HTML et reste visuellement attrayant même sans styles supplémentaires. Utilisez des balises HTML de base comme <h2>, <p>, et <ul>, et appliquez les styles nécessaires pour maintenir la lisibilité et une structure propre.`
          : `Generate a response to the following question: "${input}" for the "${courseInfo.module}" module at ${courseInfo.level} level. The response should well formatted. Format it so that it can be used directly in HTML code and remains visually appealing even without additional styling. Use basic HTML tags like <h2>, <p>, and <ul>, and ensure that necessary inline styling is applied to maintain readability and a clean structure.`;

      await streamAIContent(
        apiKey,
        prompt,
        courseInfo.language,
        courseInfo.pdfContent,
        (chunkText) => {
          // Update the AI message with new content as it streams in
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: msg.content + chunkText } 
                : msg
            )
          );
        },
        signal
      );

      // Mark streaming as complete
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error("AI response error:", error);
        // Update the message to show the error
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  content: "There was an error while generating the AI response. Please try again later.",
                  isStreaming: false
                } 
              : msg
          )
        );
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Function to handle cancellation of ongoing requests
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      
      // Update the latest AI message to indicate cancellation
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.sender === 'ai' && lastMessage.isStreaming) {
          return prev.map(msg => 
            msg.id === lastMessage.id 
              ? { ...msg, content: msg.content + " (Message generation stopped by user)", isStreaming: false } 
              : msg
          );
        }
        return prev;
      });
    }
  };

  // Check if we're currently streaming a response
  const isStreaming = React.useMemo(() => {
    return messages.some(msg => msg.isStreaming);
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-xl p-4 animate-fade-up">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.sender === "user"
                ? "user-message"
                : message.sender === "system"
                ? "system-message glass-card bg-accent text-white"
                : "ai-message"
            } ${message.isStreaming ? "streaming-message border-l-4 border-primary" : ""}`}
          >
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: message.content?.replace("html", "") || (message.isStreaming ? '<p class="animate-pulse">Generating response...</p>' : ''),
              }}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 pt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input-field"
          disabled={loading}
        />
        {isStreaming ? (
          <Button 
            onClick={handleCancel}
            type="button" 
            className="btn-secondary" 
            variant="outline"
          >
            Stop
          </Button>
        ) : (
          <Button type="submit" className="btn-primary" disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? "Sending..." : "Send"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default Chat;

