
import { Routes, Route } from 'react-router-dom'
import Home from '../Components/Home/HomePage';
import TablePet from '../Components/ManagePet/TablePet';
import Login from '../Components/LoginForm/LoginForm';
import Register from '../Components/RegisterForm/RegisterForm';
import PrivateRoute from './PrivateRoute';
import ManageAccount from '../Components/ManageAccount/ManageAccount';
import About from '../Components/About/About';
import ForgotPassword from '../Components/Forgot&Reset/ForgetPassword';
import VerifyOTP from '../Components/Forgot&Reset/VerifyOTP';
import ResetPassword from '../Components/Forgot&Reset/ResetPassword';
import Contact from '../Components/Contact/Contact';
import ServicePage from '../Components/ServicePage/ServicePage';
import BookingPage from '../Components/Booking/BookingPage';
import PaymentPage from '../Components/Payment/Payment';
import Vaccine from '../Components/Vaccine/Vaccine';
import MedicalHistory from '../Components/Medical History/MedicalHistory';
import BookingHistory from '../Components/BookingHistory/BookingHistory';
import BookingDetail from '../Components/Booking/BookingDetail';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';

const AppRoute = () => {
    return (
        <> <Header></Header>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/pets'
                    element={
                        <PrivateRoute >
                            <TablePet>
                            </TablePet>
                        </PrivateRoute>
                    } />
                <Route path='/manageAcc' element={<ManageAccount />} />
                <Route path='/about' element={<About />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/service' element={<ServicePage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/verify-otp' element={<VerifyOTP />} />
                <Route path='/booking' element={
                    <PrivateRoute >
                        <BookingPage>
                        </BookingPage>
                    </PrivateRoute>
                } />
                <Route path='/payment' element={<PaymentPage />} />
                <Route path='/vaccine/:petId' element={<Vaccine />} />
                <Route path="/medical-history/:petID" element={<MedicalHistory />} />
                <Route path='/booking-history' element={<BookingHistory />} />
                <Route path='/booking-detail/:id' element={<BookingDetail />} />

            </Routes>
            <Footer></Footer>
        </>
    )
}
export default AppRoute;
