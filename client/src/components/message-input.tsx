import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

export default function MessageInput({ onSendMessage, placeholder = "Type a message..." }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Form submitted:', message);
    if (message.trim()) {
      console.log('Sending message:', message.trim());
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white" data-testid="message-input-container">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="flex-1 focus:ring-2 focus:ring-primary-blue focus:border-transparent"
          data-testid="input-message"
        />
        <Button 
          type="submit"
          disabled={!message.trim()}
          className="bg-primary-blue hover:bg-blue-600"
          data-testid="button-send-message"
          onClick={(e) => {
            if (!message.trim()) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
