import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import './SideBar.scss';

function Sidebar() {
  const { logout, user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Success");
  };

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

  return (
    <div className='bg-white sidebar p-2'>
      <div className='m-2'>
        <i className='bi bi-android2 me-3 fs-4'></i>
        <span className='brand-name fs-4'>WELCOME {userName}</span>
      </div>
      <hr className='text-dark' />
      <div className='list-group list-group-flush'>
        <NavLink className='list-group-item py-2' to="/staff" activeClassName="active">
          <i className='bi bi-house fs-5 me-3'></i>
          <span>Home</span>
        </NavLink>
        <NavLink className='list-group-item py-2' to="/staff/addslot" activeClassName="active">
          <i className='bi bi-archive-fill me-3'></i>
          <span>Add Slot</span>
        </NavLink>
        <NavLink className='list-group-item py-2' to="/staff/bookingstaff" activeClassName="active">
          <i className='bi bi-bag-fill fs-5 me-3'></i>
          <span>Booking</span>
        </NavLink>
        {/* <NavLink className='list-group-item py-2' to="/staff/cagestaff" activeClassName="active">
          <i className='bi bi-cup fs-5 me-3'></i>
          <span>Cage</span>
        </NavLink> */}
        <NavLink className='list-group-item py-2' to="/staff/bkneedCage" activeClassName="active">
          <i className='bi bi-briefcase-fill fs-5 me-3'></i>
          <span>BK Need Cage</span>
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
