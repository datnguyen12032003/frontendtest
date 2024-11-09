import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Nếu bạn sử dụng React Router
import axios from "../../axiosConfig";

const UserDetailAdmin = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${id}`); // Gọi API
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Người dùng không tồn tại</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi Tiết Người Dùng</h1>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Họ Tên:</strong> {user.fullname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số Điện Thoại:</strong> {user.phone}</p>
        <p><strong>Địa Chỉ:</strong> {user.address}</p>
        <p><strong>Ngày Sinh:</strong> {new Date(user.dayOfBirth).toLocaleDateString()}</p>
        <p><strong>Quyền Admin:</strong> {user.admin ? "Có" : "Không"}</p>
        <img src={user.avatarUrl} alt="Avatar" className="mt-4 w-24 h-24 rounded-full" />
      </div>
    </div>
  );
};

export default UserDetailAdmin;
