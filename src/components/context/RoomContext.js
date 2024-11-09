import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken } from "../Login/app/static"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [districtName, setDistrictName] = useState();
  const [wardName, setWardName] = useState();
  const enabled = true;
  const [city, setCity] = useState(""); // Thành phố mặc định
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [wards, setWards] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(""); // Lưu vị trí đầy đủ
  const [room, setRoom] = useState();
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [rating, setRating] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCities(response.data);
        console.log(response.data[0]);

        // Tìm thành phố "Cần Thơ" và đặt làm mặc định
        const defaultCity = response.data.find(
          (city) => city.Name === "Thành phố Cần Thơ"
        );
        if (defaultCity) {
          setCity(defaultCity.Id); // Đặt Id của Cần Thơ làm mặc định
          setDistricts(defaultCity.Districts); // Đặt danh sách quận huyện của Cần Thơ
        }
      } catch (error) {
        console.error("Error fetching cities data:", error);
      }
    };
    fetchCities();
  }, []);
  const handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    setCity(selectedCityId);
    setDistrict("");
    setWard("");
    const selectedCity = cities.find((city) => city.Id === selectedCityId);
    if (selectedCity) {
      setDistricts(selectedCity.Districts);
    }
    updateSelectedLocation(
      event.target.options[event.target.selectedIndex].text,
      "",
      ""
    );
  };

  const handleDistrictChange = (event) => {
    const selectedDistrictId = event.target.value;
    setDistrict(selectedDistrictId);
    setWard("");
    const selectedDistrict = districts.find(
      (district) => district.Id === selectedDistrictId
    );
    if (selectedDistrict) {
      setWards(selectedDistrict.Wards);
    }
    updateSelectedLocation(
      cities.find((city) => city.Id === city)?.Name || "",
      event.target.options[event.target.selectedIndex].text,
      ""
    );
  };

  const handleWardChange = (event) => {
    setWard(event.target.value);
    updateSelectedLocation(
      cities.find((city) => city.Id === city)?.Name || "",
      districts.find((district) => district.Id === district)?.Name || "",
      event.target.options[event.target.selectedIndex].text
    );
  };

  const updateSelectedLocation = (cityName, districtName, wardName) => {
    let location = "";
    if (cityName) location += cityName;
    if (districtName) {
      location += `${districtName}`;
      setDistrictName(districtName);
    }
    if (wardName) {
      location += `${wardName}`;
      setWardName(wardName);
    }

    // Nếu chuỗi vị trí dài hơn 30 ký tự thì cắt ngắn lại
    const maxLength = 30;
    if (location.length > maxLength) {
      location = location.slice(0, maxLength) + "...";
    }

    setSelectedLocation(location);
  };
  console.log(minPrice);
  console.log(maxPrice);

  const SortRoom = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/rooms/sort-all",
        {
          ward: wardName,
          district: districtName,
          minPrice: minPrice,
          maxPrice: maxPrice,
          minRating: rating,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`, // Sử dụng token cho xác thực
          },
        }
      );
      console.log(response.data, "dâta");

      const data = response.data;
      setRoom(data);
      navigate("/roomList");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Set fetched profile data

  return (
    <RoomContext.Provider
      value={{
        room,
        handleCityChange,
        handleDistrictChange,
        handleWardChange,
        setSelectedLocation,
        city,
        district,
        ward,
        wards,
        districts,
        cities,
        selectedLocation,
        SortRoom,
        maxPrice,
        minPrice,
        rating,
        setRating,
        setMaxPrice,
        setMinPrice,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context == undefined) {
    throw new Error("Use post use out side post provider");
  }
  return context;
};
