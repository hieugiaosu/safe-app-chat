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
        <label className="input input-bordered flex items-center gap-2 bg-white rounded-md p-2 shadow">
          <input
            type="text"
            className="grow bg-white text-black placeholder-gray-500 focus:outline-none"
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>

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
      <div className="w-2/3 flex flex-col h-screen">
        {selectedChatId ? (
          <>
            {/* Chat Content */}
            <div className="flex-grow overflow-y-auto p-4">
              <ChatContent
                chatId={selectedChatId}
                messages={chatData[selectedChatId]}
                currentUserId={currentUserId}
              />
            </div>

            {/* Message Input */}
            <div className="border-t p-2 bg-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message"
                className="input input-bordered w-full bg-white"
              />
              <button
                className="btn btn-info"
              >
                Send
              </button>
            </div>
          </>
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
