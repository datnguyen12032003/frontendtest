import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig"; // Sử dụng axios từ config của bạn
import { toast, ToastContainer } from "react-toastify";
import ReactModal from "react-modal";
import {
  FaDollarSign,
  FaBed,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaShoppingCart,
  FaPhoneAlt,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import RoomMap from "./RoomMap"; // Import thêm RoomMap component để hiển thị bản đồ
import CommentForm from "./CommentForm";
import { getToken } from '../components/Login/app/static';

// Set app element for modal accessibility
ReactModal.setAppElement("#root");

const RoomDetail = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    
    const fetchRoom = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/rooms/${roomId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
        );
       console.log(response.data.comments);
        setRoom(response.data);
      } catch (err) {
        setError("Không thể lấy thông tin phòng.");
        toast.error("Không thể lấy thông tin phòng.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleCommentAdded = (newRoomData) => {
    console.log(newRoomData);
    setRoom(newRoomData); 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-blue-500">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-red-600">
        Lỗi: {error}
      </div>
    );
  }

  const defaultImages = room.images.filter((image) => image.default);
  const nonDefaultImages = room.images.filter((image) => !image.default);
  const allImages = [...defaultImages, ...nonDefaultImages];

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setModalIsOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < allImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : allImages.length - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      {room ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="uppercase text-3xl font-extrabold mb-4 text-gray-800">
            {room.name}
          </h1>

          {room.address && room.address.length > 0 && (
            <div className="text-gray-700  mb-4 flex">
              <h3 className="text-xl font-semibold flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-[3px] text-xl" /> Địa
                chỉ:
              </h3>
              {room.address.map((addr, index) => (
                <div className="text-xl ml-2" key={index}>
                  <p>
                    {addr.detail}, {addr.ward}, {addr.district}, {addr.city}
                  </p>
                </div>
              ))}
            </div>
          )}


          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="col-span-2">
              <img
                src={defaultImages[0]?.url || "/no-image.png"}
                alt="Room Image 1"
                className="w-full h-[465px] aspect-[1/1] object-cover rounded-lg shadow-md"
              />
              <img
                src={defaultImages[1]?.url || "/no-image.png"}
                alt="Room Image 2"
                className="w-full h-[465px] aspect-[1/1] object-cover rounded-lg shadow-md mt-2"
              />
            </div>

            <div className="col-span-1 grid grid-cols-1 gap-2">
              <img
                src={defaultImages[2]?.url || "/no-image.png"}
                alt="Room Image 3"
                className="w-[500px] h-[308px] aspect-[1/1] object-cover rounded-lg shadow-md cursor-pointer"
                onClick={() => handleImageClick(2)}
              />
              <img
                src={defaultImages[3]?.url || "/no-image.png"}
                alt="Room Image 4"
                className="w-full h-[308px] aspect-[1/1] object-cover rounded-lg shadow-md cursor-pointer"
                onClick={() => handleImageClick(3)}
              />
              <div className="relative group" onClick={() => handleImageClick(4)}>
                <img
                  src={defaultImages[4]?.url || "/no-image.png"}
                  alt="Room Image 5"
                  className="w-full h-[308px] aspect-[1/1] object-cover rounded-lg shadow-md cursor-pointer"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Xem thêm
                </div>
              </div>
            </div>
          </div>

          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="All Room Images"
            className="modal rounded-lg overflow-hidden shadow-lg bg-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevImage}
                className="text-gray-700 hover:text-blue-500"
              >
                &lt; Trước
              </button>
              <h2 className="text-2xl font-bold">
                Hình ảnh {currentImageIndex + 1} / {allImages.length}
              </h2>
              <button
                onClick={handleNextImage}
                className="text-gray-700 hover:text-blue-500"
              >
                Tiếp &gt;
              </button>
            </div>
            <img
              src={allImages[currentImageIndex]?.url || "/no-image.png"}
              alt={`Room Image ${currentImageIndex + 1}`}
              className="w-full h-auto object-cover rounded-lg shadow-md mb-4"
            />
            <div className="flex justify-center mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => setModalIsOpen(false)}
              >
                Đóng
              </button>
            </div>
          </ReactModal>

          <div className="mt-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaDollarSign className="text-green-500 mr-2 text-xl" />
                  <h2 className="text-2xl text-gray-700">
                  <p >
  <span className="font-semibold">Giá chỉ từ:</span>{" "}
  {room.room_quantity > 0 ? (
    <span className="text-red-600 font-semibold">
      {room.price} VND/tháng
    </span>
  ) : (
    <span className="text-red-600 font-semibold">Sold Out</span>
  )}
</p>

                  </h2>
                </div>

                <div className="flex justify-end space-x-4">
                  {/* <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-300 shadow-lg">
                    <FaShoppingCart className="mr-2" />
                    Thanh toán
                  </button> */}
                  <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ease-in-out duration-300 shadow-lg">
                    <FaPhoneAlt className="mr-2" />
                    Liên hệ: 0343690062
                  </button>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <FaBed className="text-blue-500 mr-2 text-xl" />
                <p className="text-gray-600">
                  <span className="font-semibold">Loại phòng:</span>{" "}
                  {room.room_type}
                </p>
              </div>
              <div className="flex items-center">
                <FaClipboardList className="text-purple-500 mr-2 text-xl" />
                <p className="text-gray-600">
                  <span className="font-semibold">Số lượng phòng:</span>{" "}
                  {room.room_quantity}
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
              <h2 className="text-2xl font-semibold text-gray-700 flex items-center mb-2">
                <FaInfoCircle className="text-blue-500 mr-2" />
                Thông tin chi tiết:
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {room.description}
              </p>
            </div>
            
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
          {/* Hiển thị bản đồ với địa chỉ */}
          <RoomMap address={room.address[0]} />
          </div>

          

           {/* Phần bình luận */}
     
          <CommentForm roomId={roomId} onCommentAdded={handleCommentAdded} />

          {/* Display Comments */}
          <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Bình luận về phòng:</h2>
            {room.comments.length > 0 ? (
              room.comments.map((comment) => (
                <div key={comment._id} className="mb-4 border-b pb-2">
                  <div className="flex items-center mb-1">
                    <strong className="text-gray-800">{comment.user_id.username}:</strong>
                    <span className="text-gray-500 ml-2">{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-600 mb-1">{comment.content}</p>
                  <div className="flex items-center">
                    {Array.from({ length: comment.rating }).map((_, index) => (
                      <FaStar key={index} className="text-yellow-500 mr-1" />
                    ))}
                    {Array.from({ length: 5 - comment.rating }).map((_, index) => (
                      <FaStar key={index + comment.rating} className="text-gray-300 mr-1" />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Chưa có bình luận nào.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Không có thông tin phòng để hiển thị</p>
      )}
    </div>
  );
};

export default RoomDetail;
