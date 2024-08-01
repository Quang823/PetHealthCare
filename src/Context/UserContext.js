import React, { useEffect, useState, createContext, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ email: '', auth: null, role: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({
          email: decodedToken.User.map.email,
          auth: true,
          role: decodedToken.User.map.role,
        });
        console.log('User role set to:', decodedToken.User.map.role);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUser({ email: '', auth: false, role: '' });
      }
    } else {
      setUser({ email: '', auth: false, role: '' });
    }
  }, []);

  const loginContext = (email, token, role) => {
    setUser({ email, auth: true, role });
    localStorage.setItem("token", token);
    console.log('Login context called, user set to:', { email, auth: true, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('bookedSlots');
    localStorage.removeItem('currentBookingId');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('walletId');
    localStorage.removeItem('bookedInfo');
    localStorage.removeItem('user');
    localStorage.removeItem('bookingDetailId');
    setUser({ email: '', auth: false, role: '' });
    console.log('Logout called, user reset');
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};