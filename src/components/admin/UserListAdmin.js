import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig"; // Ensure this path is correct
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await axios.get("/users/all", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to header
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to header
        },
      });
      setSelectedUser(response.data);
      setShowModal(true); // Show modal
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Error fetching user details.");
    }
  };

  const handleBanUser = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.put(`/users/ban/${selectedUser._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to header
        },
      });
      
      console.log(response.data);
  
      // Cập nhật trạng thái của selectedUser
      setSelectedUser(prevUser => ({
        ...prevUser,
        banned: !prevUser.banned, // Đổi trạng thái banned
      }));
  
      // Cập nhật danh sách users
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, banned: !user.banned } : user
      ));
  
      toast.success(selectedUser.banned ? "khôi phục tài khoản thành công!" : "Cấm tài khoản thành công!");
  
      // Đóng modal sau khi thực hiện xong
      setShowModal(false);
  
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error("Error banning user.");
    }
  };
  

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  // Placeholder image URL
  const placeholderImage = "https://via.placeholder.com/100"; // Change this URL as needed

  return (
    <div className="container mx-auto p-4 h-[600px]">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Danh Sách Người Dùng</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2 border">Họ Tên</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Số Điện Thoại</th>
            <th className="px-4 py-2 border">Địa Chỉ</th>
            <th className="px-4 py-2 border">Quyền Quản Trị Viên</th>
            <th className="px-4 py-2 border"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100 text-center">
              <td className="px-4 py-2 border">{user.fullname}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.phone}</td>
              <td className="px-4 py-2 border">{user.address}</td>
              <td className={`px-4 py-2 border font-semibold ${user.admin ? 'text-green-500' : 'text-red-500'}`}>
                {user.admin ? "Có" : "Không"}
              </td>
              <td className="px-4 py-2 border">
                <button onClick={() => handleUserClick(user._id)} className="text-blue-500 hover:underline">Chi Tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for user details */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 lg:w-1/4 transition-transform transform-gpu">
            <h2 className="text-xl font-semibold mb-4 text-center">Chi Tiết Người Dùng</h2>
            {selectedUser && (
              <>
                <div className="flex justify-center mb-4">
                  <img
                    src={selectedUser.avatarUrl || placeholderImage}
                    alt="User Avatar"
                    className="w-24 h-24 object-cover rounded-full border-4 border-orange-500 shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-gray-700 mb-2">Tài khoản: <span className="font-semibold">{selectedUser.username}</span></p>
                <p className="text-gray-700 mb-2">Họ tên: <span className="font-semibold">{selectedUser.fullname}</span></p>
                <p className="text-gray-700 mb-2">Email: <span className="font-semibold">{selectedUser.email}</span></p>
                <p className="text-gray-700 mb-2">Giới tính: <span className="font-semibold">{selectedUser.gender}</span></p>
                <p className="text-gray-700 mb-2">Ngày sinh: <span className="font-semibold">{selectedUser.dayOfBirth}</span></p>
                <p className="text-gray-700 mb-2">Số điện thoại: <span className="font-semibold">{selectedUser.phone}</span></p>
                <p className="text-gray-700 mb-2">Địa chỉ: <span className="font-semibold">{selectedUser.address}</span></p>
                <p className="flex text-gray-700 mb-2">Quyền Quản Trị Viên:
                  <span className={`ml-1 font-semibold ${selectedUser.admin ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedUser.admin ? "Có" : "Không"}
                  </span>
                </p>
                <p className="flex text-gray-700 mb-2">Tài Khoản Bị Cấm:
                  <span className={`ml-1 font-semibold ${selectedUser.banned ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedUser.banned ? "Có" : "Không"}
                  </span>
                </p>
                <p className="text-gray-700 mb-2">Ngày tạo: <span className="font-semibold">{new Date(selectedUser.created_at).toLocaleDateString()}</span></p>
              </>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={handleBanUser} className={`px-4 py-2 ${selectedUser.banned ? 'bg-green-500' : 'bg-red-500'} text-white rounded-md hover:${selectedUser.banned ? 'bg-green-600' : 'bg-red-600'} transition duration-200`}>
                {selectedUser.banned ? "Khôi Phục Tài Khoản" : "Cấm Tài Khoản"}
              </button>
              <button onClick={() => setShowModal(false)} className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
