import { Routes, Route, Link } from 'react-router-dom'
import Home from '../Components/Home/HomePage';
import TableUser from '../Components/TableUser';
import Login from '../Components/LoginForm/LoginForm';
import Register from '../Components/RegisterForm/RegisterForm';
import PrivateRoute from './PrivateRoute';
const AppRoute = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path="/users"
                    element={
                        <PrivateRoute >
                            <TableUser>
                            </TableUser>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </>
    )
}
export default AppRoute;