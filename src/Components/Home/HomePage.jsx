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
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    // localStorage.clear;
    const { user } = useContext(UserContext);
    let navigate = useNavigate();
    const [service,SetService] = useState([]);
    const handleShowAll = () => {
        
        navigate('/allservices'); // Route to the new page
    };
    useEffect(() =>{
       const fetchService = async () =>{
        try{
             const rs =  await  axios.get("http://localhost:8080/Service/getAll");
             SetService(rs.data);
        }catch(er){
            console.log(er);
        }
       }
       fetchService();
    },[])
    return (
        <div className="HomePage">
            <div className="headerDiv">
                <div className="headerText">
                    <h4>Fur-ever friends</h4>
                    <h4>Fur-ever memories</h4>
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

            <div className="section services">
                <Container>
                    <h3 className="section-title">Our Services</h3>
                    <div className="showAllButtonDiv">
                        <button onClick={handleShowAll} className="showAllButton">Show All</button>
                    </div>
                    <Row>
                    {service.slice(0, 3).map(service => (
                            <Col md={4} key={service.id}>
                                <div className="serviceBox">
                                    <img src={service.imageUrl} alt={service.name} className="serviceImage" />
                                    <h4>{service.name}</h4>
                                    <p>{service.description}</p>
                                    <p>{service.price}</p>
                                </div>
                            </Col>
                        ))}
                      
                    </Row>
                </Container>
            </div>

            <div className="section veterinarians">
                <Container>
                    <h3 className="section-title">Meet Our Veterinarians</h3>
                    <Row>
                        <Col md={4}>
                            <div className="vetBox">
                                <img src={image2} alt="Veterinarian 1" className="vetImage" />
                                <h4>Dr. John Doe</h4>
                                <p>Specializes in small animals and surgeries.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="vetBox">
                                <img src={image3} alt="Veterinarian 2" className="vetImage" />
                                <h4>Dr. Jane Smith</h4>
                                <p>Expertise in exotic pets and dermatology.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="vetBox">
                                <img src={image1} alt="Veterinarian 3" className="vetImage" />
                                <h4>Dr. Michael Brown</h4>
                                <p>Passionate about preventive care and nutrition.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="section news">
                <Container>
                    <h3 className="section-title">Latest Pet News</h3>
                    <Row>
                        <Col md={4}>
                            <div className="newsBox">
                                <img src={image2} alt="Pet Health Tips" className="newsImage" />
                                <h4>Pet Health Tips</h4>
                                <p>Learn how to keep your pets healthy and active.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="newsBox">
                                <img src={image3} alt="New Arrivals in Pet Shop" className="newsImage" />
                                <h4>New Arrivals in Pet Shop</h4>
                                <p>Check out the latest products in our pet shop.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="newsBox">
                                <img src={image1} alt="Upcoming Pet Events" className="newsImage" />
                                <h4>Upcoming Pet Events</h4>
                                <p>Join us for fun and informative pet events.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="section shop">
                <Container>
                    <h3 className="section-title">Visit Our Pet Shop</h3>
                    <Row>
                        <Col md={4}>
                            <div className="shopBox">
                                <img src={image2} alt="Pet Shop 1" className="shopImage" />
                                <h4>Quality Pet Accessories</h4>
                                <p>Explore our range of pet toys and accessories.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="shopBox">
                                <img src={image3} alt="Pet Shop 2" className="shopImage" />
                                <h4>Premium Pet Food</h4>
                                <p>Choose from a variety of nutritious pet food brands.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="shopBox">
                                <img src={image1} alt="Pet Shop 3" className="shopImage" />
                                <h4>Healthcare Products</h4>
                                <p>Find essential healthcare products for your pets.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default HomePage;