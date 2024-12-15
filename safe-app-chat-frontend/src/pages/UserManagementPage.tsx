import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/admin/users'); // API URL
      console.log('Dữ liệu từ API:', response.data);
      setUsers(response.data);
    } catch (err) {
      setError('Không thể lấy danh sách người dùng. Vui lòng thử lại.');
      console.error('Lỗi khi lấy danh sách người dùng:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId: string, newStatus: boolean) => {
    console.log('Dữ liệu từ1111:');
    try {
      const response = await axiosInstance.put(`/admin/${userId}/updateStatus`, { isActive: newStatus });
      const updatedUser = response.data; // Lấy user đã cập nhật từ API
      setMessageStatus('Cập nhật trạng thái thành công!');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: updatedUser.isActive } : user
        )
      );

      setMessageStatus('Cập nhật trạng thái thành công!');
    setTimeout(() => setMessageStatus(''), 3000); // Xóa thông báo sau 3 giây
  } catch (error) {
    console.error(error);
    setMessageStatus('Cập nhật trạng thái thất bại!');
    setTimeout(() => setMessageStatus(''), 3000); // Xóa thông báo sau 3 giây
  }
};

  const updateRole = async (userId: string, newRole: string) => {
    console.log('Cập nhật vai trò cho người dùng:', userId, newRole);
    try {
      const response = await axiosInstance.put(`/admin/${userId}/updateRole`, { role: newRole });
      console.log('Dữ liệu từ API:', response);
      const updatedUser = response.data;
      setMessageStatus('Cập nhật vai trò thành công!');
      
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, role: updatedUser.role } : user
      )
    );

    setMessageStatus('Cập nhật vai trò thành công!');
    setTimeout(() => setMessageStatus(''), 3000); // Xóa thông báo sau 3 giây
  } catch (error) {
    console.error(error);
    setMessageStatus('Cập nhật vai trò thất bại!');
    setTimeout(() => setMessageStatus(''), 3000); // Xóa thông báo sau 3 giây
  }
};

  const sendWarning = async (userId: string) => {
    try {
      await axiosInstance.post(`/admin/${userId}/warning`);
      setMessageStatus('Đã gửi cảnh báo thành công!');
    } catch (err) {
      console.error('Lỗi khi gửi cảnh báo:', err);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

    return (
      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar */}
        <div className="w-1/5 bg-blue-200 text-blue-900 p-6">
          <h1 className="text-2xl font-bold mb-4">Quản trị viên</h1>
          <ul>
            <li className="mb-4">
              <a href="/admin" className="text-lg hover:underline">
                Quản lý người dùng
              </a>
            </li>
            <li className="mb-4">
              <a href="/admin/thongke" className="text-lg hover:underline">
                Thống kê
              </a>
            </li>
            <li className="mb-4">
              <a href="/signin" className="text-lg hover:underline">
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
  
        {/* Main Content */}
        <div className="w-4/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Quản lý người dùng</h1>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
  
          {loading && <p className="text-blue-500">Đang tải danh sách người dùng...</p>}
          {error && <p className="text-red-500">{error}</p>}
  
          {!loading && !error && (
            <>
              {filteredUsers.length > 0 ? (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="w-full table-auto">
                    <thead className="bg-blue-300 text-blue-900">
                      <tr>
                        <th className="py-3 px-6 text-left">Email</th>
                        <th className="py-3 px-6 text-left">Vai trò</th>
                        <th className="py-3 px-6 text-left">Trạng thái</th>
                        <th className="py-3 px-6 text-left">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr
                          key={user._id}
                          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="py-3 px-6">{user.email}</td>
                          <td className="py-3 px-6">
                            {user.role === "1" ? "Quản trị viên" : "Người dùng"}
                          </td>
                          <td className="py-3 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-white ${
                                user.isActive ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {user.isActive ? "Đang hoạt động" : "Đã chặn"}
                            </span>
                          </td>
                          <td className="py-3 px-6 space-x-2">
                            <button
                              onClick={() =>
                                updateRole(user._id, user.role === "1" ? "0" : "1")
                              }
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Đổi vai trò
                            </button>
                            <button
                              onClick={() => updateStatus(user._id, !user.isActive)}
                              className={`px-3 py-1 text-white rounded ${
                                user.isActive
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                            >
                              {user.isActive ? "Chặn" : "Bỏ chặn"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Không tìm thấy người dùng nào.</p>
              )}
            </>
          )}
  
          {messageStatus && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded">
              {messageStatus}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default UserManagementPage;