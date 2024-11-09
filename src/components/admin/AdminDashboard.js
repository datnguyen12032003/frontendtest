import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../Login/app/static'; // Điều chỉnh đường dẫn nhập nếu cần

const AdminDashboard = () => {
  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log('Token:', token);
      // Bạn có thể sử dụng token ở đây để lấy dữ liệu hoặc các mục đích khác
    } else {
      console.warn('Không tìm thấy token');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 h-auto">
      <h1 className="text-3xl font-bold mb-4 text-black">Bảng Điều Khiển</h1>

      <div className="mt-8">
        <ul className="divide-y divide-gray-200">
          {/* <li className="py-2">
            <Link to="/create-land-lord" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Thêm Chủ Nhà</span>
            </Link>
          </li> */}
          <li className="py-2">
            <Link to="/users-list-admin" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Danh Sách Người Dùng</span>
            </Link>
          </li>

          <li className="py-2">
            <Link to="/land-lord-list" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Danh Sách Chủ Nhà</span>
            </Link>
          </li>
          {/* <li className="py-2">
            <Link to="/house-list-admin" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Danh Sách Nhà Trọ</span>
            </Link>
          </li>
          <li className="py-2">
            <Link to="/create-house" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Thêm Nhà Trọ</span>
            </Link>
          </li> */}

<li className="py-2">
            <Link to="/entry" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Danh Sách Lịch Sử Hoạt Động</span>
            </Link>
          </li>


          <li className="py-2">
            <Link to="/payment-history" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Lịch sử giao dịch</span>
            </Link>
          </li>

          <li className="py-2">
            <Link to="/revenue" className="block hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out rounded-md p-3">
              <span className="text-lg font-semibold text-gray-800">Thống Kê</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
