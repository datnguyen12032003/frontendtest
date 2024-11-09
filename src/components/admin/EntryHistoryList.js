import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig"; // Điều chỉnh đường dẫn cho axios config của bạn
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getToken } from "../Login/app/static"; // Thêm đường dẫn chính xác tới file chứa getToken
import ReactPaginate from "react-paginate"; // Thêm ReactPaginate

const EntryHistoryList = () => {
  const [entryHistory, setEntryHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [entriesPerPage] = useState(10); // Số lượng mục trên mỗi trang

  useEffect(() => {
    const fetchEntryHistory = async () => {
      try {
        const token = getToken(); // Lấy token từ hàm getToken
        const response = await axios.get("/entry", {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });
        setEntryHistory(response.data);
        setLoading(false);
      } catch (error) {
        setError("Tải lịch sử hoạt động thất bại.");
        setLoading(false);
        toast.error("Tải lịch sử hoạt động thất bại.");
      }
    };

    fetchEntryHistory();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // Cập nhật trang hiện tại khi người dùng click
  };

  const offset = currentPage * entriesPerPage;
  const currentEntries = entryHistory.slice(offset, offset + entriesPerPage);
  const pageCount = Math.ceil(entryHistory.length / entriesPerPage);

  if (loading) {
    return (
      <div className="text-center text-lg font-medium py-6">Đang tải...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold py-6">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-extrabold text-center mb-8">
        Lịch Sử Hoạt Động
      </h1>
      {entryHistory.length === 0 ? (
        <div className="text-center text-lg text-gray-600">
          Không tìm thấy lịch sử hoạt động
        </div>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-4 text-left">Tên quản trị viên</th>
                <th className="px-6 py-4 text-left">Loại</th>
                <th className="px-6 py-4 text-left">Mô tả</th>
                <th className="px-6 py-4 text-left">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.map((entry) => (
                <tr
                  key={entry._id}
                  className="border-t border-gray-300 hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4">{entry.admin.fullname}</td>
                  <td className="px-6 py-4">{entry.entry_type}</td>
                  <td className="px-6 py-4">{entry.description}</td>
                  <td className="px-6 py-4">
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-center">
            <ReactPaginate
              previousLabel={"Trước"}
              nextLabel={"Sau"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"flex space-x-2"}
              pageClassName={"px-3 py-1 border rounded-lg"}
              pageLinkClassName={"text-gray-700"} // Thêm class cho liên kết trang
              activeClassName={"bg-orange-500 text-white"}
              previousClassName={"px-3 py-1 border rounded-lg"}
              nextClassName={"px-3 py-1 border rounded-lg"}
              breakClassName={"px-3 py-1 border rounded-lg"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EntryHistoryList;
