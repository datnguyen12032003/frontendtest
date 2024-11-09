import { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getToken } from "../Login/app/static";

const API_URL = "http://localhost:3000/rooms/available";
const FAVORITE_API_URL = "http://localhost:3000/favorites/create/";
const FAVORITE_LIST_URL = "http://localhost:3000/favorites"; // API lấy danh sách yêu thích

export function HomeList() {
  const [rooms, setRooms] = useState([]);
  const [favorites, setFavorites] = useState([]); // Chứa danh sách ID phòng yêu thích
  const navigate = useNavigate();

  // Lấy danh sách phòng
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Lấy danh sách yêu thích
  useEffect(() => {
    const fetchFavoriteRooms = async () => {
      const token = getToken();
      if (!token) return; // Kiểm tra token

      try {
        const response = await fetch(FAVORITE_LIST_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Gắn token vào header
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching favorite rooms");
        }

        const data = await response.json();
        // Lưu danh sách ID phòng yêu thích
        const favoriteRoomIds = data.rooms.map((room) => room._id);
        setFavorites(favoriteRoomIds);
      } catch (error) {
        console.error("Error fetching favorite rooms:", error);
      }
    };

    fetchFavoriteRooms();
  }, []);

  const toggleFavorite = (id) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    // Thêm hoặc xóa phòng khỏi danh sách yêu thích
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.includes(id);

      if (!isFavorited) {
        // Thêm vào danh sách yêu thích
        fetch(`${FAVORITE_API_URL}${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Added to favorites:", data);
            setFavorites([...prevFavorites, id]); // Cập nhật state không cần reload
            window.location.reload();
          })
          .catch((error) => console.error("Error adding to favorites:", error));
      } else {
        // Xóa khỏi danh sách yêu thích
        setFavorites(prevFavorites.filter((favoriteId) => favoriteId !== id));
      }

      return prevFavorites; // Giữ nguyên trạng thái hiện tại trong lúc cập nhật
    });
  };
  const handleDelete = async (roomId) => {
    const token = getToken(); // Lấy token từ hàm getToken hoặc nơi lưu token

    try {
      const response = await fetch(
        `http://localhost:3000/favorites/delete/${roomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Đưa Bearer token vào tiêu đề
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      window.location.reload();
      // Sau khi xóa thành công, cập nhật lại danh sách các phòng
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };
  const handleRoomClick = (e, roomId) => {
    const token = getToken();
    if (!token) {
      e.preventDefault();
      navigate("/login");
    } else {
      navigate(`/house-list/${roomId}`);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="flex flex-col justify-center shadow-2xl w-[88%]">
        <h1 className="p-[20px] font-bold text-[25px] text-orange-500">
          TRỌ ƯU TIÊN
        </h1>
        <div className="flex flex-wrap gap-[20px] justify-center mb-[50px]">
          {rooms.map((room) => (
            <div
              key={room._id}
              style={{
                width: "18%",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div className="relative">
                <img
                  src={
                    room.images.find((img) => img.main)?.url ||
                    room.images[0]?.url
                  }
                  onClick={(e) => handleRoomClick(e, room._id)}
                  alt={room.name}
                  className="w-full h-[190px] object-cover rounded-[8px] cursor-pointer"
                />
                {favorites.includes(room._id) ? (
                  <IoMdHeart
                    fill="red"
                    className="absolute bottom-2 right-2 cursor-pointer text-white w-[30px] h-[30px] transition-transform duration-200 ease-in-out transform hover:scale-125"
                    onClick={() => handleDelete(room._id)}
                  />
                ) : (
                  <FaRegHeart
                    fill="white"
                    className="absolute bottom-2 right-2 cursor-pointer text-white w-[25px] h-[25px] transition-transform duration-200 ease-in-out transform hover:scale-125"
                    onClick={() => toggleFavorite(room._id)}
                  />
                )}
              </div>

              <div>
                <h3
                  className="hover:text-orange-500 cursor-pointer"
                  onClick={(e) => handleRoomClick(e, room._id)}
                  style={{
                    margin: "10px 0",
                    fontSize: "15px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "230px",
                  }}
                >
                  {room.name}
                </h3>
                <p
                  style={{
                    margin: "5px 0",
                    color: "#555",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <label>Giá:</label>
                  {room.room_quantity > 0 ? (
                    <p
                      style={{
                        color: "red",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      {room.price}
                    </p>
                  ) : (
                    <p
                      style={{
                        color: "red",
                        fontWeight: "500",
                        fontSize: "14px",
                      }}
                    >
                      Sold Out
                    </p>
                  )}
                </p>

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
                  <label className="font-semibold text-[14px] flex gap-[20px]">
                    <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                    <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                    <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                    <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                    <FaStar className="text-yellow-400 w-[23px] h-[23px]" />
                  </label>
                  <p className="mt-[3px]">{room.ratting}</p>
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
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                      fontSize: "12px",
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
          ))}
        </div>
      </div>
    </div>
  );
}
