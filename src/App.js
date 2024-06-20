

import { ToastContainer, toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import './App.scss';
import Container from 'react-bootstrap/esm/Container';
import { Routes, Route, Link } from 'react-router-dom'
import { UserContext } from './Context/UserContext';
import AppRoute from './Routes/AppRoute';
import './ToastifyCustom.css';
import AdminLayout from './Routes/AdminLayout';
import CustomerList from './Components/Admin/User/UserList';
import ServicePet from './Components/Admin/Service/ServicePet';
import StaffLayout from './Components/Staff/StaffLayout';
import Doctor from './Components/Doctors/Doctor';
import Schedule from './Components/Doctors/Schedule/Schedule';
import BookingStaff from './Components/Staff/Booking/BookingStaff';
import HomeStaff from './Components/Staff/Home';
import Cage from './Components/Staff/Cage/Cage';




function App() {
  const { user, loginContext } = useContext(UserContext);
  console.log("user", user)
  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(localStorage.getItem("email"), localStorage.getItem("token"))

    }
  }, [])
  return (
    <>
      <div className='app-container'>
        <Routes>
          {/* Routes for customer */}
          <Route path="/*" element={<AppRoute />} />
          {/* Routes for admin */}
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path='/servicePet' element={<ServicePet />} />
          {/* Routes for staff */}
          <Route path='/staff' element={<StaffLayout />} />
          <Route path='/homeStaff' element={<HomeStaff />} />
          <Route path='/scheduleDoctor' element={<Schedule />} />
          <Route path='/bookingstaff' element={<BookingStaff />} />
          <Route path='/cagestaff' element={<Cage />} />
          <Route path='/doctor' element={<Doctor />} />

        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
    </>
  );
}

export default App;
