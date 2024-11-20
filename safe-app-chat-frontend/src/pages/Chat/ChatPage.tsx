
const ChatPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 border-r p-4">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="w-full p-2 mb-4 rounded border"
        />
        <ul className="space-y-2">
          {["An", "Khá Bá", "Emmie", "Bill Gates", "Victoria H"].map((name, i) => (
            <li
              key={i}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {name[0]}
                </div>
                <span>{name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {i % 2 === 0 ? "Đang hoạt động" : "Không hoạt động"}
              </span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-purple-600 text-white p-2 rounded mt-4 hover:bg-purple-700">
          Đăng xuất
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-grow"></div>
        <div className="border-t p-4 flex items-center">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="flex-grow p-2 border rounded"
          />
          <button className="ml-4 bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
