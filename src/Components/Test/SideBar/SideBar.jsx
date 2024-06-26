
import React from "react";
import './SideBar.scss';
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
const SideBar = () => {
    return (
        <div className="sideBar grid">
            <div className="logoDiv flex">
                <img src={v186_574} alt="Image Name" />
                <h2>Pet Heo Ke</h2>
            </div>
            <div className="menuDiv">
                <h3 className="divTitle">QUICK MENU</h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <MdDashboard className="icon" />
                            <span className="smallText">Dashboard</span>
                        </a>
                    </li>
                    <li className="listItem">
                        <a href="/servicePet" className="menuLink flex">
                            <RiServiceLine className="icon" />
                            <span className="smallText">Service</span>
                        </a>
                    </li>
                    <li className="listItem">
                        <a href="" className="menuLink flex">
                            <MdOutlineSell className="icon" />
                            <span className="smallText">Revenue statistics</span>
                        </a>
                    </li>
                    <li className="listItem">
                        <a href="/testadminUser" className="menuLink flex">
                            <FaUser className="icon" />
                            <span className="smallText">User</span>
                        </a>
                    </li>
                </ul>
            </div>
            {/* <div className="settingsDiv">
                <h3 className="divTitle">SETTINGS</h3>
                <ul className="menuLists grid">
                    <li className="listItem">
                        <a href="#" className="menuLink flex">
                            <AiOutlinePieChart className="icon" />
                            <span className="smallText">Charts</span>
                        </a>
                    </li>
                    <li className="listItem">
                        <a href="" className="menuLink flex">
                            <MdDeliveryDining className="icon" />
                            <span className="smallText">Contract</span>
                        </a>
                    </li>
                    <li className="listItem">
                        <a href="" className="menuLink flex">
                            <IoIosSpeedometer className="icon" />
                            <span className="smallText">Billing</span>
                        </a>
                    </li>
                    <li className="listItem">
                        <a href="" className="menuLink flex">
                            <IoMdSpeedometer className="icon" />
                            <span className="smallText">Product</span>
                        </a>
                    </li>
                </ul>
            </div> */}
            <div className="sideBarCard">
                <BsQuestionCircle className="icon" />
                <div className="cardContent">
                    <div className="circle1"></div>
                    <div className="circle2"></div>
                    <h3>Help Center</h3>
                    <p>Having trouble in Planti, please contact us for more questions.</p>
                    <button className="btn">Go to help center</button>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
