import { Routes, Route, Link } from 'react-router-dom'
import Home from '../Components/Home/HomePage';
import TablePet from '../Components/ManagePet/TablePet';
import Login from '../Components/LoginForm/LoginForm';
import Register from '../Components/RegisterForm/RegisterForm';
import PrivateRoute from './PrivateRoute';
import ManageAccount from '../Components/ManageAccount/ManageAccount';
import About from '../Components/About/About';
import RequestOTP from '../Components/Forgot&Reset/RequestOTP';
import ResetPassword from '../Components/Forgot&Reset/ResetPassword';
import Contact from '../Components/Contact/Contact';
import ServicePage from '../Components/ServicePage/ServicePage';
const AppRoute = () => {
    return (
        <>
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
                <Route path='/request-otp' element={<RequestOTP />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/service' element={<ServicePage />} />
            </Routes>
        </>
    )
}
export default AppRoute;