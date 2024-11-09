import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../Login/app/static';
import { useParams, useNavigate } from 'react-router-dom';

// Danh sách các quận và phường ở Cần Thơ
const districts = [
  { name: 'Quận Ninh Kiều', wards: ['Phường An Khánh', 'Phường An Hội', 'Phường An Lạc', 'Phường An Phú', 'Phường Hưng Lợi'] },
  { name: 'Quận Cái Răng', wards: ['Phường Hưng Phú', 'Phường Lê Bình', 'Phường Thường Thạnh'] },
  { name: 'Quận Bình Thủy', wards: ['Phường Bình Thủy', 'Phường Bùi Hữu Nghĩa', 'Phường Thới An'] },
  { name: 'Quận Ô Môn', wards: ['Phường Châu Văn Liêm', 'Phường Long Hòa', 'Phường Thới Long'] },
  { name: 'Huyện Cờ Đỏ', wards: ['Xã Trung An', 'Xã Đông Hiệp', 'Xã Thới Hưng'] },
  { name: 'Huyện Phong Điền', wards: ['Xã Bình Thành', 'Xã Nhơn Ái', 'Xã Tân Thới'] },
  { name: 'Huyện Thới Lai', wards: ['Xã Thới Lai', 'Xã Thới Tân', 'Xã Thới Hưng'] }
];

const CreateRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    landlord_id: id,
    name: '',
    address: [{ detail: '', ward: '', district: 'Quận Ninh Kiều', city: 'Cần Thơ' }],
    room_type: 'Single',
    price: '',
    description: '',
    room_quantity: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address')) {
      const index = parseInt(name.split('[')[1].split(']')[0]);
      const fieldName = name.split(']')[1].slice(1);
      const updatedAddresses = [...formData.address];
      updatedAddresses[index][fieldName] = value;
      setFormData({
        ...formData,
        address: updatedAddresses,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      const response = await axios.post(`/rooms/create`, {
        ...formData,
        landlord_id: id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Tạo phòng thành công!');
      navigate(`/land-lord-list/${id}`);
    } catch (err) {
      setError('Tạo phòng không thành công.');
      toast.error('Tạo phòng không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Tạo Phòng</h1>
      {loading && <div className="text-center py-8 text-xl text-blue-500">Đang tải...</div>}
      {error && <div className="text-center py-8 text-xl text-red-600">Lỗi: {error}</div>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 text-lg font-semibold mb-2">Tên Phòng</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        {formData.address.map((addr, index) => (
          <div key={index} className="mb-6">
              <label htmlFor={`address[${index}].city`} className="block text-gray-700 text-lg font-semibold mb-2">Thành Phố</label>
            <input
              type="text"
              id={`address[${index}].city`}
              name={`address[${index}].city`}
              value={addr.city}
              onChange={handleChange}
              className="mb-6 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
              required
              readOnly
            />

<label htmlFor={`address[${index}].district`} className="block text-gray-700 text-lg font-semibold mb-2">Quận/Huyện</label>
            <select
              id={`address[${index}].district`}
              name={`address[${index}].district`}
              value={addr.district}
              onChange={handleChange}
              className="mb-6 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
              required
            >
              {districts.map((district, i) => (
                <option key={i} value={district.name}>{district.name}</option>
              ))}
            </select>

            <label htmlFor={`address[${index}].ward`} className="block text-gray-700 text-lg font-semibold mb-2">Phường/Xã</label>
            <select
              id={`address[${index}].ward`}
              name={`address[${index}].ward`}
              value={addr.ward}
              onChange={handleChange}
              className="mb-6 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
              required
            >
              {districts.find(d => d.name === addr.district)?.wards.map((ward, i) => (
                <option key={i} value={ward}>{ward}</option>
              ))}
            </select>
     
          
            <label htmlFor={`address[${index}].detail`} className="block text-gray-700 text-lg font-semibold mb-2">Chi Tiết Địa Chỉ</label>
            <input
              type="text"
              id={`address[${index}].detail`}
              name={`address[${index}].detail`}
              value={addr.detail}
              onChange={handleChange}
              className=" w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
              required
            />

          </div>
        ))}
        <div className="mb-6">
          <label htmlFor="room_type" className="block text-gray-700 text-lg font-semibold mb-2">Loại Phòng</label>
          <select
            id="room_type"
            name="room_type"
            value={formData.room_type}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          >
            <option value="Single">Đơn</option>
            <option value="Double">Đôi</option>
            <option value="Shared">Chia Sẻ</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="price" className="block text-gray-700 text-lg font-semibold mb-2">Giá</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 text-lg font-semibold mb-2">Mô Tả</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="room_quantity" className="block text-gray-700 text-lg font-semibold mb-2">Số Lượng Phòng</label>
          <input
            type="number"
            id="room_quantity"
            name="room_quantity"
            value={formData.room_quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Tạo Phòng
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;
