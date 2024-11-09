import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext ';

const PrivateRoute = ({ children, requireAdmin }) => {
  const { user } = useAuth();

  // Kiểm tra nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra quyền admin
  if (requireAdmin && !user.admin) {
    // Nếu yêu cầu quyền admin nhưng user không phải admin
    return <Navigate to="/" />;
  }

  // Cho phép truy cập nếu đã đăng nhập và có quyền hợp lệ
  return children;
};

export default PrivateRoute;
