import React from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "system";
}

interface ChatProps {
  studyOption: string;
  courseInfo: {
    module: string;
    language: string;
    level: string;
  };
}

const Chat: React.FC<ChatProps> = ({ studyOption, courseInfo }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Add welcome message when component mounts
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
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response for ${studyOption} about ${courseInfo.module}`,
        sender: "ai" as const,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

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
                ? "system-message glass-card bg-accent"
                : "ai-message"
            }`}
          >
            {message.content}
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
        />
        <Button type="submit" className="btn-primary">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default Chat;