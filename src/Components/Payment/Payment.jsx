import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingDetail from '../Booking/BookingDetail';
import { jwtDecode } from 'jwt-decode';
import logo from '../../Assets/v186_574.png';
import qrCode from '../../Assets/QR-Code-PNG-HD-Image.png';
import creCard from '../../Assets/credit_card_PNG39.png';
import paypal from '../../Assets/PayPal-PNG-Free-Download.png';
import banktrans from '../../Assets/10762700.png';
import axios from 'axios';
import { RiArrowGoBackLine } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-toastify/dist/ReactToastify.css';
import './Payment.scss';

const PaymentPage = () => {
    const { date } = useParams();
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [billCode, setBillCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userID = decodedToken.User.map.userID;

                // Fetch user information
                const userResponse = await axios.get(`http://localhost:8080/account/getaccount/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Fetch wallet information
                const walletResponse = await axios.get(`http://localhost:8080/wallet/get-by-user?userId=${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Store walletId in localStorage
                localStorage.setItem('walletId', walletResponse.data.data.walletId);

                // Combine user and wallet information
                setUser({ ...userResponse.data, wallet: walletResponse.data });
            } catch (error) {
                console.error('Error fetching user info:', error);
                toast.error("Failed to fetch user information. Please try logging in again.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const bookedInfo = JSON.parse(localStorage.getItem('bookings'));
        if (bookedInfo) {
            setBookings(bookedInfo);
        }
        setBillCode(uuidv4());
    }, []);

    const handlePayment = async () => {
        if (!user) {
            console.error('User information is missing.');
            toast.error("User information not found. Please log in again.");
            return;
        }

        const walletId = localStorage.getItem('walletId');
        if (!walletId) {
            console.error('Wallet ID not found in localStorage.');
            toast.error("Wallet not found. Please contact support.");
            return;
        }

        const paymentData = {
            walletId: walletId,
            bookingId: localStorage.getItem('currentBookingId'),
            amount: totalCost
        };

        try {
            const paymentResponse = await axios.post('http://localhost:8080/payment/pay-booking', paymentData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Payment Response:", paymentResponse.data);
            if (paymentResponse.data.data === "Payment success") {
                toast.success("Payment successful!");
                navigate('/payment-success');
                localStorage.removeItem('bookings');
                localStorage.removeItem('bookedSlots');
                localStorage.removeItem('currentBookingId');
                localStorage.removeItem('selectedDate');
            }
        } catch (error) {
            console.error('Payment failed:', error.response?.data || error);
            toast.error("You do not have enough money to pay. Please check your wallet.");
            navigate('/payment-failure');
        }
    };

    const confirmPayment = () => {
        confirmAlert({
            title: 'Confirm Payment',
            message: 'Are you sure you want to proceed with the payment?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: handlePayment
                },
                {
                    label: 'No'
                }
            ]
        });
        localStorage.removeItem('bookings');
        localStorage.removeItem('bookedSlots');
        localStorage.removeItem('currentBookingId');
        localStorage.removeItem('selectedDate');
    };

    const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost || 0), 0);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='paymentPage'>
            <ToastContainer />
            <h3>PAYMENT</h3>
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
                        <p><b>Bill code: </b>{billCode}</p>
                        <p><b>Date:</b> {selectedDate.toLocaleDateString()}</p>
                    </div>
                    <div className="customer-info">
                        <h5>Customer information</h5>
                        <p><b>Name:</b> {user?.name}</p>
                        <p><b>Email:</b> {user?.email}</p>
                        <p><b>Phone:</b> {user?.phone}</p>
                        <p><b>Address:</b> {user?.address}</p>
                    </div>
                    <div className="booking-details">
                        <h5>Booking details</h5>
                        <BookingDetail bookings={bookings} showDeleteButton={false} />
                    </div>
                    <div className="total-cost">
                        <p>Total Cost: {totalCost} VND</p>
                    </div>
                </div>
                <div className="qr-signature">
                    <div className="signature">
                        <p>Date: {selectedDate.toLocaleDateString()}</p>
                        <p>Signature: {user?.name}</p>
                        <div className="signature-line"></div>
                    </div>
                </div>
                <div className="pay">
                    <button onClick={confirmPayment}>Pay</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
