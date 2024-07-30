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
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import PublicRoute from './Routes/PublicRoute';
import ResetPassword from './Components/Forgot&Reset/ResetPassword';
import ForgotPassword from './Components/Forgot&Reset/ForgetPassword';
import VerifyOTP from './Components/Forgot&Reset/VerifyOTP';
import HomeFake from './Components/Home/HomeFake';
import Addslotcancel from './Components/Staff/Slot/Addslotcancel';
import AboutFake from './Components/About/AboutFake';
import ContactFAke from './Components/Contact/ContactFake';
import ServiceFake from './Components/Home/ServiceFake';
import Slotdoctor from './Components/Doctors/Slotdoctor';


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
       <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
       <Route path="/*" element={<AppRoute />} />
       </Route>
       <Route element={<PublicRoute />}>
       <Route path='/home' element={<HomeFake />} />
          <Route path='/aboutfake' element={<AboutFake />} />
          <Route path='/contactfake' element={<ContactFAke />} />
          <Route path='/servicefake' element={<ServiceFake />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/register' element={<RegisterForm />} />
            <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/verify-otp' element={<VerifyOTP />} />
          </Route>


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
          {/* <Route path='scheduleDoctor' element={<Schedule />} />
          <Route path='home' element={<Home />} />
          <Route path='examineDoctor' element={<VetExaminationForm />} />
          <Route path='slotdoctor' element={<Slotdoctor />} /> */}
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
            <Route path="addslotcancel" element={<Addslotcancel />} />

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
