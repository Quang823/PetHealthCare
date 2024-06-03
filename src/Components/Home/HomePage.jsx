
import React from "react";
import video from "../../Assets/5227413-uhd_3840_2160_24fps.mp4";
import './HomePage.scss';
import ImageSlider from "./ImageSlider";
import flowerImg from "../../Assets/v186_557.png";
import lighthouseImg from "../../Assets/anh-thu-cung-cute_014114596.jpg";
import dandelion from "../../Assets/anh-thu-cung-cute-2k_014112419.jpg";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const HomePage = () => {
    const images = [
        lighthouseImg,
        flowerImg,
        dandelion,
        lighthouseImg,
        flowerImg,
        dandelion,
        lighthouseImg,
        // Add more image URLs here
    ];
    return (
        <div className="HomePage">
            <div className="imageSlider">
                {/* <video src={video} autoPlay muted loop></video> */}
                <ImageSlider images={images} />
            </div>
            <Container fluid className="middleDiv">
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
            </Container>
        </div>          
    );           
}

export default HomePage;