import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Login/app/static';

const CreateLandlord = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const birthDate = new Date(dayOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    if (age < 18) {
      toast.error('Bạn phải ít nhất 18 tuổi để tạo tài khoản chủ nhà.');
      return;
    }
  
    const token = getToken();
  
    try {
      const response = await axios.post('/landlords', {
        fullname,
        email,
        phone,
        address,
        gender,
        dayOfBirth,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Tạo chủ nhà thành công!', response.data);
      toast.success('Tạo chủ nhà thành công!');
      // Clear form fields after successful submission
      setFullname('');
      setEmail('');
      setPhone('');
      setAddress('');
      setGender('');
      setDayOfBirth('');
    } catch (error) {
      console.error('Lỗi khi tạo chủ nhà:', error);
      toast.error('Không thể tạo chủ nhà.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center">Tạo Chủ Nhà</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="mb-6">
          <label htmlFor="fullname" className="block text-gray-700 text-lg font-semibold mb-2">Họ và tên</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-lg font-semibold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-gray-700 text-lg font-semibold mb-2">Số điện thoại</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="address" className="block text-gray-700 text-lg font-semibold mb-2">Địa chỉ</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="gender" className="block text-gray-700 text-lg font-semibold mb-2">Giới tính</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          >
            <option value="" disabled>Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="dayOfBirth" className="block text-gray-700 text-lg font-semibold mb-2">Ngày sinh</label>
          <input
            type="date"
            id="dayOfBirth"
            value={dayOfBirth}
            onChange={(e) => setDayOfBirth(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Tạo Chủ Nhà
        </button>
      </form>
    </div>
  );
};

export default CreateLandlord;
