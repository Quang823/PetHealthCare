import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CiLogout } from "react-icons/ci";
import { useAuth } from '../../Context/UserContext';
import './SideBar.scss';
import v186_557 from '../../Assets/v186_574.png';
import React, { useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
function Sidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken && decodedToken.User) {
                    setUserName(decodedToken.User.map.name);
                }
            } catch (err) {
                console.error('Invalid token:', err);
            }
        }
    }, []);
    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Success")
    }

    return (
        <div className='bg-white sidebar p-2'>
            <div className="adminImage" style={{ width: '200px', height: '200px', marginLeft: '20px' }}>
                <img src={v186_557} alt="Admin Image" />
            </div>
            <div className="welcome-container">
                <span
                    className="brand-name"
                >
                    WELCOME <br />
                    {userName}
                </span>
            </div>

            <hr className='text-dark' />
            <div className='list-group list-group-flush'>
                <NavLink className='list-group-item py-2' to="" end>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Home</span>
                </NavLink>

                <NavLink className='list-group-item py-2' to="slotdoctor">
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Slot</span>
                </NavLink>

                <button className='list-group-item py-2' onClick={handleLogout}>
                    <i className='bi bi-power fs-5 me-3'></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;