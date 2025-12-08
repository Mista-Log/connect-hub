import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Image, Send, Smile, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string, type: "text" | "file" | "image", file?: File) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), "text");
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "image") => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage(file.name, type, file);
    }
    e.target.value = "";
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <div
        className={cn(
          "flex items-end gap-2 p-2 rounded-2xl transition-all duration-200",
          isFocused ? "bg-secondary ring-2 ring-primary/50" : "bg-secondary/50"
        )}
      >
        {/* Attachment Buttons */}
        <div className="flex items-center gap-1 pb-1">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "file")}
          />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "image")}
          />
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary"
            onClick={() => imageInputRef.current?.click()}
          >
            <Image className="w-5 h-5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary"
          >
            <Smile className="w-5 h-5" />
          </Button>
        </div>

        {/* Text Input */}
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground py-2 px-1 max-h-32"
            style={{ minHeight: "40px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 pb-1">
          {message.trim() ? (
            <Button
              type="button"
              variant="gradient"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={handleSend}
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-primary"
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;