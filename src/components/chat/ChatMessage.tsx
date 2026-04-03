
import React from "react";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: "user" | "ai" | "system";
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, isStreaming }) => {
  const laneClassName =
    sender === "user"
      ? "justify-end"
      : sender === "system"
      ? "justify-center"
      : "justify-start";

  const bubbleClassName =
    sender === "user"
      ? "max-w-[min(32rem,88%)] rounded-3xl rounded-br-lg bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm sm:px-5"
      : sender === "system"
      ? "max-w-4xl rounded-3xl border border-primary/15 bg-primary/[0.07] px-5 py-4 text-center text-sm text-foreground shadow-sm"
      : "w-full max-w-[52rem] rounded-[2rem] border border-border/60 bg-white px-4 py-4 text-left shadow-sm sm:px-6 sm:py-5";

  const proseClassName = cn(
    "max-w-none min-w-0 break-words",
    "prose prose-sm sm:prose-base prose-slate",
    "prose-headings:mb-3 prose-headings:mt-7 prose-headings:font-semibold prose-headings:tracking-tight",
    "prose-p:my-3 prose-p:leading-7",
    "prose-ul:my-4 prose-ol:my-4 prose-li:my-1.5",
    "prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:bg-slate-950 prose-pre:px-4 prose-pre:py-3",
    "prose-pre:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
    "prose-code:break-words prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:font-medium",
    "prose-code:before:content-none prose-code:after:content-none",
    "prose-strong:text-inherit prose-a:text-primary prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground",
    sender === "user" && "prose-invert prose-headings:text-primary-foreground prose-strong:text-primary-foreground prose-code:bg-white/15 prose-blockquote:text-primary-foreground/80 prose-a:text-primary-foreground",
    sender === "system" && "prose-p:my-2 prose-p:text-foreground/85 prose-strong:text-foreground prose-headings:text-foreground",
  );

  const fallbackText =
    isStreaming && !content.trim()
      ? "Generating response..."
      : content;

  return (
    <div
      className={cn("w-full animate-fade-up", sender !== "system" && "px-1 sm:px-2")}
      data-message-lane={sender}
    >
      <div className={cn("flex w-full", laneClassName)}>
        <div
          className={cn(
            bubbleClassName,
            sender === "ai" && isStreaming && "ring-1 ring-primary/20",
          )}
        >
          <div className={proseClassName}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {fallbackText}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
