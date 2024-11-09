const NotificationModal = ({ message, onClose }) => {
    if (!message) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 scale-105 hover:scale-110">
          <h3 className="text-lg font-bold mb-2">Thông báo</h3>
          <p className="mb-4">{message}</p>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  };
  
  export default NotificationModal;
  