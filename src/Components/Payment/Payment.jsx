import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingDetail from '../Booking/BookingDetail';
import { jwtDecode } from "jwt-decode";
import logo from '../../Assets/v186_574.png';
import axios from 'axios';
import { RiArrowGoBackLine } from "react-icons/ri";
import './Payment.scss';

const PaymentPage = () => {
    const { date } = useParams();
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');

    // Lấy thông tin user từ token
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userID = decodedToken.User.userID;
                const response = await axios.get(`http://localhost:8080/account/getaccount/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    // Lấy thông tin booking từ localStorage
    useEffect(() => {
        const bookedInfo = JSON.parse(localStorage.getItem('bookedInfo'));
        if (bookedInfo) {
            setBookings(bookedInfo);
        }
        const selectedDate = localStorage.getItem('selectedDate');
        if (selectedDate) {
            setSelectedDate(selectedDate);
        }
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='paymentPage'>
            <h2>PAYMENT</h2>
            <div className="payment-page-container">
                <div className='logo-div'>
                    <div className="logo-container">
                        <img src={logo} alt="Logo image" className="logo" />
                    </div>
                </div>
                <h3>Pet Health Care System</h3>
                <div className='head-bill'>
                    <p>123 Thu Duc District, Ho Chi Minh City</p>
                    <p>Phone: 012-345-678 | Website</p>
                </div>
                <h4>Payment</h4>
                <div className="middle-bill">
                    <div className='payment-info'>
                        <p>Bill code: 01sda-adsd-vfdg</p>
                        <p>Date: {selectedDate}</p> {/* Hiển thị ngày đã chọn */}
                    </div>
                    <h5>Customer information</h5>
                    <p>Name: {user?.name}</p>
                    <p>Email: {user?.email}</p>
                    <p>Phone: {user?.phone}</p>
                    <p>Address: {user?.address}</p>
                    <p>Notes: </p>
                    <h5>Booking details</h5>
                    <BookingDetail bookings={bookings} />
                    <div className="payment-method">
                        <h6>Payment Method:</h6>
                        <select id="payment-method">
                            <option value="credit-card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank-transfer">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="total-cost">Total Cost: ${calculateTotalCost(bookings)}</div>
                </div>
            </div>
            <div className='back'>
                <a href='/booking'><RiArrowGoBackLine />Go back</a>
            </div>

            <div className='pay'>
                <button>
                    Make Payment
                </button>
            </div>
        </div>
    );
};

const calculateTotalCost = (bookings) => {
    return bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0).toFixed(2);
};

export default PaymentPage;
