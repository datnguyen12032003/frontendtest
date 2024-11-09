import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Login/app/static';
import ReactPaginate from 'react-paginate';
import { FaLocationDot, FaBed, FaDollarSign, FaRegImages } from 'react-icons/fa';
import MainImageModal from './MainImageModal';
import QRCodeModal from './QRCodeModal';

const RoomListAdmin = () => {
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [roomsPerPage] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedRoomForQR, setSelectedRoomForQR] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0); // State for payment amount

  const openQRModal = (roomId, amount) => {
    setSelectedRoomForQR(roomId);
    setPaymentAmount(amount); // Set the payment amount
    setIsQRModalOpen(true);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`rooms/find-rooms-by-landlord/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRooms(response.data);
      } catch (err) {
        setError('Không thể lấy danh sách phòng.');
        toast.error('Không thể lấy danh sách phòng.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [id]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này không?')) {
      try {
        const token = getToken();
        await axios.delete(`/rooms/delete/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Đã xóa phòng thành công.');
        setRooms(rooms.filter(room => room._id !== roomId));
      } catch (err) {
        toast.error('Xóa phòng thất bại.');
      }
    }
  };

  const handleUpdateStatus = async (roomId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      const token = getToken();
      await axios.patch(`/rooms/status/${roomId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Cập nhật trạng thái phòng thành công.');
      setRooms(rooms.map(room => room._id === roomId ? { ...room, status: newStatus } : room));
    } catch (err) {
      toast.error('Cập nhật trạng thái phòng thất bại.');
    }
  };

  const openImageModal = (roomId, images) => {
    setSelectedRoomId(roomId);
    setSelectedRoomImages(images);
    setIsModalOpen(true);
  };

  const handleSelectImage = (imageId) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === selectedRoomId
          ? { ...room, images: room.images.map((img) => ({ ...img, main: img._id === imageId })) }
          : room
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-blue-500">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">Lỗi: {error}</div>
      </div>
    );
  }

  const indexOfLastRoom = (currentPage + 1) * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <div className="container mx-auto px-6 py-12">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Danh sách phòng</h1>

      <Link to={`/land-lord-list/${id}/create-room`}>
        <button className="mb-6 bg-orange-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-300 ease-in-out transform hover:scale-105">
          Thêm phòng
        </button>
      </Link>

      {rooms.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentRooms.map((room) => {
              const mainImage = room.images.find(image => image.main);
              return (
                <Link to={`/room-details-admin/${room._id}`} key={room._id}>
                  <div className="bg-white rounded-lg overflow-hidden transform hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out">
                    <div className='w-[300px] h-[300px]'>
                      {mainImage && (
                        <img
                          src={mainImage.url}
                          alt={room.name}
                          className="w-full object-contain h-full rounded-lg"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        {room.name}
                      </h2>
                      <p className="text-gray-600 font-semibold mb-1 flex items-center">
                        <FaDollarSign className="mr-2 text-green-500" />
                        <span className="font-semibold">Giá:</span> &nbsp; <span className="text-red-500">${room.price}</span>
                      </p>
                      <p className="text-gray-600 mb-1 flex items-center">
                        <FaBed className="mr-2 text-orange-500" />
                        <span className="font-semibold">Loại phòng:</span> &nbsp; {room.room_type}
                      </p>
                      <p className="text-gray-600 mb-1 flex items-center">
                        <FaRegImages className="inline-block mr-2 text-blue-500" />
                        <span className="font-semibold">Số lượng phòng:</span> &nbsp; {room.room_quantity}
                      </p>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openImageModal(room._id, room.images);
                        }}
                        className="mt-4 py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                      >
                        Chọn ảnh chính
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateStatus(room._id, room.status);
                        }}
                        className={`mt-4 py-2 px-4 rounded-md ${room.status ? 'bg-green-500' : 'bg-yellow-500'} text-white ml-2`}
                      >
                        {room.status ? 'Hiển thị' : 'Không hiển thị'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openQRModal(room._id, room.price); // Pass room price as payment amount
                        }}
                        className="mt-4 mr-2 py-2 px-6 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition duration-300"
                      >
                        Mã QR
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(room._id);
                        }}
                        className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

            {/* Pagination */}
          <div className="flex justify-center mt-8">
            <ReactPaginate
              previousLabel={"Trước"}
              nextLabel={"Sau"}
              pageCount={Math.ceil(rooms.length / roomsPerPage)}
              onPageChange={handlePageChange}
              containerClassName={"flex space-x-2"}
              pageClassName={"px-3 py-1 border rounded-lg"}
              pageLinkClassName={"text-gray-700"}
              previousClassName={"px-3 py-1 border rounded-lg"}
              nextClassName={"px-3 py-1 border rounded-lg"}
              activeClassName={"bg-orange-500 text-white"}
            />
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600">Không có phòng nào!</div>
      )}

      {/* Image Modal */}
      {isModalOpen && (
        <MainImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          roomId={selectedRoomId}
          images={selectedRoomImages}
          onSelectImage={handleSelectImage}
        />
      )}

      {/* QR Code Modal */}
      {isQRModalOpen && (
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          roomId={selectedRoomForQR}
          paymentAmount={paymentAmount} // Pass payment amount to QRCodeModal
        />
      )}
    </div>
  );
};

export default RoomListAdmin;
