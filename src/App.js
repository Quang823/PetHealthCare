import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ToastifyCustom.css';
import AppRoute from './Routes/AppRoute';
import ProtectedRoute from './Routes/ProtectedRoute';
import Unauthorized from './Routes/Unauthorized';
import TestAdminLayout from './Components/Test/TestAdminLayout';
import UserATest from './Components/Test/User/UserATest';
import ServicePet from './Components/Test/Service/ServicePet';
import Body from './Components/Test/Body/Body';
import AddUser from './Components/Test/AddUser/AddUser';
import StaffLayout from './Components/Staff/StaffLayout';
import BookingStaff from './Components/Staff/Booking/BookingStaff';
import Cage from './Components/Staff/Cage/Cage';
import EditSlot from './Components/Staff/Slot/EditSlot';
import AddSlot from './Components/Staff/Slot/AddSlot';
import BKNeedCage from './Components/Staff/BKNeedCage/BKNeedCage';
import RefundStaff from './Components/Staff/Refund/RefundStaff';
import AddCageStaff from './Components/Staff/Cage/AddCageStaff';

import Doctor from './Components/Doctors/Doctor';
import Schedule from './Components/Doctors/Schedule/Schedule';

import Home from './Components/Doctors/Home';
import VetExaminationForm from './Components/Doctors/VetExaminationForm';
import { useAuth, UserProvider } from './Context/UserContext';


function App() {
  const { user } = useAuth();

  if (user.auth === null) {
    return <div>Loading...</div>;
  }

  return (

    <div className='app-container'>
     <UserProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/*" element={<AppRoute />} />
        


        {/* Protected routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        {/* <Route > */}
          <Route path="/testadmin/*" element={<TestAdminLayout />}>
            <Route path="testadminUser" element={<UserATest />} />
            <Route path="servicePet" element={<ServicePet />} />
            <Route path="dashboard" element={<Body />} />
            <Route path="addUser" element={<AddUser />} />
          </Route>
        </Route>

        {/* Protected routes for Veterinarian */}
        <Route element={<ProtectedRoute allowedRoles={['Veterinarian']} />}>
          <Route path='/doctor/*' element={<Doctor />} />
          <Route path='scheduleDoctor' element={<Schedule />} />
          <Route path='home' element={<Home />} />
          <Route path='examineDoctor' element={<VetExaminationForm />} />
        </Route>


        {/* Protected routes for Staff */}
        <Route element={<ProtectedRoute allowedRoles={['Staff']} />}>
          <Route path='/staff/*' element={<StaffLayout />}>
            <Route path="bookingstaff" element={<BookingStaff />} />
            <Route path="cagestaff" element={<Cage />} />
            <Route path="editslotStaff" element={<EditSlot />} />
            <Route path="addslot" element={<AddSlot />} />
            <Route path="bkneedCage" element={<BKNeedCage />} />
            <Route path="refundStaff" element={<RefundStaff />} />
            <Route path="addCageStaff" element={<AddCageStaff />} />

          </Route>
        </Route>

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      </UserProvider>
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
    </div>
  );
}



export default App;
