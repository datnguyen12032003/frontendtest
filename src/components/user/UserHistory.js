import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig'; // Import axios instance
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { getToken } from '../Login/app/static'; // Import getToken function

const UserHistory = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [payments, setPayments] = useState([]); // Initialize payments as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserRevenue = async () => {
    try {
      const token = getToken(); // Get the token from your auth method
      const headers = { Authorization: `Bearer ${token}` }; // Set the headers

      const response = await axios.get('/revenue/user', { headers });
      setTotalRevenue(response.data.total || 0); // Update total revenue
      setPayments(response.data.payments || []); // Ensure payments is always an array
      setLoading(false);
    } catch (error) {
      setError('Failed to load user revenue.');
      setLoading(false);
      toast.error('Failed to load user revenue.');
    }
  };

  useEffect(() => {
    fetchUserRevenue();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-medium py-6">Loading...</div>;
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
      <ToastContainer /> {/* Toast for error messages */}
     
      {/* Displaying detailed payment history */}
      <h2 className="text-2xl font-bold mb-4">Lịch Sử Thanh Toán</h2>
      {payments.length === 0 ? (
        <div className="text-center text-gray-600">Không có giao dịch nào</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-4 text-left">Tên Phòng</th> {/* Added Room Name column */}
              <th className="px-6 py-4 text-left">Mã Đơn Hàng</th>
              <th className="px-6 py-4 text-left">Số Tiền</th>
              <th className="px-6 py-4 text-left">Mô Tả</th>
              <th className="px-6 py-4 text-left">Trạng Thái</th>
              <th className="px-6 py-4 text-left">Ngày Thanh Toán</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="border-t border-gray-300 hover:bg-gray-100 transition">
                <td className="px-6 py-4">{payment.roomName || 'N/A'}</td> {/* Display room name */}
                <td className="px-6 py-4">{payment.order_code || 'N/A'}</td>
                <td className="px-6 py-4">{payment.paymentAmount} VNĐ</td>
                <td className="px-6 py-4">{payment.paymentDescription || 'Không có mô tả'}</td>
                <td className="px-6 py-4">{payment.paymentStatus}</td>
                <td className="px-6 py-4">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserHistory;
