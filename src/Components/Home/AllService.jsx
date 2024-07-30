// AllServicesPage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './AllService.scss';
import { useNavigate } from 'react-router-dom';
const AllService = () => {
    let navigate = useNavigate();
    const [services, setServices] = useState([]);
    const handleBooked = (serviceName) => {
        navigate('/booking', { state: { selectedService: serviceName } });
    }
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:8080/Service/getAll');
                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, []);


    return (
        <div className="AllServicesPage">
            <Container>
                <h3 className="section-title">All Services</h3>
                <Row>
                    {services.map(service => (
                        <Col md={4} key={service.id}>
                            <div className="serviceBox">
                                <img src={service.imageUrl} alt={service.name} className="serviceImage" />
                                <h4>{service.name}</h4>
                                <p>{service.price}</p>
                                <p>{service.description}</p>
                                <button onClick={() => handleBooked(service.name)}>Book</button>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default AllService;
