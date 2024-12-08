import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext";
import ChatCard from "./ChatCard";
import ChatContent from "./ChatContent";
import axiosInstance from "../../api/axiosInstance";
import { ref, onValue, set, off, push, getDatabase } from "firebase/database";
import {db} from '../../firebaseConfig'

interface Message {
  senderId: string;
  text: string;
  createdAt: Date;
}

interface Chat {
  _id: string;
  chatName: string;
  lastMessage: string;
  createdAt: Date;
}

const ChatPage = () => {
  const { user } = useUser(); // Access authenticated user from context
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchError, setSearchError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<{ id: string; name: string } | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch user's chat list when component loads
    const fetchChats = async () => {
      try {
        if (user?._id) {
          const response = await axiosInstance.get(`/chat/getAllConversationByUser?userId=${user._id}`);
          console.log(response.data);
          
          setChatList(response.data); // Assuming response.data contains the list of chats.
        }
      } catch (err) {
        console.error("Error fetching chat list:", err);
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    // Set up real-time listener for the selected chat
    if (selectedChatId) {
      const chatMessagesRef = ref(db, `chats/${selectedChatId}/messages`);
      onValue(chatMessagesRef, (snapshot) => {
        const messagesData = snapshot.val();
        if (messagesData) {
          const loadedMessages: Message[] = Object.keys(messagesData).map((key) => ({
            senderId: messagesData[key].senderId,
            text: messagesData[key].text,
            createdAt: new Date(messagesData[key].createdAt),
          }));
          setMessages(loadedMessages); // Update state with real-time data
        }
      });

      return () => {
        // Clean up the listener when the component is unmounted or chatId changes
        off(chatMessagesRef)
      };
    }
  }, [selectedChatId]);
  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
    setMessages([]); // Clear messages temporarily
    fetchMessages(chatId);
    setChatPartner(null); // Clear chatPartner as we're switching to an existing chat
  };

  const fetchMessages = async (chatId: string) => {
    console.log(chatId);
    console.log(`/chat/getAllMessagesByChatId?chatId=${chatId}`);
    
    try {
      const response = await axiosInstance.get(`/chat/getAllMessagesByChatId?chatId=${chatId}`);
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
      let chatPartner = {
        id: foundUser._id,
        name: `${foundUser.firstName} ${foundUser.lastName}`
      }
      setChatPartner(chatPartner); // Set the new chat user
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

  const handleSendMessage = async () => {
    const messageContent = messageInputRef.current?.value.trim();
    console.log(chatPartner);
    console.log(selectedChatId);
    console.log(user);
  
    if (!chatPartner && !selectedChatId) return;
  
    try {
      let newConversationId = selectedChatId; // To track the current or new chat ID
  
      // Start a new conversation
      if (!selectedChatId) {
        const response = await axiosInstance.post("/chat/sendFirstMessage", {
          recipientId: chatPartner?.id,
          senderId: user?._id,
          text: messageContent,
        });
        newConversationId = response.data.conversationId; // Set the new chat ID
        setSelectedChatId(newConversationId);
      } else {
        // Currently in an existing conversation
        await axiosInstance.post("/chat/sendMessage", {
          senderId: user?._id,
          conversationId: selectedChatId,
          text: messageContent,
        });
      }
  
      // Push the message to Firebase Realtime Database
      if (newConversationId) {
        const db = getDatabase(); // Initialize the database
        const messagesRef = ref(db, `chats/${newConversationId}/messages`); // Reference to the chat's messages path
        
        const messageData = {
          senderId: user?._id,
          text: messageContent,
          timestamp: Date.now(), // Optional: Add a timestamp
        };
  
        await push(messagesRef, messageData); // Add the message to Firebase
      }
  
      // Clear the input field after sending the message
      if (messageInputRef.current) {
        messageInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
            key={chat._id}
            chatId={chat._id}
            chatName={chat.chatName}
            lastMessage={chat.lastMessage}
            createdAt={chat.createdAt}
            onClick={handleChatClick}
          />
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col h-screen">
      <p>{JSON.stringify(chatPartner)}</p>

        {chatPartner || selectedChatId ? (
          <>
            <div className="flex items-center justify-between p-4 border-b bg-gray-100">
              <h2 className="text-lg font-bold">
                {chatPartner
                  ? chatPartner.name
                  : chatList.find((chat) => chat._id === selectedChatId)?.chatName || "Unknown Chat"}
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
                ref={messageInputRef}
                placeholder="Type a message"
                className="input input-bordered w-full bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInputRef.current?.value.trim()) {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="btn btn-info"
                onClick={handleSendMessage}
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