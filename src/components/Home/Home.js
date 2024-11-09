import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Home1 from "../../assets/Home.jpg";
import { RiFindReplaceLine } from "react-icons/ri";

import Location from "./sortLocation.js";
import { Link } from "react-router-dom";
import { HomeList } from "./homesList.js";
import PriceSlider from "./sortPrice.js";
import SortByRating from "./sortRating.js";
import { useRoom } from "../context/RoomContext.js";
const items = [
  { id: 1, name: "Product A", rating: 3 },
  { id: 2, name: "Product B", rating: 5 },
  { id: 3, name: "Product C", rating: 2 },
  { id: 4, name: "Product D", rating: 4 },
  { id: 5, name: "Product E", rating: 1 },
];

const Home = () => {
  const [roleAdmin, setRoleAdmin] = useState();
  const { SortRoom } = useRoom();

  return (
    <div>
      <div style={{ width: "100%", marginBottom: "150px" }}>
        <div style={{ position: "relative", width: "100%", height: "auto" }}>
          <img
            style={{
              width: "100%",
              height: "470px", // Để duy trì tỉ lệ ảnh
              display: "block", // Xóa khoảng trống từ inline elements
            }}
            src={Home1}
            alt="Home"
          />
          <div
            style={{
              position: "absolute",
              width: "35%",
              top: "50%",
              left: "5%",
              margin: "5px",
              transform: "translateY(-50%)",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "43px",
              fontWeight: "800",
              color: "white",
            }}
          >
            <p>Tìm trọ dễ dàng,</p>
            <p> nhanh chóng,</p>
            <p> đảm bảo chất lượng.</p>
            <p
              style={{
                fontFamily: "sans-serif",
                fontSize: "16px",
                fontWeight: "500",
                paddingTop: "15px",
                width: "70%",
              }}
            >
              Website tìm trọ của chúng tôi giúp bạn dễ dàng tìm kiếm và so sánh
              phòng trọ theo vị trí, giá cả và diện tích. Bạn có thể nhanh chóng
              chọn được nơi ở phù hợp.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            justifyContent: "center",

            marginBottom: "20px",
          }}
        >
          <div
            className="gap-[15px] py-[15px] justify-center border bg-orange-600 border-orange-600 shadow-md"
            style={{
              display: "flex",
              alignItems: "center",

              marginTop: "20px",
              position: "absolute",
              borderRadius: "7px",
              height: "130px",
              width: "88%",
            }}
          >
            <label className="font-bold text-[35px] text-white flex">
              <RiFindReplaceLine className="w-[30px] h-[30px]" />
              HomifyMe
            </label>
            <Location />
            <PriceSlider />
            <SortByRating />{" "}
            <button
              onClick={SortRoom}
              className="p-4 bg-blue-600 rounded-[6px] px-[40px] hover:bg-blue-400 text-white flex items-center justify-center font-semibold gap-3"
            >
              Tìm kiếm <RiFindReplaceLine className="w-[24px] h-[24px]" />
            </button>
          </div>
        </div>
        <div
          className=" p-6 rounded-md mb-6"
          style={{
            marginTop: "70px",
          }}
        >
          <div
            className="w-full h-[400px]"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15715.163736330007!2d105.744152!3d10.0313275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a088276b97c2e7%3A0xf647b03f3d1fb8d4!2zVG_DoGkgR2FtbWEgxJDEgEggRlBUIC0gQ-G7qSBQaOG6p24gVOG7qyBUaMOgbmggQ8O0bmcgVOG7qyBGUFQ!5e0!3m2!1svi!2s!4v1695484753517!5m2!1svi!2s"
              width="91%"
              height="90%"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen=""
              loading="lazy"
              title="Tòa Gamma ĐH FPT Cần Thơ"
            />
          </div>
        </div>

        {/* Danh sách trọ */}
        <HomeList />
      </div>
    </div>
  );
};

export default Home;
