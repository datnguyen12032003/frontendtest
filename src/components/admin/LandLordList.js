import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../Login/app/static";
import ReactPaginate from "react-paginate";

const LandlordList = () => {
  const [landlords, setLandlords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [landlordsPerPage] = useState(10);

  useEffect(() => {
    const fetchLandlords = async () => {
      try {
        const token = getToken();
        const response = await axios.get("/landlords", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLandlords(response.data);
      } catch (err) {
        // setError("Không thể lấy danh sách chủ nhà.");
        toast.error("Không thể lấy danh sách chủ nhà.");
      } finally {
        setLoading(false);
      }
    };

    fetchLandlords();
  }, []);

  const handleDelete = async (landlordId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chủ nhà này không?")) {
      try {
        const token = getToken();
        await axios.delete(`/landlords/${landlordId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Đã xóa chủ nhà thành công.");
        setLandlords((prevLandlords) => prevLandlords.filter((landlord) => landlord._id !== landlordId));
      } catch (err) {
        toast.error("Xóa chủ nhà thất bại.");
      }
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
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

  const indexOfLastLandlord = (currentPage + 1) * landlordsPerPage;
  const indexOfFirstLandlord = indexOfLastLandlord - landlordsPerPage;
  const currentLandlords = landlords.slice(indexOfFirstLandlord, indexOfLastLandlord);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Danh Sách Chủ Nhà</h1>
      <Link to="/create-land-lord">
        <button className="mb-4 bg-orange-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-300 ease-in-out transform hover:scale-105">
          Tạo Chủ Nhà Mới
        </button>
      </Link>
  
      {landlords.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          Không có chủ nhà nào. Hãy tạo mới!
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center ml-6 w-[100%]">
            <p className="ml-[120px] font-semibold text-gray-800 w-[30%]">Họ và tên</p>
            <p className="font-semibold text-gray-800 w-[20%]">Email</p>
            <p className="font-semibold text-gray-800 w-[20%]">Số điện thoại</p>
            <p className="font-semibold text-gray-800">Ngày tạo</p>
          </div>
          {currentLandlords.map((landlord) => (
            <Link
              key={landlord._id}
              to={`/land-lord-list/${landlord._id}`}
              className="flex items-center bg-white p-4 rounded-lg hover:shadow-lg transition duration-300 ease-in-out hover:bg-gray-50 relative group"
            >
              <img
                src={landlord.avatarUrl || "default-avatar.jpg"}
                alt={landlord.fullname}
                className="w-20 h-20 object-cover rounded-full border-2 border-orange-500"
              />
              <div className="flex items-center ml-6 w-[100%]">
                <h2 className="text-gray-600 w-[30%]">{landlord.fullname}</h2>
                <p className="text-gray-600 w-[27%]"> {landlord.email}</p>
                <p className="text-gray-600 w-[22%]"> {landlord.phone}</p>
                <p className="text-gray-600">
                  <span>{new Date(landlord.created_at).toLocaleDateString()}</span>
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(landlord._id);
                  }}
                  className="ml-20 bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 hidden group-hover:block"
                >
                  Xóa
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
  
      <div className="flex justify-center mt-8">
        <ReactPaginate
          previousLabel={"Trước"}
          nextLabel={"Sau"}
          pageCount={Math.ceil(landlords.length / landlordsPerPage)}
          onPageChange={handlePageChange}
          containerClassName={"flex space-x-2"}
          pageClassName={"px-3 py-1 border rounded-lg"}
          pageLinkClassName={"text-gray-700"}
          previousClassName={"px-3 py-1 border rounded-lg"}
          nextClassName={"px-3 py-1 border rounded-lg"}
          activeClassName={"bg-orange-500 text-white"}
        />
      </div>
    </div>
  );
  
};

export default LandlordList;
