import { useState, useRef, useEffect } from "react";
import { FaDollarSign } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useRoom } from "../context/RoomContext";

function PriceSlider() {
  const { setMaxPrice, setMinPrice, minPrice, maxPrice } = useRoom();
  // Giá trị tối đa ban đầu
  const [isSliderOpen, setIsSliderOpen] = useState(false); // Trạng thái mở/đóng thanh kéo
  const dropdownRef = useRef(null); // Tạo ref cho thanh kéo

  // Reset giá trị khi reload trang
  useEffect(() => {
    const defaultMinPrice = 0; // Giá trị tối thiểu mặc định
    const defaultMaxPrice = 10000000; // Giá trị tối đa mặc định
    setMinPrice(defaultMinPrice);
    setMaxPrice(defaultMaxPrice);
  }, []); // Chỉ chạy 1 lần khi component được mount

  // Xử lý việc nhấn bên ngoài thanh kéo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSliderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen); // Mở hoặc đóng thanh kéo khi nhấn vào div "Chọn giá"
  };

  const handleMinPriceChange = (event) => {
    const value = Math.min(Number(event.target.value), maxPrice - 100000); // Đảm bảo minPrice nhỏ hơn maxPrice
    setMinPrice(value);
  };

  const handleMaxPriceChange = (event) => {
    const value = Math.max(Number(event.target.value), minPrice + 100000); // Đảm bảo maxPrice lớn hơn minPrice
    setMaxPrice(value);
  };

  // Chuyển đổi từ VND sang triệu và làm tròn đến 2 chữ số thập phân
  const formatPriceToMillion = (price) => {
    return (price / 1000000).toFixed(2);
  };

  // Tính toán phần trăm dựa trên giá trị hiện tại của thanh kéo
  const getPercent = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div>
      <div
        className="gap-[20px] shadow-md justify-between"
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
          width: "280px",
          height: "55px",
          border: "0.5px solid white",
        }}
        onClick={toggleSlider} // Nhấn để mở/đóng thanh kéo
      >
        <div className="flex items-center gap-[10px]">
          <span style={{ fontWeight: "bold" }}>
            <FaDollarSign fill="#F97300" className="w-[24px] h-[24px]" />
          </span>
          <span style={{ fontWeight: "500" }} className="font-semibold">
            {formatPriceToMillion(minPrice)} triệu -{" "}
            {formatPriceToMillion(maxPrice)} triệu
          </span>{" "}
        </div>
        {isSliderOpen ? <IoMdClose /> : <IoIosArrowDown />}

        {/* Hiển thị khoảng giá đã chọn theo triệu */}
      </div>

      {isSliderOpen && (
        <div
          style={{
            position: "absolute",
            borderRadius: "5px",
            top: "80%",
            left: 540,
            backgroundColor: "white",
            border: "1px solid #ddd",
            width: "330px",
            padding: "30px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            maxHeight: "300px", // Thay đổi chiều cao tối đa nếu cần
            overflowY: "auto",
          }}
        >
          {/* Thanh kéo Min */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "8px",
              backgroundColor: "#ddd",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                backgroundColor: "#F97300",
                borderRadius: "5px",
                width: `${getPercent(minPrice, 0, 10000000)}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max="10000000"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e)}
              step="100000"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "8px",
                backgroundColor: "transparent",
                borderRadius: "5px",
                appearance: "none",
                outline: "none",
                zIndex: 1,
              }}
              className="slider-min"
            />
          </div>

          {/* Thanh kéo Max */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "8px",
              backgroundColor: "#ddd",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                backgroundColor: "#F97300",
                borderRadius: "5px",
                width: `${getPercent(maxPrice, 0, 10000000)}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max="10000000"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e)}
              step="100000"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "8px",
                backgroundColor: "transparent",
                borderRadius: "5px",
                appearance: "none",
                outline: "none",
                zIndex: 1,
              }}
              className="slider-max"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
            }}
          >
            <span>0 VND</span>
            <span>10.000.000 VND</span>
          </div>
        </div>
      )}

      {/* Thêm CSS để thay đổi màu nút kéo */}
      <style jsx>{`
        .slider-min::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #f97300;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider-min::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #f97300;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider-max::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #f97300;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider-max::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #f97300;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default PriceSlider;
