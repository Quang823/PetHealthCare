import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import AdminDashboard from '../Components/Admin/AdminDashboard';
import CustomerList from '../Components/Admin/User/UserList';
import ServicePet from '../Components/Admin/Service/ServicePet';

const AdminLayout = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<AdminDashboard />} />
                <Route path="/customers" element={<CustomerList/>} />
                <Route path='/servicePet' element={<ServicePet />} />
            </Routes>
        </>
    )
}

export default AdminLayout;
