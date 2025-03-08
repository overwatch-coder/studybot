
import React from "react";

interface ChatMessageProps {
  content: string;
  sender: "user" | "ai" | "system";
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, isStreaming }) => {
  return (
    <div
      className={`${
        sender === "user"
          ? "bg-primary text-primary-foreground ml-auto"
          : sender === "system"
          ? "glass-card bg-accent text-white mx-auto max-w-[90%] text-center"
          : "glass-card mr-auto bg-card/90"
      } p-4 rounded-xl max-w-[80%] animate-fade-up ${
        isStreaming ? "border-l-4 border-primary" : ""
      }`}
    >
      <div
        className="prose prose-invert max-w-none prose-p:my-2 prose-headings:mb-3 prose-headings:mt-6 prose-li:my-1 prose-ul:mt-2 prose-ul:mb-4"
        dangerouslySetInnerHTML={{
          __html: content?.replace(/\n/g, '<br/>') || (isStreaming ? '<p class="animate-pulse">Generating response...</p>' : ''),
        }}
      />
    </div>
  );
};

export default ChatMessage;
