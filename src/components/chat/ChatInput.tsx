
import React from "react";
import { Send, StopCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  loading: boolean;
  isStreaming: boolean;
  onSend: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  loading,
  isStreaming,
  onSend,
  onCancel,
}) => {
  return (
    <form onSubmit={onSend} className="flex gap-2 pt-4 border-t border-border/60">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="input-field text-sm"
        disabled={loading}
      />
      {isStreaming ? (
        <Button
          onClick={onCancel}
          type="button"
          size="sm"
          variant="outline"
          className="whitespace-nowrap"
        >
          <StopCircle className="w-4 h-4 mr-1.5" />
          Stop
        </Button>
      ) : (
        <Button type="submit" size="sm" className="whitespace-nowrap" disabled={loading}>
          <Send className="w-3.5 h-3.5 mr-1.5" />
          {loading ? "Sending..." : "Send"}
        </Button>
      )}
    </form>
  );
};

export default ChatInput;
