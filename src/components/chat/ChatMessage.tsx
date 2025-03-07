
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
          ? "user-message"
          : sender === "system"
          ? "system-message glass-card bg-accent text-white"
          : "ai-message"
      } ${isStreaming ? "streaming-message border-l-4 border-primary" : ""}`}
    >
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: content?.replace("html", "") || (isStreaming ? '<p class="animate-pulse">Generating response...</p>' : ''),
        }}
      />
    </div>
  );
};

export default ChatMessage;
