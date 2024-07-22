import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from './../Context/UserContext';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const ProtectedRoute = ({ allowedRoles }) => {
  const navigate = useNavigate();
  const loginLink = (event) => {
    event.preventDefault();
    navigate('/login');
}
  const { user } = useContext(UserContext);
  console.log("User in ProtectedRoute:", user); 

  if (!user || !user.auth) {
    toast.error("You must login ");
    localStorage.removeItem('token');
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
   

  }

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  } else {
    localStorage.removeItem('token');
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;