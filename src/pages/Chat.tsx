import { useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

const Chat = () => {
  const [activeChat, setActiveChat] = useState<string | null>("1");

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ChatSidebar activeChat={activeChat} onSelectChat={setActiveChat} />
      <ChatWindow chatId={activeChat} />
    </div>
  );
};

export default Chat;