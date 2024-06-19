import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// @function  UserContext
const UserContext = React.createContext({ name: '', auth: false });

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
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);
  const loginContext = (email, token) => {
    setUser((user) => ({
      email: email,
      auth: true,
    }));

    localStorage.setItem("token", token);
    //   localStorage.setItem("email", email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("data");
    localStorage.removeItem("user");
    localStorage.removeItem("bookedInfo");
    localStorage.removeItem("selectedDate");
    setUser((user) => ({
      email: '',
      auth: false,
    }));
  };

  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext, UserProvider };