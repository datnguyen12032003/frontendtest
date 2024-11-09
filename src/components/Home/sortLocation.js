import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useRoom } from "../context/RoomContext";

function Location() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    selectedLocation,
    city,
    handleCityChange,
    district,
    handleDistrictChange,
    handleWardChange,
    ward,
    cities,
    wards,
    districts,
  } = useRoom();
  const dropdownRef = useRef(null); // Tạo ref cho dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        className="justify-between shadow-md "
        style={{
          display: "flex",
          alignItems: "center",

          backgroundColor: "white",
          padding: "10px",
          borderRadius: "6px",
          cursor: "pointer",
          width: "280px",
          height: "55px",
        }}
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <FaLocationDot
            fill="#F97300"
            className="w-[24px] h-[24px]"
            style={{ marginRight: "10px" }}
          />
          <span className="font-semibold">
            {selectedLocation || "Chọn vị trí"}
          </span>{" "}
        </div>
        {isDropdownOpen ? <IoMdClose /> : <IoIosArrowDown />}

        {/* Hiển thị vị trí đã chọn */}
      </div>
      {isDropdownOpen && (
        <div
          style={{
            position: "absolute",
            borderRadius: "5px",
            top: "80%",
            left: 245,
            backgroundColor: "white",
            border: "1px solid #ddd",
            width: "330px",
            padding: "30px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            maxHeight: "300px", // Thay đổi chiều cao tối đa nếu cần
            overflowY: "auto", // Thêm thanh cuộn nếu nội dung vượt quá chiều cao
          }}
        >
          <div style={{ marginBottom: "10px", width: "100%" }}>
            <select
              className="form-select form-select-sm mb-3"
              value={city}
              onChange={handleCityChange}
              style={{
                borderRadius: "5px",
                padding: "5px 10px",
                backgroundColor: "#fff7e6",
                height: "45px",
                fontSize: "16px",
                width: "100%",
              }}
            >
              <option value="">Chọn tỉnh thành</option>
              {cities.map((city) => (
                <option key={city.Id} value={city.Id}>
                  {city.Name}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm mb-3"
              value={district}
              onChange={handleDistrictChange}
              disabled={!city}
              style={{
                borderRadius: "5px",
                padding: "5px 10px",
                backgroundColor: "#fff7e6",
                height: "45px",
                fontSize: "16px",
                width: "100%",
              }}
            >
              <option value="">Chọn quận huyện</option>
              {districts.map((district) => (
                <option key={district.Id} value={district.Id}>
                  {district.Name}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              value={ward}
              onChange={handleWardChange}
              disabled={!district}
              style={{
                borderRadius: "5px",
                padding: "5px 10px",
                backgroundColor: "#fff7e6",
                height: "45px",
                fontSize: "16px",
                width: "100%",
              }}
            >
              <option value="">Chọn phường xã</option>
              {wards.map((ward) => (
                <option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default Location;
