
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import AdminDashboard from '../Components/Admin/AdminDashboard.jsx';
const AdminRoute = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<AdminDashboard />} />
            </Routes>
        </>
    )
}

export default AdminRoute;
