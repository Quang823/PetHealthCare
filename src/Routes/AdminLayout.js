import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import AdminDashboard from '../Components/Admin/AdminDashboard';
const AdminLayout = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<AdminDashboard />} />
            </Routes>
        </>
    )
}

export default AdminLayout;
