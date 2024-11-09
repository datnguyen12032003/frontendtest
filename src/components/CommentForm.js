import React, { useState } from "react";
import axios from "../axiosConfig"; // Update with your axios config
import { toast } from "react-toastify";
import { getToken } from '../components/Login/app/static';

const CommentForm = ({ roomId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5); // Default rating

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await axios.post(`/comments/${roomId}`, {
        content,
        rating,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Comment added successfully!");
      onCommentAdded(response.data); // Notify parent to update comments
      setContent(""); // Clear the input
      setRating(5); // Reset rating
    } catch (error) {
      toast.error("Failed to add comment.");
      console.error("Error adding comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          className="border border-gray-300 rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
      </div>
      <div className="flex items-center mb-4">
        <label className="mr-2 text-gray-700">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border border-gray-300 rounded p-1 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Đăng bình luận
      </button>
    </form>
  );
};

export default CommentForm;
