import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
                localStorage.getItem('walletId', walletResponse.data.walletId);
                
                // Combine user and wallet information
                setUser({...userResponse.data, wallet: walletResponse.data});
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
        const bookedInfo = JSON.parse(localStorage.getItem('bookedInfo'));
        if (bookedInfo) {
            setBookings(bookedInfo);
        }
        setBillCode(uuidv4());
    }, []);


    const handleGoBack = () => {
        navigate('/booking');
    };

    const handleBooking = async () => {
        if (!user) {
            console.error('User information is missing.');
            return;
        }

        const bookingData = {
            customerId: user.userId,
            date: selectedDate,
            status: "Unpaid",
            totalPrice: bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost || 0), 0),
            bookingDetails: bookings.map(booking => ({
                petId: booking.petId,
                veterinarianId: booking.doctorId,
                serviceId: booking.serviceId,
                needCage: false,
                date: booking.date,
                slotId: parseInt(booking.slotTime, 10)
            })),
            billCode: billCode
        };

        try {
            const token = localStorage.getItem('token');
            const bookingResponse = await axios.post('http://localhost:8080/booking/add', bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Booking Response:", bookingResponse.data);
            toast.success("Booking successful!");
            localStorage.setItem('currentBookingId', bookingResponse.data.data.bookingId);
            localStorage.removeItem('bookedInfo');
            localStorage.removeItem('selectedDate');
        } catch (error) {
            console.error('Booking failed:', error.response?.data || error);
            toast.error("Booking failed. Please try again.");
        }
    };
   

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
    
        const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost || 0), 0);
    
        // Check wallet balance if available
        if (user.wallet && user.wallet.balance < totalCost) {
            toast.error("Insufficient balance. Please top up your wallet.");
            return;
        }
    
        const bookingData = {
            customerId: user.userId,
            date: selectedDate,
            status: "Unpaid",
            totalPrice: totalCost,
            bookingDetails: bookings.map(booking => ({
                petId: booking.petId,
                veterinarianId: booking.doctorId,
                serviceId: booking.serviceId,
                needCage: false,
                date: booking.date,
                slotId: parseInt(booking.slotTime, 10)
            })),
            billCode: billCode
        };
    
        try {
            const token = localStorage.getItem('token');
            
            // Step 1: Create the booking
            const bookingResponse = await axios.post('http://localhost:8080/booking/add', bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log("Booking Response:", bookingResponse.data);
            
            const bookingId = bookingResponse.data.data.bookingId;
    
            // Prepare the payment data
            const paymentData = {
                walletId: walletId,
                bookingId: bookingId,
                amount: totalCost
            };
    
            console.log("Payment Data:", paymentData); // Log the payment data for debugging
    
            // Step 2: Process the payment
            const paymentResponse = await axios.post('http://localhost:8080/payment/pay-booking', paymentData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Payment Response:", paymentResponse);
            if(paymentResponse.data === "Payment success"){
                toast.success("Booking and payment successful!");
                navigate('/payment-success');  
            }else{
                toast.error("Booking or payment failed. Please try again.");
                 navigate('/payment-failure');
            }
           
            // Clear local storage
            localStorage.removeItem('bookedInfo');
            localStorage.removeItem('selectedDate');
        } catch (error) {
            console.error('Booking or payment failed:', error.response?.data || error);
            toast.error("Booking or payment failed. Please try again.");
            navigate('/payment-failure');
        }
    };
    

    if (loading) {
        return <p className="loading-text">Loading...</p>;
    }

    const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);

    return (
        <div className='paymentPage'>
            <ToastContainer />
            <h3>PAYMENT</h3>
            <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
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
                        <h7><b>Bill code: </b>{billCode}</h7>
                        <h7><b>Date:</b> {selectedDate.toLocaleDateString()}</h7>
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
                        <p>Total Cost: ${totalCost.toFixed(2)}</p>
                    </div>
                </div>
                <div className="qr-signature">
                    <div className="signature">
                        <p>Date: {selectedDate.toLocaleDateString()}</p>
                        <p>Signature: {user?.name}</p>
                        <div className="signature-line"></div>
                    </div>
                    <div className="qr-code">
                        <img src={qrCode} alt="QR Code" />
                    </div>
                </div>
                <div className="pay">
                    <button onClick={handlePayment}>Pay</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
