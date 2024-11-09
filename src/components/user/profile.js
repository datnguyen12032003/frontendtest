import React, { useState, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { getToken } from "../Login/app/static";
import EditProfile from "./editProfile";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUploadAvatar = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await fetch("http://localhost:3000/upload/upload-avatar-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        setError("Failed to upload avatar");
        return;
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setAvatar(null); // Reset avatar state after upload
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 h-[550px] mb-[200px]">
      <h1 className="text-3xl font-bold mb-6 text-center">Thông tin cá nhân</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {isEditing && <EditProfile setIsEditing={setIsEditing} />}

      <div className="max-w-xl mx-auto rounded-lg overflow-hidden">
        <div className="flex items-center gap-[10px]">
          <label className="cursor-pointer relative">
            <img
              src={user.avatarUrl || "https://default-avatar-url.com"}
              className="w-[70px] h-[70px] object-cover border-2 border-orange-500 rounded-[50%]"
              alt="User Avatar"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden" // Ẩn input file
              onClick={(e) => (e.target.value = null)} // Reset input file
            />
            <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
              <MdOutlineFileUpload className="text-white text-2xl" />
            </div>
          </label>
          <div className="flex flex-col">
            <h1 className="font-semibold text-[18px] pb-[5px]">Ảnh đại diện</h1>
            {avatar && (
              <button
                className="px-3 py-1 rounded-md bg-blue-600 text-white flex items-center gap-[5px] text-[16px]"
                onClick={handleUploadAvatar}
              >
                <MdOutlineFileUpload /> Cập nhật ảnh đại diện
              </button>
            )}
          </div>
        </div>

        {/* Phần hiển thị thông tin khác */}
        <div className="py-8">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-500">Họ và tên</label>
            <p className="text-[16px] font-semibold mt-[5px] text-black border-[1px] border-gray-300 px-4 py-2 rounded-md">
              {user.fullname}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-500">Email</label>
            <p className="text-[16px] font-semibold mt-[5px] text-black border-[1px] border-gray-300 px-4 py-2 rounded-md">
              {user.email}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-500">Tên tài khoản</label>
            <p className="text-[16px] font-semibold mt-[5px] text-black border-[1px] border-gray-300 px-4 py-2 rounded-md">
              {user.username}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-500">Địa chỉ</label>
            <p className="text-[16px] font-semibold mt-[5px] text-black border-[1px] border-gray-300 px-4 py-2 rounded-md">
              {user.address}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Số ĐT</label>
            <p className="text-[16px] font-semibold mt-[5px] text-black border-[1px] border-gray-300 px-4 py-2 rounded-md">
              {user.phone}
            </p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 hover:bg-blue-300 flex items-center gap-[10px] text-white text-[16px] px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <FaRegEdit /> Chỉnh sửa thông tin
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                navigate(`/`);
              }}
            >
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
