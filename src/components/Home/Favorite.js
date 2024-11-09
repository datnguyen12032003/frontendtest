import { FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState, useRef } from "react";
import { getToken } from "../Login/app/static";

const API_URL = "http://localhost:3000/favorites";

function Favorite() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(); // Tạo ref để tham chiếu đến modal

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken(); // Lấy token của bạn từ hàm getToken() hoặc một biến đã lưu
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Đưa Bearer token vào tiêu đề
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const data = await response.json();
        setRooms(data.rooms);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [rooms]);

  // Effect để hiển thị modal khi danh sách rooms được cập nhật

  const handleRoomClick = (e, roomId) => {
    navigate(`/house-list/${roomId}`);
  };

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleDelete = async (roomId) => {
    const token = getToken(); // Lấy token từ hàm getToken hoặc nơi lưu token

    try {
      const response = await fetch(`${API_URL}/delete/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Đưa Bearer token vào tiêu đề
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete room");
      }

      // Sau khi xóa thành công, cập nhật lại danh sách các phòng
      setRooms(rooms.filter((room) => room._id !== roomId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <li className="relative flex items-center space-x-2">
      <FaRegHeart
        className="w-6 h-6 text-orange-500 cursor-pointer"
        onClick={handleShowModal}
      />
      <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
        {rooms.length}
      </span>
      {showModal && (
        <ul
          ref={modalRef} // Tham chiếu modal để kiểm tra nhấn ra ngoài
          className="absolute top-[45px] -right-[190px] mt-2 w-[400px] bg-white shadow-lg rounded-b-md py-2 text-gray-700 z-50 overflow-hidden"
        >
          <h1 className="py-2 font-semibold text-center border-b-[1px]">
            Trọ yêu thích
          </h1>
          {rooms ? (
            rooms?.map((room) => (
              <li key={room._id} className="p-3 border-b-[1px] cursor-pointer ">
                <div className="flex gap-[10px]">
                  <img
                    onClick={(e) => handleRoomClick(e, room._id)}
                    className="h-[60px] w-[80px] rounded-md object-cover" // Đảm bảo hình ảnh không bị tràn ra
                    src={
                      room.images.find((img) => img.main)?.url ||
                      room.images[0]?.url
                    }
                    alt={room.name}
                  />
                  <div className="flex items-center w-[75%]">
                    <div className="w-[70%]">
                      <p
                        className="text-[15px] font-medium truncate" // Dùng truncate để tránh tràn văn bản
                      >
                        {room.name}
                      </p>
                      <p className="text-[13px] text-gray-400">
                        Từ: <label className="text-red-700">{room.price}</label>
                      </p>
                    </div>
                    <p
                      onClick={() => handleDelete(room._id)}
                      className="w-[30%] text-right hover:text-red-300 text-[14px] font-semibold cursor-pointer text-red-600 "
                    >
                      Xoá
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div></div>
          )}
          <Link
            to={`/favoriteList/`}
            className="flex items-center hover:text-blue-300 justify-center gap-[10px] text-[15px] font-semibold text-blue-700"
          >
            Xem tất cả <FaArrowRight />
          </Link>
        </ul>
      )}
    </li>
  );
}

export default Favorite;
