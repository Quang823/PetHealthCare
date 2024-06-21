import './Staff.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React ,{ useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import { useNavigate } from "react-router-dom";
const StaffLayout = () =>{
    const [toggle, setToggle] = useState(true);
    const navigate = useNavigate();
    const Toggle = () => {
      setToggle(!toggle);
    };
    const handleBack = () => {
      navigate('/staff');
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
            <div className='col'>
            <Home Toggle={Toggle} />
             </div>
          </div>
        </div>
        
        </>
    )
}
export default StaffLayout