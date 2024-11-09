import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

import {
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  LoginIcon,
  SearchIcon,
  AdjustmentsIcon,
} from "@heroicons/react/outline";
import logoHomifyMe1 from "../assets/logoHomifyMe1.png";
import { getToken } from "./Login/app/static";
import { useAuth } from "./context/UserContext";
import Favorite from "./Home/Favorite";

const Navbar = ({ onSearch }) => {
  const { profile, logOut, setProfile } = useAuth();
  const token = getToken(); // Lấy token từ lưu trữ hoặc context
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      // Gọi API đăng xuất từ backend
      const response = await fetch("/users/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực nếu cần
        },
      });

      // Xoá token và cập nhật state dựa trên response
      if (response.ok) {
        localStorage.removeItem("token"); // Xoá token khỏi lưu trữ
        setProfile(null); // Reset lại thông tin người dùng
        navigate("/login"); // Chuyển hướng về trang đăng nhập
      } else {
        console.error("Đăng xuất thất bại");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng xuất:", error);
    }
  };

  return (
    <nav className="bg-white text-black shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Nội dung của Navbar */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-3xl font-semibold tracking-tight hover:text-gray-900 flex items-center"
          >
            <img src={logoHomifyMe1} alt="Logo" className="h-[70px]" />
            <span className="ml-2 mr-[20px] text-orange-500 text-[28px]">
              HomifyMe
            </span>
          </Link>
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-4 py-2 text-black bg-gray-300 rounded-md w-96"
              onChange={(e) => onSearch(e.target.value)}
            />
            <button
              className="ml-2 px-6 py-2 bg-orange-500 text-white rounded-md"
              onClick={() =>
                onSearch(document.querySelector('input[type="text"]').value)
              }
            >
              <SearchIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Hồ sơ / Các liên kết */}
        <ul className="flex space-x-12 text-lg mr-[30px]">
          {profile?.admin && (
            <li className="flex items-center space-x-2">
              <AdjustmentsIcon className="w-6 h-6 text-orange-500" />
              <Link to="/dashboard">Bảng điều khiển</Link>
            </li>
          )}
          <li className="flex items-center space-x-2">
            <HomeIcon className="w-6 h-6 text-orange-500" />
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="flex items-center space-x-2">
            <InformationCircleIcon className="w-6 h-6 text-orange-500" />
            <Link to="/about">Về chúng tôi</Link>
          </li>
          <li className="flex items-center space-x-2">
            <PhoneIcon className="w-6 h-6 text-orange-500" />
            <Link to="/contact">Liên hệ</Link>
          </li>
          {!token || !profile ? (
            <li className="flex items-center space-x-2">
              <LoginIcon className="w-6 h-6 text-orange-500" />
              <Link to="/login">Đăng nhập/Đăng ký</Link>
            </li>
          ) : (
            <ul className="flex items-center gap-[120px]">
              <Favorite />
              <li className="relative">
                <img
                  src={profile.avatarUrl || "/path/to/default-avatar.png"}
                  alt="Avatar người dùng"
                  onClick={toggleDropdown}
                  className="h-10 w-10 object-cover  rounded-full border-black border-2 cursor-pointer hover:opacity-80 hover:border-black"
                />
                {dropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 text-gray-700 z-50">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        Thông tin cá nhân
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user-history"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        Lịch sử giao dịch
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        Cài đặt
                      </Link>
                    </li>
                    <li>
                      <p
                        onClick={handleLogout}
                        className="block px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        Đăng xuất
                      </p>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
