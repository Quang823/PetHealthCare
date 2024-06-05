import React from "react";
// import video from "../../Assets/5227413-uhd_3840_2160_24fps.mp4";
import './HomePage.scss';
// import ImageSlider from "./ImageSlider";
// import flowerImg from "../../Assets/v186_557.png";
// import lighthouseImg from "../../Assets/anh-thu-cung-cute_014114596.jpg";
// import dandelion from "../../Assets/anh-thu-cung-cute-2k_014112419.jpg";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
<<<<<<< HEAD
import image from "../../Assets/Puppy-PNG-Image.png";
=======
import image from "../../Assets/pngimg.com - dog_PNG50322.png";
>>>>>>> master
import image1 from "../../Assets/th.jpg";
import image2 from "../../Assets/vet-1.jpg";
import image3 from "../../Assets/tieng-anh-nganh-y-chuc-danh-bac-si.jpg";
import { FaHeart } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { UserContext } from '../../Context/UserContext';
import { useContext, useEffect, useState } from 'react';
const HomePage = () => {
    // const images = [
    //     lighthouseImg,
    //     flowerImg,
    //     dandelion,
    //     lighthouseImg,
    //     flowerImg,
    //     dandelion,
    //     lighthouseImg,
    //     // Add more image URLs here
    // ];
    const { user } = useContext(UserContext);
    return (
        <div className="HomePage">
            <div className="headerDiv">
                {/* <video src={video} autoPlay muted loop></video> */}
                {/* <ImageSlider images={images} /> */}
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
                    <div class="box1">
                        <div class="box-content">
                            <div class="image-container">
                                <img src={image1} alt="Image 1" class="box-image"></img>
                            </div>
                            <div class="text-container1">
                                <button> Veterinarian </button>
                            </div>
                        </div>
                    </div>
                    <div class="box2">
                        <div class="box-content">
                            <div class="image-container">
                                <img src={image2} alt="Image 2" class="box-image"></img>
                            </div>
                            <div class="text-container2">
                                <button>News</button>
                            </div>
                        </div>
                    </div>
                    <div class="box3">
                        <div class="box-content">
                            <div class="image-container">
                                <img src={image3} alt="Image 3" class="box-image"></img>
                            </div>
                            <div class="text-container3">
                                <button>Medical specialty</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Container fluid className="middleDiv">
                <Row>
                    <Col xs={12} md={6} style={{ backgroundColor: '#f8f9fa', height: '40vh' }} className="leftCol" >
                        <div className="leftSide" style={{ padding: '20px' }}>
                            <h3>SỨ MỆNH CỦA PET HEALTH CARE</h3>
                        </div>
                    </Col>
                    <Col xs={12} md={6} style={{ backgroundColor: '#e9ecef', height: '40vh' }} className="rightCol">
                        <div className="rightSide" style={{ padding: '20px' }}>
                            <p>Trở thành một hệ thống thú cưng hàng đầu tại Việt Nam.
                                Hệ thống Pet Health Care sẽ luôn ở trong tiềm thức xã hội với hình ảnh:
                                Uy tín – Chất lượng – Tiên phong.
                                Chúng tôi luôn nỗ lực, góp phần đưa dịch vụ thú cưng trở thành ngành nghề lớn,
                                sánh ngang tầm khu vực. Không chỉ cung cấp dịch vụ thú cưng chất lượng, uy tín
                                và chuyên nghiệp, những con người Gold Pet còn đem trong mình lòng nhân ái, sự cống hiến,
                                tôn trọng và có trách nhiệm với gia đình, cộng đồng. Cam kết cống hiến hết mình đến khách hàng,
                                đồng nghiệp, đối tác vì một xã hội giàu mạnh và nhân văn hơn.
                            </p>
                        </div>
                    </Col>
                </Row >
                    </Container> */}
            </div>
        </div>
    );
}

export default HomePage;