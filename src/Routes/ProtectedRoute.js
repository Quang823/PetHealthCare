import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './../Context/UserContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useContext(UserContext);
  console.log("User in ProtectedRoute:", user); 

  if (!user || !user.auth) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;

  }

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;