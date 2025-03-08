
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
    <form onSubmit={onSend} className="flex gap-2 pt-4">
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
          className="btn-secondary text-xs sm:text-sm whitespace-nowrap" 
          variant="outline"
        >
          <StopCircle className="w-4 h-4 mr-1 sm:mr-2" />
          Stop
        </Button>
      ) : (
        <Button type="submit" className="btn-primary text-xs sm:text-sm whitespace-nowrap" disabled={loading}>
          <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          {loading ? "Sending..." : "Send"}
        </Button>
      )}
    </form>
  );
};

export default ChatInput;
