import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/UserContext';

const PublicRoute = () => {
  const { user } = useAuth();

  if (user.auth) {
    // Nếu người dùng đã đăng nhập, chuyển hướng họ đến trang chủ hoặc dashboard
    return <Navigate to="/" replace />;
  }

  // Nếu người dùng chưa đăng nhập, cho phép truy cập vào route công khai
  return <Outlet />;
};

export default PublicRoute;