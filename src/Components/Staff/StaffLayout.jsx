import './Staff.scss';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Nav from './Nav';

const StaffLayout = () => {
  const [toggle, setToggle] = useState(true);

  const Toggle = () => {
    setToggle(!toggle);
  };

  return (
    <div className='container-fluid  min-vh-100'>
      <div className='row'>
        {toggle && (
          <div className=''>
            <Sidebar />
          </div>
        )}
        {toggle && <div className='col-4 col-md-2'></div>}
        <div className='col'>
          {/* <Nav Toggle={Toggle} /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
