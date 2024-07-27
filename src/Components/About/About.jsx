import React, { useState } from 'react';
import './About.scss';
import video from '../../Assets/5744668-uhd_2160_3840_24fps.mp4';
import ImageSlider from "./ImageSlider";
import image1 from "../../Assets/macdo.jpg";
import image2 from "../../Assets/1674772971550.jpeg";
import image3 from "../../Assets/download.jpg";
import image4 from "../../Assets/certifiedpet_hero.jpeg";
import image5 from "../../Assets/dans+dog+walking+and+pet+sitting+wag+rover+walker+long+island.jpg";
import image6 from "../../Assets/images (1).jpg";
import image7 from "../../Assets/images (2).jpg";
import image8 from "../../Assets/images.jpg";
import { Link, useNavigate } from "react-router-dom";

import { Container, Row, Col } from 'react-bootstrap';
import logo from '../../Assets/v186_574.png';

const About = () => {
    const images = [
        image4,
        image5,
        image6,
        image7,
        image8,
        image4,
        image5,
        image6,
        image7,
        image8,
    ];

    // State to toggle policy view
    const [showPolicy, setShowPolicy] = useState(false);

    // Function to toggle the policy content
    const handleShowPolicy = () => {
        setShowPolicy(true);
    };
    const handleClosePolicy = () => {
        setShowPolicy(false);
    };

    return (
        <div className="about-container">
            <Container>
                <Row>
                    <Col lg={6} md={12}>
                        {showPolicy ? (
                            // Render policy content here
                            <div className="policy-content">
                                <h2> Pet Health Care Policy</h2>
                                <div className="button-container">
                                    <button onClick={handleClosePolicy} className="get-started-button">
                                        About Pet Health Care
                                    </button>
                                </div>
                                <section className="policy-section">
                                    <h3>Pet Management</h3>
                                    <ul>
                                        <li>Customers can manage their list of pets.</li>
                                        <li>View detailed information about each pet, including medical history and annual vaccination records.</li>
                                    </ul>
                                </section>
                                <section className="policy-section">
                                    <h3>Appointment Booking</h3>
                                    <ul>
                                        <li>Book appointments for specific times with the option to choose a preferred veterinarian.</li>
                                        <li>If no veterinarian is selected, our staff will assign one prior to the appointment.</li>
                                        <li>
                                            Cancellation Policy:
                                            <ul>
                                                <li>If canceled more than 7 days in advance, a full refund is issued for pre-paid appointments.</li>
                                                <li>Cancellations between 3-6 days in advance receive a 75% refund of the pre-paid amount.</li>
                                                <li>No refunds for cancellations less than 3 days in advance.</li>
                                            </ul>
                                        </li>
                                    </ul>
                                </section>
                                <section className="policy-section">
                                    <h3>Clinic Visits</h3>
                                    <ul>
                                        <li>Check-in your pet for visits and pay for any additional services rendered.</li>
                                        <li>Provide feedback and ratings for each visit.</li>
                                    </ul>
                                </section>
                                <section className="policy-section">
                                    <h3>In-Hospital Care</h3>
                                    <ul>
                                        <li>Monitor the treatment process of pets admitted to the hospital for extended care.</li>
                                    </ul>
                                </section>
                            </div>
                        ) : (

                            <div className="about-content">
                                <h2>Welcome to Pet Health Care!</h2>
                                <div className="button-container">
                                    <button onClick={handleShowPolicy} className="get-started-button">
                                        Pet Health Care Policy
                                    </button>
                                </div>
                                <p>Pet Health Care is the perfect destination for pet lovers. Here, we provide a range of services and products to help you take care of your pets in the best way possible.</p>
                                <div className="services-grid">
                                    <div className="service-item">
                                        <img src={image1} alt="Pet Care Services" />
                                        <h3>Pet Care Services</h3>
                                        <p>Pet Health Care offers high-quality pet care services, provided by a team of professional veterinarians.</p>
                                    </div>
                                    <div className="service-item">
                                        <img src={image2} alt="Food and Toys" />
                                        <h3>Food and Toys</h3>
                                        <p>We provide a variety of pet food and toys for your furry friends.</p>
                                    </div>
                                    <div className="service-item">
                                        <img src={image3} alt="Training Guidance" />
                                        <h3>Training Guidance</h3>
                                        <p>Join training courses from experts to make your pets more obedient.</p>
                                    </div>
                                </div>


                            </div>
                        )}
                    </Col>
                    <Col lg={6} md={12}>
                        <div className='logoDiv'>
                            <div className="logo-container">
                                <img src={logo} alt="Logo image" className="logo" />
                            </div>
                        </div>
                        <div className="image-slider">
                            <ImageSlider images={images} />
                        </div>
                        <div className="video-container">
                            <video src={video} autoPlay muted loop></video>
                            <div className="video-overlay">
                                <p>Discover more about Pet Health Care</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default About;
