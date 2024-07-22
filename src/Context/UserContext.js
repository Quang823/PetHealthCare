import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// @function  UserContext
const UserContext = React.createContext({ name: '', auth: false, role: '' });

// @function  UserProvider
// Create function to provide UserContext
const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({ name: '', auth: false });
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.User) {
          setUser({
            name: decodedToken.User.map.name,
            email: decodedToken.User.map.email,
            auth: true,
            role: decodedToken.User.map.role, 
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);
  const loginContext = (email, token,role) => {
    setUser((user) => ({
      email: email,
      auth: true,
      role: role,
    }));

    localStorage.setItem("token", token);
    //   localStorage.setItem("email", email);
  };

  const logout = () => {
    localStorage.clear();
    setUser({ name: '', email: '', role: '', auth: false });
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserProvider };