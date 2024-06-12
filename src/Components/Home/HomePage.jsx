import React from "react";
import './HomePage.scss';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import image from "../../Assets/Puppy-PNG-Image.png";
import image1 from "../../Assets/th.jpg";
import image2 from "../../Assets/vet-1.jpg";
import image3 from "../../Assets/tieng-anh-nganh-y-chuc-danh-bac-si.jpg";
import { FaHeart } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { UserContext } from '../../Context/UserContext';
import { useContext, useEffect, useState } from 'react';
const HomePage = () => {
    // localStorage.clear;
    const { user } = useContext(UserContext);
    return (
        <div className="HomePage">
            <div className="headerDiv">
                <div className="headerText">
                    <h2>Fur-ever friends</h2>
                    <h2>Fur-ever memories</h2>
                    <p>Owning a pet has evolved beyond mere companionship to become an integral part of many people's lives.
                        This has led to an increased demand for professional healthcare services for pets
                    </p>
                    <div className="buttonDiv">
                        <div className="button1">
                            <button> ABOUT US <FaHeart className="icon" /></button>
                        </div>
                        <div className="button2">
                            <button> 012-345-678 <FaPhone className="icon" /></button>
                        </div>
                    </div>
                </div>
                <div className="headerImage">
                    <img src={image} alt="image" className="image"></img>
                </div >
            </div>

            <div className="middleDiv">
                <div className="middleText">
                    <h3>For you</h3>
                </div>
                <div className="middleImage">
                    <div className="box1">
                        <div className="box-content">
                            <div className="image-container">
                                <img src={image1} alt="Image 1" className="box-image"></img>
                            </div>
                            <div className="text-container1">
                                <button> Veterinarian </button>
                            </div>
                        </div>
                    </div>
                    <div className="box2">
                        <div className="box-content">
                            <div className="image-container">
                                <img src={image2} alt="Image 2" className="box-image"></img>
                            </div>
                            <div className="text-container2">
                                <button>News</button>
                            </div>
                        </div>
                    </div>
                    <div className="box3">
                        <div className="box-content">
                            <div className="image-container">
                                <img src={image3} alt="Image 3" className="box-image"></img>
                            </div>
                            <div className="text-container3">
                                <button>Medical specialty</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="thirDiv">
                <div className="thirdText">
                    <h3>Service</h3>
                </div>
            </div>
        </div>
    );
}

export default HomePage;