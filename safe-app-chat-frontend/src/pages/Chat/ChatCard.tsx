import React from 'react';
import dayjs from 'dayjs';

interface ChatCardProps {
  chatId: string;
  chatName: string;
  lastMessage: string;
  createdAt: Date;
  onClick: (chatId: string) => void; // Callback when the card is clicked
}

const ChatCard: React.FC<ChatCardProps> = ({
  chatId,
  chatName,
  lastMessage,
  createdAt,
  onClick,
}) => {
  const formatTimestamp = (createdDate: Date) => {
    const date = dayjs(createdDate); // Treat timestamp as Date

    const isToday = date.isSame(dayjs(), "day");

    return isToday ? date.format("HH:mm") : date.format("MM/DD/YYYY");
  };

  return (
    <div 
    className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
    onClick={() => onClick(chatId)}
    >

      {/* Chat details */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-black">{chatName}</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatTimestamp(createdAt)}
          </span>
        </div>

        {/* last message */}
        <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
      </div>

    </div>
  );
};

export default ChatCard;
