
import React, { useRef, useState, useEffect } from "react";
import { streamAIContent } from "@/utils/aiContentGenerator";
import { getApiKey } from "@/lib/api-key";
import { useToast } from "@/hooks/use-toast";
import { CourseInfo } from "@/types/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useGeneratedContent } from "@/hooks/use-generated-content";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "system";
  isStreaming?: boolean;
}

interface ChatContainerProps {
  studyOption: string;
  courseInfo: CourseInfo;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ studyOption, courseInfo }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { loadCurrentContent, saveCurrentContent } = useGeneratedContent<Message[]>("chat");

  useEffect(() => {
    const restoreChat = async () => {
      const savedContent = await loadCurrentContent();

      if (Array.isArray(savedContent) && savedContent.length > 0) {
        setMessages(savedContent);
        return;
      }

      let welcomeMessage: string = "";

      if (courseInfo.language === "French") {
        welcomeMessage = `Bonjour ! Je suis votre assistant d'étude IA pour le module ${courseInfo.module}. Je suis là pour vous aider avec vos besoins en ${studyOption}. Que souhaitez-vous savoir sur ce sujet ?`;
      } else {
        welcomeMessage = `Welcome! I'm your AI study assistant for ${courseInfo.module}. I'm here to help you with your ${studyOption} needs. What would you like to know about this topic?`;
      }

      setMessages([{
        id: "welcome",
        content: welcomeMessage,
        sender: "system" as const,
      }]);
    };

    void restoreChat();
  }, [courseInfo.module, studyOption, courseInfo.language]);

  useEffect(() => {
    const persistMessages = async () => {
      if (messages.length === 0 || messages.some((message) => message.isStreaming)) {
        return;
      }

      await saveCurrentContent(messages);
    };

    void persistMessages();
  }, [messages, saveCurrentContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      
      // Update the latest AI message to indicate cancellation
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.sender === 'ai' && lastMessage.isStreaming) {
          const cancelText = courseInfo.language === "French" 
            ? " (Génération arrêtée par l'utilisateur)"
            : " (Message generation stopped by user)";
          
          return prev.map(msg => 
            msg.id === lastMessage.id 
              ? { ...msg, content: msg.content + cancelText, isStreaming: false } 
              : msg
          );
        }
        return prev;
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiKey = getApiKey();
    if (!apiKey) {
      toast({
        title:
          courseInfo.language === "French"
            ? "Clé API requise"
            : "API Key Required",
        description:
          courseInfo.language === "French"
            ? "Veuillez configurer votre clé API dans les paramètres"
            : "Add your API key using the key button in the top-right corner",
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
          ? `Génère une réponse à la question suivante : "${input}" pour le module "${courseInfo.module}" au niveau ${courseInfo.level}. Formattez bien les reponses avec des sections claires, des paragraphes structurés et des listes à puces lorsque c'est approprié. Utilisez des titres pour organiser l'information.`
          : `Generate a response to the following question: "${input}" for the "${courseInfo.module}" module at ${courseInfo.level} level. Format the response with clear sections, structured paragraphs, and bullet points when appropriate. Use headings to organize information.`;

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
        const errorMessage = courseInfo.language === "French"
          ? "Une erreur est survenue lors de la génération de la réponse. Veuillez réessayer plus tard."
          : "There was an error while generating the AI response. Please try again later.";
          
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  content: errorMessage,
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

  // Check if we're currently streaming a response
  const isStreaming = React.useMemo(() => {
    return messages.some(msg => msg.isStreaming);
  }, [messages]);

  return (
    <section className="flex h-[calc(100vh-13rem)] min-h-[38rem] w-full flex-col overflow-hidden rounded-[1.75rem] border border-border/60 bg-white shadow-sm animate-fade-up">
      <div className="border-b border-border/60 bg-muted/35 px-5 py-4 sm:px-6">
        <div className="max-w-5xl">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {courseInfo.language === "French" ? "Conversation" : "Conversation"}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">
            {courseInfo.language === "French"
              ? `Assistant IA pour ${courseInfo.module}`
              : `${courseInfo.module} AI assistant`}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {courseInfo.language === "French"
              ? "Réponses formatées en markdown, alignées dans une mise en page de conversation stable."
              : "Markdown-aware responses in a stable transcript layout that keeps each message in its own lane."}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background via-background to-muted/20 px-3 py-5 sm:px-4">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            sender={message.sender}
            isStreaming={message.isStreaming}
          />
        ))}
        <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-border/60 bg-white/95 px-4 pb-4 pt-3 backdrop-blur sm:px-6 sm:pb-6">
        <div className="mx-auto w-full max-w-6xl">
        <ChatInput
        input={input}
        setInput={setInput}
        loading={loading}
        isStreaming={isStreaming}
        onSend={handleSend}
        onCancel={handleCancel}
      />
        </div>
      </div>
    </section>
  );
};

export default ChatContainer;
