import './SideBar.scss';
import React, { useContext } from 'react';
import { MdOutlinePets } from "react-icons/md";
import { IoMdSpeedometer } from "react-icons/io";
import v186_574 from '../../../Assets/v186_574.png';
import { MdDeliveryDining } from "react-icons/md";
import { IoIosSpeedometer } from "react-icons/io";
import { AiOutlinePieChart } from "react-icons/ai";
import { BsQuestionCircle } from "react-icons/bs";
import { RiServiceLine } from "react-icons/ri";
import { MdOutlineSell } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useNavigate, NavLink } from 'react-router-dom';
import { CiLogout } from "react-icons/ci";
import { GiBirdCage } from "react-icons/gi";
import { UserContext } from '../../../Context/UserContext';
import { toast } from 'react-toastify';
const SideBar = () => {
    const { logout, user } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
        toast.success("Sucess")
    }
    const contact = () =>{
        navigate("/contact")
    }

    return (
        <div className="sideBar grid">
            <div className="logoDiv flex">
                <img src={v186_574} alt="Image Name" />
                <h2>Pet Health Care</h2>
            </div>
            <div className="menuDiv">
                <h3 className="divTitle">QUICK MENU</h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <NavLink to="/testadmin/dashboard" className="menuLink flex">
                            <MdDashboard className="icon" />
                            <span className="smallText">Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="listItem">
                        <NavLink to="/testadmin/servicePet" className="menuLink flex">
                            <RiServiceLine className="icon" />
                            <span className="smallText">Service</span>
                        </NavLink>
                    </li>
                    <li className="listItem">
                        <NavLink to="/testadmin/testadminUser" className="menuLink flex">
                            <FaUser className="icon" />
                            <span className="smallText">User</span>
                        </NavLink>
                    </li>
                    <li className="listItem">
                        <NavLink to="/testadmin/addUser" className="menuLink flex">
                            <GiBirdCage  className="icon" />
                            <span className="smallText">Add User</span>
                        </NavLink>
                    </li>
                    <li className="listItem">
                        <NavLink to="/" className="menuLink flex" onClick={handleLogout}>
                            <CiLogout className="icon" />
                            <span className="smallText">Logout</span>
                        </NavLink>
                    </li>
                    
                </ul>
            </div>
            <div className="sideBarCard">
                <MdOutlinePets  className="icon" />
                <div className="cardContent">
                    <div className="circle1"></div>
                    <div className="circle2"></div>
                    <h3> If you want a friend, get a dog.</h3>
                    <p></p>
                    {/* <button className="btn" onClick={contact}>Go to help center</button> */}
                </div>
            </div>
        </div>
    );
};

export default SideBar;
