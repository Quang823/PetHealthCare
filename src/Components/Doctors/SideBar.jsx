import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CiLogout } from "react-icons/ci";
import { useAuth } from '../../Context/UserContext';
import './SideBar.scss';
import v186_557 from '../../Assets/v186_574.png';

function Sidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Success")
    }

    return (
        <div className='bg-white sidebar p-2'>
            <div className="adminImage" style={{ width: '200px', height: '200px', marginLeft: '10px' }}>
                <img src={v186_557} alt="Admin Image" />
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