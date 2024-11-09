import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../Login/app/static';
import NotificationModal from './NotificationModal'; // Import NotificationModal

const QRCodeModal = ({ isOpen, onClose, roomId, paymentAmount }) => {
  const [timeLeft, setTimeLeft] = useState(3000);
  const [paymentLink, setPaymentLink] = useState(''); // Để hiển thị link thanh toán
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');


  const createPayment = async () => {
    try {
      const token = getToken();
      const userResponse = await axios.get(`http://localhost:3000/users/getId/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userId = userResponse.data._id;
      const paymentResponse = await axios.post(
        `http://localhost:3000/payments/create/${roomId}`,
        { userId, paymentAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Payment link creation was successful
      setPaymentLink(paymentResponse.data); // Set the payment link
      setError('');
      // setPaymentStatus('Thành công! Liên kết thanh toán đã được tạo.');
      setNotificationMessage('Liên kết đã được tạo.');
    } catch (error) {
      console.error('Error creating payment:', error);
  
      // Error occurred during payment creation
      setError('Không tìm thấy người dùng hoặc có lỗi xảy ra.');
      setNotificationMessage('Tạo liên kết thất bại. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPaymentLink(''); // Reset payment link khi đóng modal
      setError('');
      setTimeLeft(60);
      setPaymentStatus('');
      setNotificationMessage(''); // Reset notification message
    }

    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPayment();
    console.log('Payment link created 1');
  };

  const closeNotification = () => {
    setNotificationMessage(''); // Close the notification
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 font-bold text-center">Liên kết thanh toán cho phòng</h2>
        
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Tạo liên kết thanh toán
          </button>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex justify-center mb-6">
          {paymentLink ? (
            <a 
              href={paymentLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 underline"
            >
              {paymentLink}
            </a>
          ) : (
            <p className="text-gray-500">Đang tải liên kết thanh toán...</p>
          )}
        </div>

        <p className="text-center text-gray-700 mb-4">
          Thời gian còn lại: <span className="font-bold text-red-500">{timeLeft}s</span>
        </p>

        <div className="flex justify-center">
        

          <button
            onClick={onClose}
            className="py-2 px-6 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            Đóng
          </button>
        </div>

        {paymentStatus && <p className="text-center text-blue-500 mt-4">{paymentStatus}</p>}

        {/* Notification Modal */}
        <NotificationModal 
          message={notificationMessage} 
          onClose={closeNotification} 
        />
      </div>
    </div>
  );
};

export default QRCodeModal;
