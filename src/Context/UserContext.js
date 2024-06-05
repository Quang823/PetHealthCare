import React from 'react';

// @function  UserContext
const UserContext = React.createContext({ name: '', auth: false });

// @function  UserProvider
// Create function to provide UserContext
const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({ name: '', auth: false });

  const loginContext = (email, data) => {
    setUser((user) => ({
      email: email,
      auth: true,
    }));
    localStorage.setItem("data", data);
 //   localStorage.setItem("email", email);
  };

  const logout = () => {
    localStorage.removeItem("data");
  //  localStorage.removeItem("email");
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