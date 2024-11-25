import React from "react";
import dayjs from "dayjs";

type Message = {
  senderId: string;
  content: string;
  type: string;
  timestamp: number;
};

type ChatContentProps = {
  chatId: string;
  messages: Record<string, Message>; // Messages keyed by messageId
  currentUserId: string; // Logged-in user ID
};

const ChatContent: React.FC<ChatContentProps> = ({
  // chatId,
  messages,
  currentUserId,
}) => {
  if (!messages) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No messages available for this chat.</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto bg-gray-50">
      {Object.entries(messages).map(([messageId, message]) => {
        const isCurrentUser = message.senderId === currentUserId;

        return (
          <div
            key={messageId}
            className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-bubble">
              <p>{message.content}</p>
              <span className="text-xs text-gray-400 block mt-1">
                {dayjs.unix(message.timestamp).format("hh:mm A")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatContent;