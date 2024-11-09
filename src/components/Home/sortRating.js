import { useState, useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { useRoom } from "../context/RoomContext";
const SortByRating = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setRating } = useRoom();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle click outside to close dropdown
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

  // Handle mouse over stars
  const handleMouseOver = (rating) => {
    setHoveredStar(rating);
  };

  // Handle mouse leave stars
  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  // Handle click on star
  const handleClickStar = (rating) => {
    setRating(rating);
    setSelectedRating(rating);
    setIsDropdownOpen(false); // Close the dropdown after selecting
  };

  return (
    <div className="relative w-[280px]" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className="justify-between shadow-md"
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
      >
        <span className="font-semibold">
          {selectedRating > 0 ? (
            <div className="flex items-center gap-[10px]">
              <FaStar fill="#F97300" className="w-[24px] h-[24px]" />
              {selectedRating}
            </div>
          ) : (
            <div className="flex items-center gap-[10px]">
              <FaStar fill="#F97300" className="w-[24px] h-[24px]" />
              Đánh giá
            </div>
          )}
        </span>
        {isDropdownOpen ? <IoMdClose /> : <IoIosArrowDown />}
      </div>

      {isDropdownOpen && (
        <div className="absolute bg-white border rounded mt-2 p-4 shadow-md w-full">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <FaStar
                key={rating}
                size={30}
                className="cursor-pointer"
                color={
                  (hoveredStar || selectedRating) >= rating
                    ? "#ffc107"
                    : "#e4e5e9"
                }
                onMouseOver={() => handleMouseOver(rating)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClickStar(rating)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortByRating;
