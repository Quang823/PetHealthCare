import React from 'react';
import './ServicePage.scss';
import { Container, Row, Col } from 'react-bootstrap';
import service1Image from '../../Assets/anh-thu-cung-cute-2k_014112419.jpg';
import service2Image from '../../Assets/hinh-thu-cung-cute-dep-nhat_014120300.jpg';
import service3Image from '../../Assets/anh-thu-cung-cute_014114596.jpg';

const Service = () => {
    return (
        <div className="service-container">
            <div className="service-heading">
                <h2>Pet Health Care Services</h2>
                <p>At our Pet Health Center, we provide a range of professional services to ensure the well-being of your beloved pets.</p>
            </div>
            <Container>
                <Row>
                    <Col md={4}>
                        <div className="service-card">
                            <img src={service1Image} alt="Service 1" />
                            <div className="service-details">
                                <h3>Veterinary Care</h3>
                                <p>Our experienced veterinarians offer comprehensive medical care for your pets, including routine check-ups, vaccinations, and surgical procedures.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="service-card">
                            <img src={service2Image} alt="Service 2" />
                            <div className="service-details">
                                <h3>Grooming Services</h3>
                                <p>Give your pets the royal treatment with our grooming services, including baths, haircuts, nail trimming, and ear cleaning.</p>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="service-card">
                            <img src={service3Image} alt="Service 3" />
                            <div className="service-details">
                                <h3>Pet Boarding</h3>
                                <p>While you're away, rest assured that your pets are in good hands at our comfortable and secure pet boarding facility.</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Service;
