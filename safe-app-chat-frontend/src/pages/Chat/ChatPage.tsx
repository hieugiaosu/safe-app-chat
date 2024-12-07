import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import ChatCard from "./ChatCard";
import ChatContent from "./ChatContent";
import axiosInstance from "../../api/axiosInstance";

interface Message {
  senderId: string;
  content: string;
  type: string;
  timestamp: number;
}

interface Chat {
  chatId: string;
  chatName: string;
  lastMessage: string;
  lastMessageTimestamp: number;
}

const ChatPage = () => {
  const { user } = useUser(); // Access authenticated user from context
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchError, setSearchError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChatUser, setNewChatUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // Fetch user's chat list when component loads
    const fetchChats = async () => {
      try {
        if (user?._id) {
          const response = await axiosInstance.get(`/chat/getAllConversationByUser?userId=${user._id}`);
          setChatList(response.data); // Assuming response.data contains the list of chats.
        }
      } catch (err) {
        console.error("Error fetching chat list:", err);
      }
    };

    fetchChats();
  }, [user]);

  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
    setMessages([]); // Clear messages temporarily
    fetchMessages(chatId);
    setNewChatUser(null); // Clear newChatUser as we're switching to an existing chat
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axiosInstance.get(`/chat/getMessagesByChatId/${chatId}`);
      setMessages(response.data); // Assuming response.data contains messages for the chat.
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");

    try {
      // Fetch user by email
      const userResponse = await axiosInstance.get(`/users/getUserByEmail?email=${searchEmail}`);
      const foundUser = userResponse.data;
      let newChatUser = {
        id: foundUser._id,
        name: `${foundUser.firstName} ${foundUser.lastName}`
      }
      setNewChatUser(newChatUser); // Set the new chat user
      setMessages([]); // Clear messages for the new chat

      // Check for an existing conversation
      const conversationResponse = await axiosInstance.get(
        `/chat/getConversation?user1=${user?._id}&user2=${foundUser.id}`
      );

      const conversation = conversationResponse.data;

      if (conversation) {
        // If a conversation exists, display its messages
        setSelectedChatId(conversation.chatId);
        fetchMessages(conversation.chatId);
      } else {
        // If no conversation exists, clear selectedChatId to start a new conversation
        setSelectedChatId(null);
      }
    } catch (err) {
      console.error("Error during search:", err);
      setSearchError("User not found or unable to fetch conversation.");
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!newChatUser && !selectedChatId) return;

    try {
      let chatIdToUse = selectedChatId;

      if (newChatUser && !selectedChatId) {
        // Create a new conversation if it doesn't exist
        const newConversationResponse = await axiosInstance.post(`/chat/createConversation`, {
          user1: user?._id,
          user2: newChatUser.id,
        });

        chatIdToUse = newConversationResponse.data.chatId;
        setSelectedChatId(chatIdToUse);
      }

      // Send the message
      await axiosInstance.post(`/chat/sendMessage`, {
        chatId: chatIdToUse,
        senderId: user?._id,
        content: messageContent,
      });

      // Refresh messages after sending
      fetchMessages(chatIdToUse!);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-view flex h-screen">
      {/* Sidebar */}
      <div className="sidebar w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b bg-gray-100">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="avatar w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading user...</p>
          )}
        </div>

        {/* Search and Chat List */}
        <form onSubmit={handleSearch} className="input input-bordered flex items-center gap-2 bg-white rounded-md p-2 shadow">
          <input
            type="text"
            className="grow bg-white text-black placeholder-gray-500 focus:outline-none"
            placeholder="Search by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        {searchError && <p className="text-red-500 text-sm">{searchError}</p>}

        {chatList.map((chat) => (
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
      <p>{JSON.stringify(newChatUser)}</p>

        {newChatUser || selectedChatId ? (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-gray-100">
              <h2 className="text-lg font-bold">
                {newChatUser
                  ? newChatUser.name
                  : chatList.find((chat) => chat.chatId === selectedChatId)?.chatName || "Unknown Chat"}
              </h2>
            </div>
            <div className="flex-grow overflow-y-auto p-4">
              {messages.length > 0 ? (
                <ChatContent
                  chatId={selectedChatId!}
                  messages={messages}
                  currentUserId={user?._id!}
                />
              ) : (
                <p className="text-gray-500 text-center">Start a conversation</p>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t p-2 bg-gray-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Type a message"
                className="input input-bordered w-full bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = ""; // Clear the input field
                  }
                }}
              />
              <button
                className="btn btn-info"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>(
                    "input[type='text']"
                  );
                  if (input && input.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = ""; // Clear the input field
                  }
                }}
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