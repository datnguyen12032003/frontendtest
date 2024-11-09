import React from 'react';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig'; // Import your axios instance
import { getToken } from '../Login/app/static'; // Import the function to get the token

const MainImageModal = ({ isOpen, onClose, images, roomId, onSelectImage }) => {
  if (!isOpen) return null;

  const handleSelectImage = async (imageId) => {
    try {
      const token = getToken();

      // Call the API to set the main image
      const response = await axios.put(`/upload/set-main/${roomId}/${imageId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the images state by setting the selected image as main
      const updatedImages = images.map((image) => ({
        ...image,
        main: image._id === imageId, // Set selected image as main, others to false
      }));

      // Call the provided onSelectImage function to update state in parent component
      await onSelectImage(updatedImages);
      toast.success('Đã cập nhật ảnh chính thành công!');
      onClose(); // Close modal after selection
    } catch (err) {
      toast.error('Cập nhật ảnh chính thất bại.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Chọn Ảnh Chính</h2>
        <div className="max-h-80 overflow-y-auto"> {/* Thêm lớp để giới hạn chiều cao và cho phép cuộn */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image._id}
                onClick={() => handleSelectImage(image._id)}  // Attach the click event to the div
                className="relative group rounded-lg overflow-hidden transition transform hover:scale-105 cursor-pointer"
              >
                <img
                  src={image.url}
                  alt="Room"
                  className={`w-full h-40 object-cover rounded-lg transition-all duration-300 transform ${
                    image.main ? 'border-[6px] border-green-500' : 'border-[6px] border-transparent'
                  } group-hover:shadow-lg group-hover:border-orange-500`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-orange-600 text-white py-2 px-6 rounded-full hover:bg-orange-700 transition-all duration-300 shadow-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainImageModal;
