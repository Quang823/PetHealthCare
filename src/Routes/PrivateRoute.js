import { Routes, Route, Link } from 'react-router-dom'
import TablePet from '../Components/ManagePet/TablePet';
import { UserContext } from '../Context/UserContext';
import { useContext, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";
import './PrivateRoute.scss';
const PrivateRoute = (props) => {
    const { loginContext, user } = useContext(UserContext);
    const [show, setShow] = useState(true);
    const navigate = useNavigate();
    const loginLink = (event) => {
        event.preventDefault();
        navigate('/login');
    }
    if (user && !user.auth) {
        return <>
            <div className='Login_to_use'>
                <Alert variant="danger" className='mt-3'>
                    <Alert.Heading className='text'>Oh snap! You must Login to continue !!!!</Alert.Heading>
                    <div className='buttonDiv'>
                        <button onClick={loginLink}> Login</button>
                    </div>

                </Alert>
            </div>
        </>
    }
    return (
        <>
            {props.children}
        </>
    )
}
export default PrivateRoute;