import { useState, useEffect } from "react";
import { Search, Plus, Settings, LogOut, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createConversation, findUserByEmail, getUserConversations } from "@/api/auth"; // adjust the path

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

// const mockConversations: Conversation[] = [
//   {
//     id: "1",
//     name: "Sarah Wilson",
//     avatar: "SW",
//     lastMessage: "That sounds great! Let me know...",
//     time: "2m",
//     unread: 3,
//     online: true,
//   },
//   {
//     id: "2",
//     name: "Design Team",
//     avatar: "DT",
//     lastMessage: "Alex: The new mockups are ready",
//     time: "15m",
//     unread: 0,
//     online: false,
//   },
//   {
//     id: "3",
//     name: "Michael Chen",
//     avatar: "MC",
//     lastMessage: "Thanks for the file!",
//     time: "1h",
//     unread: 0,
//     online: true,
//   },
//   {
//     id: "4",
//     name: "Project Alpha",
//     avatar: "PA",
//     lastMessage: "Meeting scheduled for tomorrow",
//     time: "3h",
//     unread: 1,
//     online: false,
//   },
//   {
//     id: "5",
//     name: "Emma Thompson",
//     avatar: "ET",
//     lastMessage: "See you soon! 👋",
//     time: "1d",
//     unread: 0,
//     online: false,
//   },
// ];



interface ChatSidebarProps {
  activeChat: string | null;
  onSelectChat: (id: string) => void;
}

const ChatSidebar = ({ activeChat, onSelectChat }: ChatSidebarProps) => {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newMember, setNewMember] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };


  // const filteredConversations = mockConversations.filter((conv) =>
  //   conv.name.toLowerCase().includes(search.toLowerCase())
  // );

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(search.toLowerCase())
  );

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      console.log("Logging out...");

      await logoutUser();
      

      // Remove tokens + user data
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      toast.success("Logged out successfully!");

      navigate("/auth", { replace: true });
    } catch (error: any) {
      console.log("Logout error:", error);
      toast.error(error.message || "Logout failed");
    }

    setOpen(false);
  };

  const handleCreateConversation = async () => {
    try {
      // 1️⃣ Fetch user by email
      const user = await findUserByEmail(newMember);

      // 2️⃣ Use user.id (UUID) to create conversation
      await createConversation(user.id);

      toast.success("Conversation created!");
      setCreateOpen(false);
      setNewMember("");
    } catch (err: any) {
      toast.error(err.message || "Could not create conversation");
    }
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getUserConversations();
        const user = JSON.parse(localStorage.getItem("user")!);

        // Transform data for UI
        const formatted = data.map((conv: any) => {
          const otherUser = conv.members.find((m: any) => m.id !== user.id);

          return {
            id: conv.id,
            name: otherUser?.full_name || "Unknown",
            avatar: (otherUser?.full_name || "?")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase(),
            lastMessage: "No messages yet...",
            time: new Date(conv.updated_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: 0,
            online: false,
          };
        });

        setConversations(formatted);
      } catch (err) {
        toast.error("Failed to load conversations");
      }
    };

    loadConversations();
  }, []);



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
              Pulse<span className="text-gradient">Chat</span>
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
        <Button 
          variant="glass" 
          className="w-full justify-start gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      {/* 🚀 CREATE CONVERSATION POPUP */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Start a New Conversation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Enter user email or user ID..."
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleCreateConversation}
              className="text-white"
              variant="outline"
            >
              Create Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="space-y-1">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectChat(conv)}
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
      {/* <div className="p-3 border-t border-sidebar-border">
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
      </div> */}

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
              {getInitials(user.full_name)}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-sidebar" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setOpen(true)}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>


      {/* 🚀 LOGOUT POPUP */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to logout?
          </p>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleLogout}>
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSidebar;