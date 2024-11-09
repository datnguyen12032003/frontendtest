import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Login/app/static';
import { FaCamera } from 'react-icons/fa';

const LandlordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // Loading indicator cho quá trình cập nhật
  const [error, setError] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    dayOfBirth: ''
  });

  // Lấy thông tin chủ nhà từ API
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/landlords/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLandlord(response.data);
        setUpdatedInfo({
          fullname: response.data.fullname,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          gender: response.data.gender,
          dayOfBirth: response.data.dayOfBirth.split('T')[0],
        });
      } catch (err) {
        setError('Không thể lấy thông tin chủ nhà.');
        toast.error('Không thể lấy thông tin chủ nhà.');
      } finally {
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [id]);

  const handleAvatarClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      const uploadAvatar = async () => {
        try {
          const token = getToken();
          await axios.post(`upload/upload-avatar-landlord/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success('Đã cập nhật ảnh đại diện thành công.');
          setNewAvatar(URL.createObjectURL(file)); 
        } catch (err) {
          toast.error('Cập nhật ảnh đại diện thất bại.');
        }
      };

      uploadAvatar();
    }
  };

  const handleEditClick = () => {
    setShowModal(true); 
  };

  // Xử lý cập nhật thông tin
  const handleUpdate = async () => {
    setUpdating(true); // Bắt đầu quá trình cập nhật
    try {
      const token = getToken();
      await axios.put(`/landlords/${id}`, updatedInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Cập nhật thông tin thành công.');
      setShowModal(false); 
      setLandlord(updatedInfo); 
    } catch (err) {
      toast.error('Cập nhật thông tin thất bại.');
    } finally {
      setUpdating(false); // Kết thúc quá trình cập nhật
    }
  };

  const handleInputChange = (e) => {
    setUpdatedInfo({
      ...updatedInfo,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-xl text-blue-500">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-xl text-red-600">Lỗi: {error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <ToastContainer />
      {landlord ? (
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row items-start">
          <div className="relative flex-shrink-0 mb-6 md:mb-0 md:mr-6">
            <div className="relative group w-40 h-40">
              <img
                src={newAvatar || landlord.avatarUrl || 'default-avatar.jpg'}
                alt={landlord.fullname}
                className="w-full h-full object-cover rounded-full border-4 border-orange-500 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={handleAvatarClick}
              />
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                onClick={handleAvatarClick}
              >
                <FaCamera size={32} className="text-white bg-orange-500 p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300" />
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-gray-900 mt-5 mb-5">{landlord.fullname}</h1>
            <p className="text-gray-700 text-lg mb-2">Email: <span className="font-semibold">{landlord.email}</span></p>
            <p className="text-gray-700 text-lg mb-2">Số điện thoại: <span className="font-semibold">{landlord.phone}</span></p>
            <p className="text-gray-700 text-lg mb-2">Địa chỉ: <span className="font-semibold">{landlord.address}</span></p>
            <p className="text-gray-700 text-lg mb-2">Giới tính: <span className="font-semibold">{landlord.gender}</span></p>
            <p className="text-gray-700 text-lg mb-2">Ngày sinh: <span className="font-semibold">{new Date(landlord.dayOfBirth).toLocaleDateString()}</span></p>
            <p className="text-gray-700 text-lg mb-6">Ngày tạo: <span className="font-semibold">{new Date(landlord.created_at).toLocaleDateString()}</span></p>
            <div className="flex gap-4">
              <Link
                to={`/land-lord-list/${id}/create-room`}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-orange-500 hover:to-orange-700 transition duration-300"
              >
                Thêm Phòng
              </Link>
              <Link
                to={`/land-lord-list/${id}/rooms`}
                className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300"
              >
                Xem Danh Sách Phòng
              </Link>
              <button
                onClick={handleEditClick}
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
              >
                Sửa Thông Tin
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">Không có thông tin cho chủ nhà này.</p>
      )}

      {/* Modal cập nhật thông tin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Cập nhật thông tin</h2>
            <div className="mb-4">
              <label className="block mb-1">Họ tên</label>
              <input
                type="text"
                name="fullname"
                value={updatedInfo.fullname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={updatedInfo.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={updatedInfo.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={updatedInfo.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Giới tính</label>
              <select
                name="gender"
                value={updatedInfo.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-1">Ngày sinh</label>
              <input
                type="date"
                name="dayOfBirth"
                value={updatedInfo.dayOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-600 transition duration-300"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdate}
                className={`bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ${updating ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={updating}
              >
                {updating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordDetail;
