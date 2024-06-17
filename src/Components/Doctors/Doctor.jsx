import React ,{ useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Nav from './Nav'

import {FaCartArrowDown, FaUserAlt, FaSafari, FaTasks, FaCar} from 'react-icons/fa';
import Home from './Home';
import { Router, Route, Routes } from 'react-router-dom';
import Sidebar from './SideBar';
const Doctor = () =>{
    const [toggle, setToggle] = useState(true);

    const Toggle = () => {
      setToggle(!toggle);
    };
    return(
        <>
          
        <div className='container-fluid bg-secondary min-vh-100'>
          <div className='row'>
            {toggle && (
              <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
                <Sidebar />
              </div>
            )}
            {toggle && <div className='col-4 col-md-2'></div>}
            <div className='col  bg-white'>
            <Home Toggle={Toggle} />
             </div>
          </div>
        </div>
        </>
    )
}
export default Doctor