import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../../Components/Test/SideBar/SideBar';
import Top from './Body/Top/Top';
import './TestAminLayout.scss'
const TestAdminLayout = () => {
  return (
    <div className="testAdminLayout">
      <SideBar />
      <div className="mainContent">
        
        <Outlet /> {/* Outlet for nested routes */}
      </div>
    </div>
  );
};

export default TestAdminLayout;
