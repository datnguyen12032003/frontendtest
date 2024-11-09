import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig'; // Import axios instance
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Login/app/static'; // Import getToken function
import ReactPaginate from 'react-paginate'; // Pagination component

const PaymentHistory = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Current page
  const [paymentsPerPage] = useState(10); // Entries per page

  const fetchAllPayments = async () => {
    try {
      const token = getToken(); // Get the token
      const headers = { Authorization: `Bearer ${token}` }; // Set the headers

      const res = await axios.get('/revenue/all', { headers });
      setAllPayments(res.data);
    } catch (error) {
      toast.error('Failed to fetch payment history');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllPayments();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // Update current page when clicked
  };

  const offset = currentPage * paymentsPerPage;
  const currentPayments = allPayments.slice(offset, offset + paymentsPerPage);
  const pageCount = Math.ceil(allPayments.length / paymentsPerPage);

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-3xl font-extrabold text-center mb-8">
        Lịch Sử Thanh Toán
      </h1>

      {allPayments.length === 0 ? (
        <div className="text-center text-lg text-gray-600">
          Không có lịch sử thanh toán
        </div>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-4 text-left">Mã Đơn Hàng</th>
                <th className="px-6 py-4 text-left">Tên Người Dùng</th>
                <th className="px-6 py-4 text-left">Tên Phòng</th>
                <th className="px-6 py-4 text-left">Số Tiền</th>
                <th className="px-6 py-4 text-left">Trạng Thái Thanh Toán</th>
                <th className="px-6 py-4 text-left">Ngày Thanh Toán</th>
              </tr>
            </thead>
            <tbody>
              {currentPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-t border-gray-300 hover:bg-gray-100 transition"
                >
                  <td className="px-6 py-4">{payment.order_code}</td>
                  <td className="px-6 py-4">{payment.userName}</td>
                  <td className="px-6 py-4">{payment.roomName}</td>
                  <td className="px-6 py-4">{payment.paymentAmount} VNĐ</td>
                  <td className="px-6 py-4">{payment.paymentStatus}</td>
                  <td className="px-6 py-4">
                    {new Date(payment.paymentDate).toLocaleDateString()}
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
              pageLinkClassName={"text-gray-700"} // Class for page links
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

export default PaymentHistory;
