
import React from "react";

interface ChatMessageProps {
  content: string;
  sender: "user" | "ai" | "system";
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, isStreaming }) => {
  // Convert newlines to <br>, but preserve paragraphs, lists, and other formatting
  const formatContent = (text: string) => {
    // Replace markdown-style headers with HTML
    let formatted = text
      .replace(/^### (.*$)/gim, '<h3 class="text-base sm:text-lg font-bold mt-3 sm:mt-4 mb-1 sm:mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg sm:text-xl font-bold mt-4 sm:mt-5 mb-2 sm:mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-xl sm:text-2xl font-bold mt-5 sm:mt-6 mb-3 sm:mb-4">$1</h1>');
    
    // Replace markdown-style lists with HTML
    formatted = formatted
      .replace(/^\s*\* (.*$)/gim, '<li class="ml-3 sm:ml-4 my-1">$1</li>')
      .replace(/^\s*- (.*$)/gim, '<li class="ml-3 sm:ml-4 my-1">$1</li>')
      .replace(/^\s*\d+\. (.*$)/gim, '<li class="ml-3 sm:ml-4 my-1 list-decimal">$1</li>');
    
    // Wrap lists in <ul> tags
    formatted = formatted
      .replace(/<li class="ml-3 sm:ml-4 my-1">(.*?)<\/li>\n(?!<li)/gim, '<li class="ml-3 sm:ml-4 my-1">$1</li></ul>\n')
      .replace(/(?<!<\/ul>\n)(<li class="ml-3 sm:ml-4 my-1">)/gim, '<ul class="list-disc my-2 pl-3 sm:pl-4">\n$1');
    
    // Replace double line breaks with paragraphs
    const paragraphs = formatted.split(/\n\n+/);
    formatted = paragraphs.map(para => {
      // Skip wrapping if paragraph already has HTML tags
      if (para.trim().startsWith('<') && !para.trim().startsWith('<li')) {
        return para;
      }
      // Skip empty paragraphs
      if (!para.trim()) {
        return '';
      }
      // Wrap text in paragraph tags
      return `<p class="my-1 sm:my-2 text-sm sm:text-base">${para.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');
    
    return formatted || (isStreaming ? '<p class="animate-pulse text-sm sm:text-base">Generating response...</p>' : '');
  };

  return (
    <div
      className={`${
        sender === "user"
          ? "bg-primary text-primary-foreground ml-auto"
          : sender === "system"
          ? "glass-card bg-accent text-white mx-auto max-w-[90%] sm:max-w-[85%] text-center"
          : "glass-card mr-auto bg-card/90"
      } p-3 sm:p-4 rounded-xl max-w-[85%] sm:max-w-[80%] animate-fade-up ${
        isStreaming ? "border-l-4 border-primary" : ""
      }`}
    >
      <div
        className="prose prose-invert max-w-none prose-p:my-1 sm:prose-p:my-2 prose-p:text-sm sm:prose-p:text-base prose-headings:mb-2 sm:prose-headings:mb-3 prose-headings:mt-3 sm:prose-headings:mt-6 prose-li:my-1 prose-ul:mt-1 sm:prose-ul:mt-2 prose-ul:mb-2 sm:prose-ul:mb-4"
        dangerouslySetInnerHTML={{
          __html: formatContent(content || ""),
        }}
      />
    </div>
  );
};

export default ChatMessage;
