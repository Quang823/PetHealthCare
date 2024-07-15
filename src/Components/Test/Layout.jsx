// src/Components/Test/Layout/Layout.js
import React from 'react';
import SideBar from '../../Components/Test/SideBar/SideBar';
import { Outlet } from 'react-router-dom';

const TestAdminLayout = () => {
    return (
        <div className="testAdminLayout">
            <SideBar />
            <div className="mainContent">
                <Outlet />
            </div>
        </div>
    );
};

export default TestAdminLayout;
