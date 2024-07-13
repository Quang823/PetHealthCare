
import React, { useContext, useEffect, useState } from "react";
import './Top.scss';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import v186_557 from '../../../../Assets/v186_557.png';
import video1 from '../../../../Assets/7515875-hd_1080_1920_30fps.mp4'
import { TbArrowNarrowRight } from "react-icons/tb";
import meo from '../../../../Assets/khach-san-thu-cung04.webp';
import { BsQuestionCircle } from "react-icons/bs";
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../../../Context/UserContext";
const Top = () => {
    const navigate = useNavigate();
    const [userName,setUserName] = useState('');
    useEffect(()=>{
      const token = localStorage.getItem('token');
      if( token){
        try{
          const decodedToken = jwtDecode(token);
          if (decodedToken && decodedToken.User) {
            setUserName(decodedToken.User.map.name); 
        }
        }catch(err){
            console.error('Invalid token:', err);
        }
      }
    },[]);

  
   
    return (
        <div className="topSection">
            <div className="headerSection flex">
                <div className="title">
                    <h1>Welcome {userName} to Pet Health Care</h1>
                    
                </div>
                <div className="searchBar flex">
                    <input type="text" placeholder="Search Dashboard" />
                    <BiSearchAlt className="icon" />
                </div>
                <div className="adminDiv flex">
                    {/* <TbMessageCircle className="icon" />
                    <IoIosNotifications className="icon" /> */}
                    <div className="adminImage">
                        <img src={v186_557} alt="Admin Image" />
                    </div>
                </div>
            </div>
            <div className="cardSection flex">

                <div className="rightCard flex">
                    <h1>Love and care for every moment - Keep your pets happy and healthy!</h1>
                    <p>Fully love and care for your health - Because pets are family!</p>

                    <div className="buttons flex">
                        {/* <button className='btn'>Explore more</button>
                        <button className='btn transparent'>Top Sellers</button> */}
                    </div>
                    <div className="videoDiv">
                        <video src={video1} autoPlay loop muted></video>
                    </div>
                </div>
                <div className="leftCard flex">
                    <div className="main flex">
                        <div className="textDiv">
                            <h1>Service</h1>

                            <div className="flex">
                                <span>
                                    Current <br /> <small>4 service</small>
                                </span>
                                <span>
                                    Future <br /> <small>123 service</small>
                                </span>
                            </div>

                            <span className="flex link">
                                Go to service <TbArrowNarrowRight className="icon" />
                            </span>

                        </div>
                        <div className="imgDiv">
                            <img src={meo} alt='My dog' />
                        </div>
                        {/* <div className="sideBarCard">
                <BsQuestionCircle className="icon" />
                <div className="cardContent">
                    <div className="circle1"></div>
                    <div className="circle2"></div>
                    <h3>Help Center</h3>
                    <p>Having trouble in Planti, please contact us for more questions.</p>
                    <button className="btn">Go to help center</button>
                </div>
            </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Top;
