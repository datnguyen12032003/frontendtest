import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig"; // Cấu hình axios để gọi API
import { toast, ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

import { Link, Navigate, useNavigate } from "react-router-dom"; // Import Link if you need navigation
import { useRoom } from "../context/RoomContext";

const RoomList = () => {
  const { room } = useRoom();
  const [rooms, setRooms] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(room, "room");
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/rooms/all");
        setRooms(response.data);
      } catch (error) {
        toast.error("Không thể lấy danh sách phòng.");
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);
  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter((favoriteId) => favoriteId !== id);
      } else {
        return [...prevFavorites, id];
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-xl text-blue-500">Đang tải...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-xl text-red-600">Lỗi: {error}</div>
    );
  }

  return (
    <div className="mx-auto flex flex-col items-center mb-[50px]  bg-gray-100">
      <div className=" flex justify-items-start w-[100%] ">
        <h1 className="text-[27px] font-bold mb-6 mx-[90px]">
          Danh sách phòng
        </h1>
      </div>
      <div className="  flex flex-col w-[88%]  shadow-xl h-[100vh] bg-white">
        <ToastContainer />

        <h2 className="mx-[25px] text-[18px] font-semibold mt-[30px]">
          Tổng {!room?.lenght ? 0 : room?.length} kết quả
        </h2>

        <div className="flex flex-col items-center gap-[30px] mt-[15px] w-[100%] justify-center ">
          {room?.length === 0 ? (
            <div className="text-red-500 text-[25px] mt-[100px] font-semibold">
              Room not found !
            </div>
          ) : (
            room?.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-lg overflow-hidden px-[10px] w-[100%] "
              >
                <div className="p-4 flex gap-[20px] ">
                  <div className="relative">
                    <Link to={`/house-list/${room.id}`}>
                      <img
                        className="w-[260px] rounded-lg h-[200px]"
                        src={
                          room.images.find((img) => img.main)?.url ||
                          room.images[0]?.url
                        }
                        alt="hi"
                      />
                    </Link>
                    {favorites.includes(room.id) ? (
                      <IoMdHeart
                        fill="red"
                        className="absolute bottom-2 right-2 cursor-pointer text-white w-[30px] h-[30px] transition-transform duration-200 ease-in-out transform hover:scale-125"
                        onClick={() => toggleFavorite(room.id)}
                      />
                    ) : (
                      <FaRegHeart
                        fill="black"
                        className="absolute bottom-2 right-2 cursor-pointer text-white w-[25px] h-[25px] transition-transform duration-200 ease-in-out transform hover:scale-125"
                        onClick={() => toggleFavorite(room.id)}
                      />
                    )}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      className="mb-[12px]"
                    >
                      {room.name}
                    </h3>
                    <p
                      className="mt-[10px] mb-[20px]"
                      style={{
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        width: "500px",
                        gap: "5px",
                      }}
                    >
                      <label className="font-semibold text-[14px] flex gap-2">
                        <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                        <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                        <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                        <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                        <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                      </label>{" "}
                      <p className="mt-[3px]">{room.ratting}</p>
                    </p>

                    <p
                      className="mb-[10px]"
                      style={{
                        color: "#555",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <label>Giá:</label>{" "}
                      <p
                        className="text-orange-600"
                        style={{
                          fontWeight: "500",
                          fontSize: "14px",
                        }}
                      >
                        {room.price} VND
                      </p>
                    </p>

                    <p className="text-[15px]  mb-[30px]">
                      <label className="text-red-600 font-semibold">
                        Số lượng còn lại:{" "}
                      </label>
                      {room.room_quantity} phòng
                    </p>
                    <p
                      style={{
                        margin: "5px 0",
                        color: "#555",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FaLocationDot />
                      <p
                        className="text-gray-500 mt-[4px]"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "250px",
                          fontSize: "14px",
                        }}
                      >
                        {room.address.map((addr, index) => (
                          <p key={index}>
                            {addr.detail && `${addr.detail}, `}
                            {addr.ward && `${addr.ward}, `}
                            {addr.district && `${addr.district}, `}
                            {addr.city}
                          </p>
                        ))}
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
