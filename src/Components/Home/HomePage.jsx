import './HomePage.scss';
import React, { useRef } from "react";

import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import image from "../../Assets/Puppy-PNG-Image.png";
import image1 from "../../Assets/th.jpg";
import image4 from "../../Assets/dantri.png";
import image5 from "../../Assets/vne.png";
import image6 from "../../Assets/infonet.jpg";
import image2 from "../../Assets/vet-1.jpg";
import image3 from "../../Assets/tieng-anh-nganh-y-chuc-danh-bac-si.jpg";
import img4 from "../../Assets/dat09.jpg";
import img7 from "../../Assets/docho.jpg";
import img8 from "../../Assets/embethucung.jpg";
import img9 from "../../Assets/kysinh.png";

import { FaHeart, FaPhone } from "react-icons/fa";
import { useAuth, UserContext } from '../../Context/UserContext';
import { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
const HomePage = () => {
    const { user } = useAuth();
    let navigate = useNavigate();
    const [service, setService] = useState([]);
    const [veterinarians, setVeterinarians] = useState([]);
    const veterinariansRef = useRef(null);
    const newsRef = useRef(null);
    const visitOurRef = useRef(null);
    const handleShowAll = () => {
        navigate('/allservices'); // Route to the new page
    };

    // const handleBooked = () => {
    //     navigate('/booking')
    // }


    const handleBooked = (serviceName) => {
        navigate('/booking', { state: { selectedService: serviceName } });
    }


    useEffect(() => {
        const fetchService = async () => {
            try {
                const bookedInfo = JSON.parse(localStorage.getItem('bookedInfo'));
                console.log("00000", bookedInfo)
                const rs = await axios.get("http://localhost:8080/Service/getAll");
                setService(rs.data);
            } catch (er) {
                console.log(er);
            }
        };
        fetchService();
    }, []);

    useEffect(() => {
        const fetchVeterinarians = async () => {
            try {
                const response = await axios.get("http://localhost:8080/account/getVeterinarian");
                setVeterinarians(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchVeterinarians();
    }, []);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    const scrollToSection = (ref) => {
        window.scrollTo({
            top: ref.current.offsetTop,
            behavior: "smooth",
        });
    };
    return (

        <div className="HomePage" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>

            <div className="headerDiv">
                <div className="headerText">
                    <h4>Fur-ever friends</h4>
                    <h4>Fur-ever memories</h4>
                    <p>Owning a pet has evolved beyond mere companionship to become an integral part of many people's lives.
                        This has led to an increased demand for professional healthcare services for pets
                    </p>
                    <div className="buttonDiv">
                        <div className="button1">
                            <button > ABOUT US <FaHeart className="icon" /></button>
                        </div>
                        <div className="button2">
                            <button> 012-345-678 <FaPhone className="icon" /></button>
                        </div>
                    </div>
                </div>
                <div className="headerImage">
                    <img src={image} alt="image" className="image"></img>
                </div>
            </div>

            <div className="middleDiv" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                <div className="middleText">
                    <h3>For you</h3>
                </div>
                <Slider {...settings} className="middleImage">
                    <div className="box1">
                        <div className="box-content">
                            <div className="image-container">
                                <img src={image1} alt="Image 1" className="box-image"></img>
                            </div>
                            <div className="text-container1">
                                <button onClick={() => scrollToSection(veterinariansRef)}> Veterinarian </button>
                            </div>
                        </div>
                    </div>
                    <div className="box2">
                        <div className="box-content">
                            <div className="image-container">
                                <img src={image2} alt="Image 2" className="box-image"></img>
                            </div>
                            <div className="text-container2">
                                <button onClick={() => scrollToSection(newsRef)}>News</button>
                            </div>
                        </div>
                    </div>
                    <div className="box3">
                        <div className="box-content">
                            <div className="image-container">
                                <img src={image3} alt="Image 3" className="box-image"></img>
                            </div>
                            <div className="text-container3">
                                <button onClick={() => scrollToSection(visitOurRef)} >Visit Our</button>
                            </div>
                        </div>
                    </div>
                </Slider>
            </div>

            <div className="section services" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                <Container>
                    <h3 className="section-title">Our Best Services</h3>

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
                                    <button onClick={() => handleBooked(service.name)}>Book</button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            <div className=" veterinarians">
                <Container>
                    <h3 className="section-title" ref={veterinariansRef}>Meet Our Veterinarians</h3>
                    <Row>
                        {veterinarians.map(vet => (
                            <Col md={4} key={vet.userId}>
                                <div className="serviceBox" style={{ width: '400px', height: '400px' }}>
                                    <img src={vet.imageUrl} alt={`Veterinarian: ${vet.name}`} className="vetImage" style={{ width: '340px', height: '300px' }} />
                                    <h4> Veterinarian:  {vet.name}</h4>

                                    {/* <button onClick={handleBooked}>Book</button> */}

                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            <div className="news" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                <Container className='conshop'>
                    <h3 className="titlenew" ref={newsRef}>Latest Pet News</h3>
                    <Row className='newRow'>
                        <Col md={4} className='newCol'>
                            <div className="newsBox" onClick={() => window.location.href = 'https://petyeu.com.vn/cam-nang-thu-cung/co-nen-mac-do-cho-cun-cung-15.html'}>
                                <img src={img7} alt="Pet Health Tips" className="newsImage" />
                                <h4>Should pets wear clothes?</h4>

                            </div>
                        </Col>
                        <Col md={4} className='newCol'>
                            <div className="newsBox" onClick={() => window.location.href = 'https://petyeu.com.vn/cam-nang-thu-cung/loi-ich-cua-viec-cho-be-nuoi-thu-cung-10.html'}>
                                <img src={img8} alt="New Arrivals in Pet Shop" className="newsImage1" />
                                <h4>Benefits of keeping pets for babies</h4>
                                <p></p>
                            </div>
                        </Col>
                        <Col md={4} className='newCol'>
                            <div className="newsBox" onClick={() => window.location.href = 'https://petyeu.com.vn/cam-nang-thu-cung/ky-sinh-trung-nguyen-nhan-va-cach-khac-phuc-7.html'}>
                                <img src={img9} alt="Upcoming Pet Events" className="newsImage" />
                                <h4>Other ways to treat parasites in pets</h4>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className=" shop" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                <Container >
                    <h3 className="section-title" ref={visitOurRef}>Visit Our </h3>
                    <Row className="shopContent">
                        <Col md={6}>
                            <div className="videoBox">
                                <iframe
                                    className="shopVideo"
                                    src="https://www.youtube.com/embed/5UyVuZ5YWp0"
                                    title="YouTube video "
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                                </iframe>
                            </div>
                        </Col>
                        <Col md={6} className="shopmg">
                            <div className="shopBox" onClick={() => window.location.href = 'https://infonet.vietnamnet.vn/da-co-hon-20000-luot-benh-nhan-dat-lich-kham-qua-bookingcare-175080.html'}>
                                <img src={image6} alt="Pet Shop 1" className="shopImage" />

                                <p>Info new newspaper talked about us .</p>
                            </div>


                            <div className="shopBox" onClick={() => window.location.href = 'https://dantri.com.vn/nhan-tai-dat-viet/san-pham-nen-tang-dat-kham-booking-care-201908201625624751.htm'}>
                                <img src={image4} alt="Pet Shop 2" className="shopImage" />

                                <p>Dan tri newspaper talked about us.</p>
                            </div>


                            <div className="shopBox" onClick={() => window.location.href = 'https://vnexpress.net/dich-vu-lam-dep-cho-cho-dat-khach-ngay-tet-o-sai-gon-3711234.html'} >
                                <img src={image5} alt="Pet Shop 3" className="shopImage" />

                                <p>VnExpress newspaper talked about us.</p>
                            </div>

                        </Col>

                    </Row>
                </Container>
            </div>

        </div>
    );
};

export default HomePage;
