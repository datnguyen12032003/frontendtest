import React, { useState } from 'react';
import axios from '../../axiosConfig'; // Điều chỉnh đường dẫn nhập
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Login/app/static'; // Điều chỉnh đường dẫn nhập nếu cần
import { useParams } from 'react-router-dom';

const AvatarUpload = () => {
  const { id } = useParams(); // Lấy ID của landlord từ tham số URL
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Vui lòng chọn một hình ảnh để tải lên.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const token = getToken(); // Lấy token
      const response = await axios.post(`upload/upload-avatar-landlord/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Đặt tiêu đề xác thực
        },
      });

      toast.success('Tải lên ảnh đại diện thành công!');
      setFile(null); // Xóa input file sau khi tải lên thành công
      console.log(response.data); // Sử dụng nếu cần để cập nhật giao diện
    } catch (error) {
      toast.error('Tải lên ảnh đại diện không thành công.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 mt-6">
        <ToastContainer />
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Tải Lên Ảnh Đại Diện</h1>
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4 p-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
          />
          <button
            onClick={handleUpload}
            className="bg-orange-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8H4z"></path>
                </svg>
                Đang Tải Lên...
              </div>
            ) : (
              'Tải Lên Ảnh Đại Diện'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
