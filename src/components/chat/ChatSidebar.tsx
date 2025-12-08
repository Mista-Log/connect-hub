import { useState } from "react";
import { Search, Plus, Settings, LogOut, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    avatar: "SW",
    lastMessage: "That sounds great! Let me know...",
    time: "2m",
    unread: 3,
    online: true,
  },
  {
    id: "2",
    name: "Design Team",
    avatar: "DT",
    lastMessage: "Alex: The new mockups are ready",
    time: "15m",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar: "MC",
    lastMessage: "Thanks for the file!",
    time: "1h",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "Project Alpha",
    avatar: "PA",
    lastMessage: "Meeting scheduled for tomorrow",
    time: "3h",
    unread: 1,
    online: false,
  },
  {
    id: "5",
    name: "Emma Thompson",
    avatar: "ET",
    lastMessage: "See you soon! 👋",
    time: "1d",
    unread: 0,
    online: false,
  },
];

interface ChatSidebarProps {
  activeChat: string | null;
  onSelectChat: (id: string) => void;
}

const ChatSidebar = ({ activeChat, onSelectChat }: ChatSidebarProps) => {
  const [search, setSearch] = useState("");

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 h-full bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-semibold text-foreground">
              Pulse<span className="text-primary">Chat</span>
            </span>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-sidebar-accent border-0"
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button variant="glass" className="w-full justify-start gap-2">
          <Plus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="space-y-1">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                activeChat === conv.id
                  ? "bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground">
                  {conv.avatar}
                </div>
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-online rounded-full border-2 border-sidebar" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground truncate">
                    {conv.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conv.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {conv.unread}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
              JD
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-sidebar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;