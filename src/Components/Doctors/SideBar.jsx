import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function Sidebar() {
    const { logout, user } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout = () =>{
        logout();
        navigate("/");
        toast.success("Sucess")
    }
  return (
    <div className='bg-white sidebar p-2'>
      <div className='m-2'>
        <i className='bi bi-bootstrap-fill me-3 fs-4'></i>
        <span className='brand-name fs-4'>WELCOME</span>
      </div>
      <hr className='text-dark' />
      <div className='list-group list-group-flush'>
                <a className='list-group-item py-2' href="#">
          <i className='bi bi-house fs-5 me-3'></i>
          <span>Home</span>
        </a>
        
        
        
        <a className='list-group-item py-2' href="">
          <i className='bi bi-power fs-5 me-3'></i>
          <span onClick={() => handleLogout()}>Logout</span>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;