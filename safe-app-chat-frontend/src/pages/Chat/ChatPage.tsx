import { useState } from "react";
import ChatCard from "./ChatCard";
import ChatContent from "./ChatContent";

interface Message {
  senderId: string;
  content: string;
  type: string;
  timestamp: number;
}

interface ChatData {
  [key: string]: Record<string, Message>;
}

const chatData: ChatData = {
  chatId1: {
    messageId1: {
      senderId: "userId1",
      content: "Hello!",
      type: "text",
      timestamp: 1699999999,
    },
    messageId2: {
      senderId: "userId2",
      content: "Hi there!",
      type: "text",
      timestamp: 1699999999,
    },
  },
  chatId2: {
    messageId1: {
      senderId: "userId3",
      content: "What's up?",
      type: "text",
      timestamp: 1699999988,
    },
  },
};

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const currentUserId = "userId1";

  const chats = [
    {
      chatId: "chatId1",
      chatName: "John Doe",
      lastMessage: "Hi there!",
      lastMessageTimestamp: 1699999999,
    },
    {
      chatId: "chatId2",
      chatName: "Jane Smith",
      lastMessage: "What's up?",
      lastMessageTimestamp: 1699999988,
    },
  ];

  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="chat-view flex h-screen">
      {/* Sidebar */}
      <div className="sidebar w-1/3 border-r overflow-y-auto">
        {chats.map((chat) => (
          <ChatCard
            key={chat.chatId}
            chatId={chat.chatId}
            chatName={chat.chatName}
            lastMessage={chat.lastMessage}
            lastMessageTimestamp={chat.lastMessageTimestamp}
            onClick={handleChatClick}
          />
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-2/3">
        {selectedChatId ? (
          <ChatContent
            chatId={selectedChatId}
            messages={chatData[selectedChatId]}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
