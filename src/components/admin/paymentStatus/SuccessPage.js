import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const status = searchParams.get('status');

  console.log("orderCode", orderCode);
  console.log("status", status);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/payments/check/${orderCode}`, { status: 'SUCCESS' });
        console.log(response.data.message);
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    checkPaymentStatus();
  }, [orderCode]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Thanh toán thành công!</h2>
        <p>Mã đơn hàng: {orderCode}</p>
        <p>Trạng thái: {status}</p>
        <p>Cảm ơn bạn đã thanh toán. Giao dịch của bạn đã được hoàn tất.</p>
        <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Quay lại trang chủ</a>
      </div>
    </div>
  );
};

export default SuccessPage;
