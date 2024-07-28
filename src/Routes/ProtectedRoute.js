import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/UserContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  // useEffect(() => {
  //   console.log('ProtectedRoute - Current user:', user);
  //   console.log('ProtectedRoute - Allowed roles:', allowedRoles);
  // }, [user, allowedRoles]);

  if (user.auth === null) {
    console.log('ProtectedRoute - Auth is null, showing loading');
    return <div>Loading...</div>;
  }

  if (!user.auth) {
    console.log('ProtectedRoute - User not authenticated, redirecting to login');
    return <Navigate to="/home" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(`ProtectedRoute - User role ${user.role} not in allowed roles:`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('ProtectedRoute - Access granted');
  return <Outlet />;
};

export default ProtectedRoute;