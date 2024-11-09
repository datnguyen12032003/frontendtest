import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { getToken } from '../Login/app/static';
import { FaCloudUploadAlt } from "react-icons/fa";

const RoomImageUpload = () => {
  const { roomId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Vui lòng chọn ảnh để tải lên.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('room', file);
    });

    try {
      setLoading(true);
      const token = getToken();
      await axios.post(`upload/upload-room-image/${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Tải lên ảnh thành công!');
      setFiles([]);
    } catch (error) {
      toast.error('Không thể tải lên ảnh.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="rounded-lg">
        <ToastContainer />
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-start flex items-center">
          Tải lên hình ảnh phòng 
          <span className="ml-2 text-3xl text-orange-600">
            <FaCloudUploadAlt />
          </span>
        </h1>

        <div className="flex">
          <button
            onClick={handleUpload}
            className={`w-auto whitespace-nowrap px-6 h-[39px] mr-2 text-white border-gray-300 rounded-lg shadow-lg transition duration-300 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
            disabled={loading}
          >
            {loading ? 'Đang tải lên...' : 'Tải lên ảnh'}
          </button>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default RoomImageUpload;
