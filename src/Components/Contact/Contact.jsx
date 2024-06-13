import React, { useState } from 'react';
import './Contact.scss';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast từ react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import backgroundImg from '../../Assets/hand-painted-watercolor-pastel-sky-background_23-2148902771.avif';
import contactImg1 from '../../Assets/download (1).jpg';
import contactImg2 from '../../Assets/download (2).jpg';
import contactImg3 from '../../Assets/download.jpg';

const Contact = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!email || !name) {
            // Xử lý logic gửi tin nhắn ở đây
            toast.error('Email/Name is missing')
        }
        else {
            // Hiển thị toast khi tin nhắn đã được gửi thành công
            toast.success('Message sent successfully!', {
            });
        }
    };

    return (
        <div className="contact-container">
            <div className="background-overlay">
                <img src={backgroundImg} alt="Background" className="background-image" />
            </div>
            <div className="contact-content">
                <h2>Contact Us</h2>
                <div className="contact-info">
                    <div className="info-item">
                        <FaMapMarkerAlt className="icon" />
                        <p>123 Thu Duc, Ho Chi Minh, Viet Nam</p>
                    </div>
                    <div className="info-item">
                        <FaPhoneAlt className="icon" />
                        <p>(123) 456-7890</p>
                    </div>
                    <div className="info-item">
                        <FaEnvelope className="icon" />
                        <p>PetHealthCare@gmail.com</p>
                    </div>
                </div>
                <div className="contact-form">
                    <form onSubmit={handleSendMessage}> {/* Gọi hàm xử lý khi submit form */}
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Your Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <textarea placeholder="Your Message"></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </div>
            <div className="contact-images">
                <img src={contactImg1} alt="Contact Image 1" className="contact-img" />
                <img src={contactImg2} alt="Contact Image 2" className="contact-img" />
                <img src={contactImg3} alt="Contact Image 3" className="contact-img" />
            </div>
        </div>
    );
}

export default Contact;
