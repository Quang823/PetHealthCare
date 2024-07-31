import React, { useState ,useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Routes, Route, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './Home';
import Sidebar from './SideBar';
import Slotdoctor from './Slotdoctor';
import VetExaminationForm from './VetExaminationForm';

const Doctor = () => {
    const [toggle, setToggle] = useState(true);
    const [userName, setUserName] = useState('');
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken && decodedToken.User) {
            setUserName(decodedToken.User.map.name);
          }
        } catch (err) {
          console.error('Invalid token:', err);
        }
      }
    }, []);
    const Toggle = () => {
      setToggle(!toggle);

    };

    return (
        <div className='container-fluid bg-secondary min-vh-100'>
      
          <div className='row'>
            {toggle && (
              <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
              <span className='brand-name fs-4'>WELCOME <br />{userName}</span>
                <Sidebar />
              </div>
            )}
            {toggle && <div className='col-4 col-md-2'></div>}
            <div className='col bg-white'>
              <Routes>
                <Route path="/" element={<Home Toggle={Toggle} />} />
                <Route path="slotdoctor" element={<Slotdoctor />} />
                {/* Add other routes for doctor components here */}
                <Route path="examineDoctor" element={<VetExaminationForm />} />
              </Routes>
            </div>
          </div>
        </div>
    );
};

export default Doctor; 