import { useState, useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
  fileName?: string;
  fileSize?: string;
  imageUrl?: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hey! How are you doing today?",
    timestamp: "10:30 AM",
    isOwn: false,
    status: "read",
    type: "text",
  },
  {
    id: "2",
    content: "I'm doing great, thanks for asking! Just finished up a project.",
    timestamp: "10:32 AM",
    isOwn: true,
    status: "read",
    type: "text",
  },
  {
    id: "3",
    content: "That's awesome! Can you share the final design?",
    timestamp: "10:33 AM",
    isOwn: false,
    status: "read",
    type: "text",
  },
  {
    id: "4",
    content: "",
    timestamp: "10:35 AM",
    isOwn: true,
    status: "read",
    type: "image",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    content: "",
    timestamp: "10:36 AM",
    isOwn: true,
    status: "read",
    type: "file",
    fileName: "project-specs.pdf",
    fileSize: "2.4 MB",
  },
  {
    id: "6",
    content: "This looks amazing! 🎉 The attention to detail is incredible.",
    timestamp: "10:38 AM",
    isOwn: false,
    status: "read",
    type: "text",
  },
];

interface ChatWindowProps {
  chatId: string | null;
}

const ChatWindow = ({ chatId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string, type: "text" | "file" | "image", file?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      status: "sent",
      type,
      ...(type === "file" && { fileName: file?.name, fileSize: `${((file?.size || 0) / 1024 / 1024).toFixed(1)} MB` }),
      ...(type === "image" && file && { imageUrl: URL.createObjectURL(file) }),
    };

    setMessages([...messages, newMessage]);
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center glow-primary animate-pulse-glow">
            <svg className="w-12 h-12 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
            Select a conversation
          </h3>
          <p className="text-muted-foreground">
            Choose a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border glass">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground">
              SW
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-background" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Sarah Wilson</h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-center mb-6">
          <span className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
            Today
          </span>
        </div>
        
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            timestamp={msg.timestamp}
            isOwn={msg.isOwn}
            status={msg.status}
            type={msg.type}
            fileName={msg.fileName}
            fileSize={msg.fileSize}
            imageUrl={msg.imageUrl}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;