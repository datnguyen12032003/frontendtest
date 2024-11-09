import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Login/app/static';
import { FaMapMarkerAlt, FaBed, FaDollarSign, FaRegImages } from 'react-icons/fa'; 
import { MdDescription } from 'react-icons/md'; 
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'; 
import ReactModal from 'react-modal';
import RoomImageUpload from './RoomImageUpload ';
import { GrStatusGood } from "react-icons/gr";


ReactModal.setAppElement('#root');

const districts = {
  'Quận Ninh Kiều': ['Phường Xuân Khánh', 'Phường An Bình', 'Phường An Cư', 'Phường An Hòa', 'Phường Hưng Lợi'],
  'Quận Bình Thủy': ['Phường Bình Thủy', 'Phường Bùi Hữu Nghĩa', 'Phường Thới An Đông'],
  'Quận Cái Răng': ['Phường Hưng Phú', 'Phường Ba Láng', 'Phường Lê Bình'],
  'Quận Ô Môn': ['Phường Thới Long', 'Phường Châu Văn Liêm', 'Phường Thới Hòa'],
};

const RoomDetailAdmin = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // New state for Image Modal
  const [updatedRoom, setUpdatedRoom] = useState({});
  const [newQuantity, setNewQuantity] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoom(response.data);
        setUpdatedRoom(response.data);
        setNewQuantity(response.data.room_quantity);
  
        // Fetch revenue by room ID
        const revenueResponse = await axios.get(`/revenue/room/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRevenue(revenueResponse.data.total);
        
      } catch (err) {
        toast.error('Không thể tải được doanh thu phòng.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchRoom();
  }, [roomId]);
  

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/rooms/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoom(response.data);
        setUpdatedRoom(response.data);
        setNewQuantity(response.data.room_quantity);
      } catch (err) {
        setError('Không thể tải thông tin phòng.');
        toast.error('Không thể tải thông tin phòng.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : room.images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < room.images.length - 1 ? prevIndex + 1 : 0));
  };

  const handleUpdateRoom = async () => {
    try {
      const token = getToken();
      await axios.put(`/rooms/update/${roomId}`, updatedRoom, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Thông tin phòng đã được cập nhật!');
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error('Cập nhật thông tin phòng thất bại.');
    }
  };

  const handleUpdateQuantity = async () => {
    try {
      const token = getToken();
      await axios.put(`/rooms/update-quantity/${roomId}`, { room_quantity: newQuantity }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Số lượng phòng đã được cập nhật!');
      setIsQuantityModalOpen(false);
    } catch (error) {
      toast.error('Cập nhật số lượng phòng thất bại.');
    }
  };

  const handleSetDefaultImage = async (imageId) => {
    try {
      const token = getToken();
      const isDefault = !room.images.find((img) => img._id === imageId)?.default;

      // Check for default image count
      const currentDefaultImages = room.images.filter((img) => img.default);
      if (isDefault && currentDefaultImages.length >= 5) {
        toast.error('Chỉ có thể thiết lập tối đa 5 ảnh mặc định.');
        return;
      }

      await axios.put(`upload/set-default/${roomId}/${imageId}`, { default: isDefault }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedImages = room.images.map((img) =>
        img._id === imageId ? { ...img, default: isDefault } : img
      );
      setRoom({ ...room, images: updatedImages });
      toast.success(`Ảnh đã được ${isDefault ? 'thiết lập' : 'bỏ thiết lập'} mặc định!`);
    } catch (error) {
      toast.error('Cập nhật ảnh mặc định thất bại.');
    }
  };

  // Handle delete image
  const handleDeleteImage = async (imageId) => {
    try {
      const token = getToken();
      await axios.delete(`/upload/delete-room-image/${roomId}/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedImages = room.images.filter((img) => img._id !== imageId);
      setRoom({ ...room, images: updatedImages });
      toast.success('Ảnh đã được xoá thành công!');
    } catch (error) {
      toast.error('Xóa ảnh thất bại.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-blue-600">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Không có thông tin phòng.</div>
      </div>
    );
  }

  const hasImages = room.images && room.images.length > 0;
  return (
    <div className="container mx-auto px-6 py-12">
      {/* <ToastContainer /> */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-8 text-center">Chi tiết phòng</h1>
      <div className="flex justify-between items-center bg-white shadow-lg rounded-lg border border-gray-200 mb-8">
      <div className="w-1/2 relative">
      <div className="relative h-[500px] w-[650px]">
        {hasImages ? (
          <img
            src={room.images[currentImageIndex]?.url}
            alt={`Hình ảnh phòng ${currentImageIndex + 1}`}
            className="w-full object-contain h-full rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
            <span className="text-gray-500">Không có hình ảnh nào</span>
          </div>
        )}

        {hasImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition duration-300"
            >
              <BsChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition duration-300"
            >
              <BsChevronRight size={20} />
            </button>
            <button
              onClick={() => handleSetDefaultImage(room.images[currentImageIndex]._id)}
              className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 py-2 px-4 rounded-md shadow-md transition ${
                room.images[currentImageIndex].default
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {room.images[currentImageIndex].default ? 'Bỏ thiết lập mặc định' : 'Thiết lập mặc định'}
            </button>
          </>
        )}
      </div>
    </div>

        <div className="w-1/2 p-[100px]">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2 uppercase">
            {room.name}
          </h2>

          <p className="text-gray-600 mb-4 flex items-center gap-2 text-xl">
            <FaDollarSign className="text-green-500" />
            <span className="font-semibold">Giá:</span> {room.price} VNĐ
          </p>
          <p className="text-gray-600 mb-4 flex items-center gap-2 text-xl">
            <FaBed className="text-orange-600" />
            <span className="font-semibold">Loại phòng:</span> {room.room_type}
          </p>

          <p className="text-gray-600 mb-4 flex items-center gap-2 text-xl">
            <FaRegImages className="text-blue-500" />
            <span className="font-semibold">Số lượng phòng:</span> {room.room_quantity}
          </p>

          <div className="text-gray-600 mb-4 flex items-center gap-2 text-xl">
            <p className='text-red-600'><GrStatusGood /></p>
            <span className="font-semibold">Trạng thái:</span>
            <span className={`font-semibold ${room.status ? 'text-green-500' : 'text-yellow-500'}`}>
              {room.status ? 'Hiển thị' : 'Không hiển thị'}
            </span>
          </div>

          <p className="text-gray-600 mb-4 flex items-center gap-2 text-xl">
            <MdDescription className="text-yellow-600" />
            <span className="font-semibold">Chi tiết:</span> {room.description}
          </p>

          <div className="text-gray-600 mb-4 flex items-center gap-2 text-xl">
            <FaMapMarkerAlt className="text-red-500" />
            <div className='flex items-center'>
              <span className="font-semibold">Địa chỉ:</span> &nbsp;
              {room.address.map((addr, index) => (
                <div key={index}>
                  {addr.detail && `${addr.detail}, `}
                  {addr.ward && `${addr.ward}, `}
                  {addr.district && `${addr.district}, `}
                  {addr.city}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="px-6 py-2 bg-orange-600 text-white rounded-md shadow-md hover:bg-orange-700 transition"
          >
            Cập nhật thông tin
          </button>
          <button
            onClick={() => setIsQuantityModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition ml-4"
          >
            Cập nhật số lượng
          </button>
        
          <div className='mt-4'>
            <RoomImageUpload roomId={roomId} />
          </div>
          <button
              onClick={() => setIsImageModalOpen(true)} // Open Image Modal
              className=" px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition"
            >
              Xem và Xóa Ảnh
            </button>
          
          <div className='mt-4'>
            <h2 className='font-semibold text-2xl'>Doanh thu của phòng</h2>
          <div className="bg-white rounded-lg shadow mt-4">
  <table className="min-w-full">
    <thead>
      <tr className="bg-gray-200">
        <th className="py-2 text-left text-sm font-semibold">Thông tin</th>
        <th className="py-2 text-left text-sm font-semibold">Giá trị</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="py-2">Tổng</td>
        <td className="py-2 text-green-600">{revenue} VNĐ</td>
      </tr>
    </tbody>
  </table>
</div>
          </div>

        </div>

  

      </div>

      <ReactModal
  isOpen={isUpdateModalOpen}
  onRequestClose={() => setIsUpdateModalOpen(false)}
  contentLabel="Cập nhật thông tin phòng"
  className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
  overlayClassName="bg-gray-900 bg-opacity-50"
>
  <div className="bg-white p-8 rounded-lg shadow-lg w-96">
    <h2 className="text-xl font-semibold mb-4">Cập nhật thông tin phòng</h2>

    {/* Room Name */}
    <input
      type="text"
      placeholder="Tên phòng"
      value={updatedRoom.name || ''}
      onChange={(e) => setUpdatedRoom({ ...updatedRoom, name: e.target.value })}
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
    />

    {/* Room Type */}
    <select
      value={updatedRoom.room_type || ''}
      onChange={(e) => setUpdatedRoom({ ...updatedRoom, room_type: e.target.value })}
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
    >
      <option value="">Chọn loại phòng</option>
      <option value="Single">Đơn</option>
      <option value="Double">Đôi</option>
      <option value="Shared">Chia sẻ</option>
    </select>

    {/* Price */}
    <input
      type="number"
      placeholder="Giá phòng"
      value={updatedRoom.price || ''}
      onChange={(e) => setUpdatedRoom({ ...updatedRoom, price: e.target.value })}
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
    />

    {/* Address Detail */}
    <input
      type="text"
      placeholder="Chi tiết địa chỉ"
      value={updatedRoom.address?.[0]?.detail || ''}
      onChange={(e) =>
        setUpdatedRoom({
          ...updatedRoom,
          address: [{ ...updatedRoom.address?.[0], detail: e.target.value }],
        })
      }
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
    />
{/* City */}
<input
      type="text"
      placeholder="Thành phố"
      value="Cần Thơ"
      disabled
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
    />

    {/* District Select */}
    <select
      value={updatedRoom.address?.[0]?.district || ''}
      onChange={(e) => {
        const selectedDistrict = e.target.value;
        setUpdatedRoom({
          ...updatedRoom,
          address: [{ ...updatedRoom.address?.[0], district: selectedDistrict, ward: '' }],
        });
      }}
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
    >
      <option value="">Chọn Quận</option>
      {Object.keys(districts).map((district) => (
        <option key={district} value={district}>
          {district}
        </option>
      ))}
    </select>

    {/* Ward Select */}
    <select
      value={updatedRoom.address?.[0]?.ward || ''}
      onChange={(e) =>
        setUpdatedRoom({
          ...updatedRoom,
          address: [{ ...updatedRoom.address?.[0], ward: e.target.value }],
        })
      }
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
      disabled={!updatedRoom.address?.[0]?.district}
    >
      <option value="">Chọn Phường</option>
      {districts[updatedRoom.address?.[0]?.district]?.map((ward) => (
        <option key={ward} value={ward}>
          {ward}
        </option>
      ))}
    </select>

    
    {/* Room Description */}
    <textarea
      placeholder="Chi tiết phòng"
      value={updatedRoom.description || ''}
      onChange={(e) => setUpdatedRoom({ ...updatedRoom, description: e.target.value })}
      className="border border-gray-300 rounded-md p-2 w-full mb-4"
    />

    <button
      onClick={handleUpdateRoom}
      className="px-4 py-2 bg-green-600 text-white rounded-md"
    >
      Cập nhật
    </button>
    <button
      onClick={() => setIsUpdateModalOpen(false)}
      className="ml-4 px-4 py-2 bg-gray-400 text-white rounded-md"
    >
      Đóng
    </button>
  </div>
</ReactModal>



      {/* Modal for updating room quantity */}
      <ReactModal
        isOpen={isQuantityModalOpen}
        onRequestClose={() => setIsQuantityModalOpen(false)}
        contentLabel="Cập nhật số lượng phòng"
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
        overlayClassName="bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Cập nhật số lượng phòng</h2>
          <input
            type="number"
            placeholder="Số lượng mới"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          />
          <button
            onClick={handleUpdateQuantity}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Cập nhật
          </button>
          <button
            onClick={() => setIsQuantityModalOpen(false)}
            className="ml-4 px-4 py-2 bg-gray-400 text-white rounded-md"
          >
            Đóng
          </button>
        </div>
      </ReactModal>
        {/* Modal hiển thị hình ảnh và xóa ảnh */}
        <ReactModal
  isOpen={isImageModalOpen}
  onRequestClose={() => setIsImageModalOpen(false)}
  contentLabel="Xem và Xóa Ảnh"
  className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
  overlayClassName="bg-gray-900 bg-opacity-50"
>
  <div className="bg-white p-8 rounded-lg shadow-lg w-[700px] h-[550px] overflow-y-auto">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Ảnh Phòng</h2>
    <div className="grid grid-cols-3 gap-6">
      {room.images.map((image) => (
        <div key={image._id} className="relative group">
          <img
            src={image.url}
            alt={`Room Image ${image._id}`}
            className="w-full h-[150px] object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105"
          />
          <button
            onClick={() => handleDeleteImage(image._id)}
            className="absolute top-2 right-2 px-6 py-2 bg-red-600 text-white text-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      ))}
    </div>
    <button
      onClick={() => setIsImageModalOpen(false)}
      className="mt-14 ml-[270px] w-[100px] py-2 bg-gray-600 text-white rounded-md shadow-md hover:bg-gray-700 transition-colors duration-300"
    >
      Đóng
    </button>
  </div>
</ReactModal>
    </div>
  );
};

export default RoomDetailAdmin;
