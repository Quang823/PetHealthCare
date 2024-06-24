
import React from 'react';
import './Top.scss';
import { BiSearchAlt } from 'react-icons/bi';
import { TbMessageCircle } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import v186_557 from '../../../../Assets/v186_557.png';
import video1 from '../../../../Assets/7515875-hd_1080_1920_30fps.mp4'
import { TbArrowNarrowRight } from "react-icons/tb";
import meo from '../../../../Assets/hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import { BsQuestionCircle } from "react-icons/bs";

const Top = () => {
    return (
        <div className="topSection">
            <div className="headerSection flex">
                <div className="title">
                    <h1>Welcome to Pet Health Care</h1>
                    <p>Chao be Le Van Dat ,Be con o do khong ta!</p>
                </div>
                <div className="searchBar flex">
                    <input type="text" placeholder="Search Dashboard" />
                    <BiSearchAlt className="icon" />
                </div>
                <div className="adminDiv flex">
                    <TbMessageCircle className="icon" />
                    <IoIosNotifications className="icon" />
                    <div className="adminImage">
                        <img src={v186_557} alt="Admin Image" />
                    </div>
                </div>
            </div>
            <div className="cardSection flex">

                <div className="rightCard flex">
                    <h1>Create and sell extraordinary products</h1>
                    <p>The world fast growing industry today are natural made products</p>

                    <div className="buttons flex">
                        <button className='btn'>Explore more</button>
                        <button className='btn transparent'>Top Sellers</button>
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
