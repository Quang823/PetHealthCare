import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './Home';
import Sidebar from './SideBar';
import Slotdoctor from './Slotdoctor';

const Doctor = () => {
    const [toggle, setToggle] = useState(true);

    const Toggle = () => {
      setToggle(!toggle);
    };

    return (
        <div className='container-fluid bg-secondary min-vh-100'>
          <div className='row'>
            {toggle && (
              <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
                <Sidebar />
              </div>
            )}
            {toggle && <div className='col-4 col-md-2'></div>}
            <div className='col bg-white'>
              <Routes>
                <Route path="/" element={<Home Toggle={Toggle} />} />
                <Route path="slotdoctor" element={<Slotdoctor />} />
                {/* Add other routes for doctor components here */}
              </Routes>
            </div>
          </div>
        </div>
    );
};

export default Doctor;