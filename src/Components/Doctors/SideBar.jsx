import React from 'react';
import { Link } from 'react-router-dom';

import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CiLogout } from "react-icons/ci";
import { useAuth } from '../../Context/UserContext';
function Sidebar() {
    const { logout, user } = useAuth;
    const navigate = useNavigate();
    const handleLogout = () =>{
        logout();
        navigate("/");
        toast.success("Success")
    }
  return (
    <div className='bg-white sidebar p-2'>
      <div className='m-2'>
        <i className='bi bi-bootstrap-fill me-3 fs-4'></i>
        {/* <span className='brand-name fs-4'>WELCOME</span> */}
      </div>
      <hr className='text-dark' />
      <div className='list-group list-group-flush'>
                <a className='list-group-item py-2' href="#">
          <i className='bi bi-house fs-5 me-3'></i>
          <span>Home</span>
        </a>
        
        
        
        {/* <a className='list-group-item py-2' href="">
          
          <NavLink to="/" className="menuLink flex" onClick={handleLogout}>
                            <CiLogout className="icon" />
                            Logout
          </NavLink>
        </a> */}
        <button className='list-group-item py-2' onClick={handleLogout}>
          <i className='bi bi-power fs-5 me-3'></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;