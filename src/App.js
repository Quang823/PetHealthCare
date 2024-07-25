import React, { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import { UserContext } from './Context/UserContext';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ToastifyCustom.css';
import AppRoute from './Routes/AppRoute';

import CustomerList from './Components/Admin/User/UserList';

import StaffLayout from './Components/Staff/StaffLayout';
import Doctor from './Components/Doctors/Doctor';
import Schedule from './Components/Doctors/Schedule/Schedule';
import BookingStaff from './Components/Staff/Booking/BookingStaff';
import Cage from './Components/Staff/Cage/Cage';
import AddSlot from './Components/Staff/Slot/AddSlot';
import EditSlot from './Components/Staff/Slot/EditSlot';
import VetExaminationForm from './Components/Doctors/VetExaminationForm';
import Test from './Routes/Test';
import UserATest from './Components/Test/User/UserATest';
import ServicePet from './Components/Test/Service/ServicePet';
import BKNeedCage from './Components/Staff/BKNeedCage/BKNeedCage';
import TestAdminLayout from './Components/Test/TestAdminLayout';
import TestAdmin from './Components/Test/TestAdmin';
import Body from './Components/Test/Body/Body';
import CageAdmin from './Components/Test/Cage/Cage';
import AddCageStaff from './Components/Staff/Cage/AddCageStaff';
import AddUser from './Components/Test/AddUser/AddUser';
import ProtectedRoute from './Routes/ProtectedRoute';
import Unauthorized from './Routes/Unauthorized';



function App() {
  const { user, loginContext } = useContext(UserContext);
  console.log("user", user);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(localStorage.getItem("email"), localStorage.getItem("token"));
    }
  }, []);

  return (
    <>
      <div className='app-container'>
        <Routes>
          {/* Public routes */}
          <Route path="/*" element={<AppRoute />} />

          {/* Protected routes for admin */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/testadmin/*" element={<TestAdminLayout />}>
              <Route path="testadminUser" element={<UserATest />} />
              <Route path="servicePet" element={<ServicePet />} />
              <Route path="dashboard" element={<Body />} />
              <Route path="addUser" element={<AddUser />} />
            </Route>
          </Route>

          {/* Protected routes for staff */}
          <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
            <Route path='/staff/*' element={<StaffLayout />}>
              <Route path="bookingstaff" element={<BookingStaff />} />
              <Route path="cagestaff" element={<Cage />} />
              <Route path="addslot" element={<AddSlot />} />
              <Route path="bkneedCage" element={<BKNeedCage />} />
              <Route path="addCageStaff" element={<AddCageStaff />} />
            </Route>
          </Route>

          {/* Protected routes for doctor */}
          <Route element={<ProtectedRoute allowedRoles={['Veterinarian']} />}>
            <Route path='/doctor' element={<Doctor />} />
            <Route path='/scheduleDoctor' element={<Schedule />} />
            <Route path='/examineDoctor' element={<VetExaminationForm />} />

          </Route>

          {/* Unauthorized route */}
          <Route path="/unauthorized" element={<Unauthorized />} />
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
