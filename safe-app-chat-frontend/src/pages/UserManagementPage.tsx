import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Bar } from 'react-chartjs-2';
// Import các thành phần cần thiết
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('users'); // State để xác định nội dung hiển thị
  const [statistics, setStatistics] = useState<any[]>([]); // Lưu dữ liệu thống kê

  // State cho việc chọn năm
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    if (currentPage === 'users') {
      fetchUsers();
    } else if (currentPage === 'statistics') {
      fetchStatistics(selectedYear);
    }
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Không thể lấy danh sách người dùng. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }

  };

  const fetchStatistics = async (year: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/statistic/toxic-messages/${year}`); // API thống kê
      console.log("nam" + response.data);
      setStatistics(response.data);
    } catch (err) {
      setError('Không thể lấy dữ liệu thống kê. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId: string, newStatus: boolean) => {
    try {
      const response = await axiosInstance.put(`/admin/${userId}/updateStatus`, { isActive: newStatus });
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: updatedUser.isActive } : user
        )
      );
      setMessageStatus('Cập nhật trạng thái thành công!');
      setTimeout(() => setMessageStatus(''), 3000);
    } catch (error) {
      console.error(error);
      setMessageStatus('Cập nhật trạng thái thất bại!');
      setTimeout(() => setMessageStatus(''), 3000);
    }
  };

  const renderUsersPage = () => (
    <>
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
          {users.length > 0 ? (
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
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-3 px-6">{user.email}</td>
                      <td className="py-3 px-6">{user.role === '1' ? 'Quản trị viên' : 'Người dùng'}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-white ${
                            user.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {user.isActive ? 'Đang hoạt động' : 'Đã chặn'}
                        </span>
                      </td>
                      <td className="py-3 px-6 space-x-2">
                        <button
                          onClick={() => updateStatus(user._id, !user.isActive)}
                          className={`px-3 py-1 text-white rounded ${
                            user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {user.isActive ? 'Chặn' : 'Bỏ chặn'}
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
    </>
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/statistic/toxic-messages/${selectedYear}`);
        setStatistics(response.data);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const renderStatisticsPage = () => {
    const data = {
      labels: statistics.map((stat) => `Tháng ${stat.month}`),
      datasets: [
        {
          label: 'Số tin nhắn toxic',
          data: statistics.map((stat) => stat.count),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Số lượng tin nhắn toxic theo tháng (${selectedYear})`,
        },
      },
    };
    
    return (
      <div>
        <h1 className="text-3xl font-bold text-blue-600">Thống kê</h1>
        <div className="flex items-center my-4">
          <label htmlFor="yearSelect" className="mr-2">Chọn năm:</label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            {[...Array(10)].map((_, index) => {
              const year = currentYear - index;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
        {loading && <p className="text-blue-500">Đang tải dữ liệu thống kê...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
            <Bar data={data} options={{ responsive: true }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-blue-200 text-blue-900 p-6">
        <h1 className="text-2xl font-bold mb-4">Quản trị viên</h1>
        <ul>
          <li className="mb-4">
            <button onClick={() => setCurrentPage('users')} className="text-lg hover:underline">
              Quản lý người dùng
            </button>
          </li>
          <li className="mb-4">
            <button onClick={() => setCurrentPage('statistics')} className="text-lg hover:underline">
              Thống kê
            </button>
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
        {currentPage === 'users' && renderUsersPage()}
        {currentPage === 'statistics' && renderStatisticsPage()}
      </div>
    </div>
  );
};

export default UserManagementPage;