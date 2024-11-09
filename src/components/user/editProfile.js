import { useEffect, useState } from "react";
import { getToken } from "../Login/app/static";

function EditProfile({ setIsEditing }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setUser(data); // Set dữ liệu profile người dùng
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/edit-profile", {
        method: "PUT", // Phương thức PUT để chỉnh sửa thông tin
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`, // Thêm token để xác thực
        },
        body: JSON.stringify(user), // Truyền thông tin đã sửa trong body của request
      });

      if (!response.ok) {
        // Nếu phản hồi không thành công, in ra lỗi chi tiết từ server
        const errorData = await response.json();
        console.log("API Error:", errorData);
        throw new Error("Failed to update profile");
      }

      const result = await response.json(); // Lấy phản hồi JSON nếu thành công
      console.log("Profile updated successfully:", result);

      setIsEditing(false); // Thoát chế độ chỉnh sửa khi lưu thành công
      window.location.reload();
    } catch (error) {
      setError(error.message); // Hiển thị lỗi nếu có
      console.log("Error while updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullname"
            value={user?.fullname || ""}
            onChange={(e) => setUser({ ...user, fullname: e.target.value })}
            className="text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full text-[16px] font-semibold"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Số ĐT
          </label>
          <input
            type="text"
            name="phone"
            value={user?.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full text-[16px] font-semibold"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={user?.address || ""}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full text-[16px] font-semibold"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancelEdit}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveProfile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
