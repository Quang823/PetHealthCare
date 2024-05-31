import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './Components/LoginRegisterForm/LoginForm';
import RegisterForm from './Components/LoginRegisterForm/RegisterForm';
import Home from './Components/Home/HomePage';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<LoginForm />} /> {/* Redirect to login by default */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
