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
import './Payment.scss';

const PaymentPage = () => {
    const { date } = useParams();
    const [bookings, setBookings] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [billCode, setBillCode] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
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
                const response = await axios.get(`http://localhost:8080/account/getaccount/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("res", response);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const bookedInfo = JSON.parse(localStorage.getItem('bookedInfo'));
        console.log("bkinfo", bookedInfo)
        if (bookedInfo) {
            setBookings(bookedInfo);
        }
        const selectedDate = localStorage.getItem('selectedDate');
        if (selectedDate) {
            setSelectedDate(selectedDate);
        }

        // Generate a new bill code
        setBillCode(uuidv4());
    }, []);

    const handlePaymentMethodChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };
    const handleGoBack = () => {
        navigate('/booking');
    };

    const handlePayClick = async () => {
        if (!user) {
            console.error('User information is missing.');
            return;
        }

        const bookingData = {
            customerId: user.userId,
            date: selectedDate,
            status: "Confirmed",
            totalPrice: bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost || 0), 0),
            bookingDetails: bookings.map(booking => ({
                petId: booking.petId,
                veterinarianId: booking.doctorId,
                serviceId: booking.serviceId,
                needCage: false,
                date: booking.date,
                slotId: parseInt(booking.slotTime, 10)
            })),
            billCode: billCode // Include the generated bill code in the booking data
        };
        console.log("Booking Data to be sent:", bookingData);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/booking/add', bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response from server:", response);

            // After successful payment, clear localStorage and redirect to booking history
            localStorage.removeItem('bookedInfo');
            localStorage.removeItem('selectedDate');
            alert("Payment Successful");
            navigate('/booking-history');
        } catch (error) {
            alert(`Payment failed: ${error.response?.data?.message || error.message}`);
            console.error('Payment failed:', error.response?.data || error);
        }
    };

    if (loading) {
        return <p className="loading-text">Loading...</p>;
    }

    const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);

    const renderPaymentMethodDetails = () => {
        switch (selectedPaymentMethod) {
            case 'credit-card':
                return (
                    <div className="payment-details">
                        <img src={creCard} alt="Credit Card" />
                        <p>Enter your credit card details below.</p>
                        {/* Add your credit card form fields here */}
                    </div>
                );
            case 'paypal':
                return (
                    <div className="payment-details">
                        <img src={paypal} alt="PayPal" />
                        <p>You will be redirected to PayPal to complete your purchase.</p>
                        {/* Add additional PayPal instructions or forms if needed */}
                    </div>
                );
            case 'bank-transfer':
                return (
                    <div className="payment-details">
                        <img src={banktrans} alt="Bank Transfer" />
                        <p>Transfer the amount to the following bank account.</p>
                        <p>Account Number: XXX-XXX-XXX</p>
                        <p>Bank Name: XXX Bank</p>
                        <p>SWIFT Code: XXX 1234</p>
                        {/* Add additional bank transfer instructions or forms if needed */}
                    </div>
                );
            default:
                return <p>Please select a payment method.</p>;
        }
    };

    return (
        <div className='paymentPage'>
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
                        <h7><b>Date:</b> {selectedDate}</h7>
                    </div>
                    <div className="customer-info">
                        <h5>Customer information</h5>
                        <p><b>Name:</b> {user?.name}</p>
                        <p><b>Email:</b> {user?.email}</p>
                        <p><b>Phone:</b> {user?.phone}</p>
                        <p><b>Address:</b> {user?.address}</p>
                        <p><b>Notes:</b> </p>
                    </div>
                    <div className="booking-details">
                        <h5>Booking details</h5>
                        <BookingDetail bookings={bookings} showDeleteButton={false} />
                    </div>
                    <div className="payment-method">
                        <h5>Payment Method:</h5>
                        <select id="payment-method" onChange={handlePaymentMethodChange}>
                            <option value="">Select a payment method</option>
                            <option value="credit-card">Credit Card</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank-transfer">Bank Transfer</option>
                        </select>
                    </div>
                    {renderPaymentMethodDetails()}
                    <div className="total-cost">
                        <p>Total Cost: ${totalCost.toFixed(2)}</p>
                    </div>
                </div>
                <div className="qr-signature">
                    <div className="signature">
                        <p>Date: {selectedDate}</p>
                        <p>Signature: {user?.name}</p>
                        <div className="signature-line"></div>
                    </div>
                    <div className="qr-code">
                        <img src={qrCode} alt="QR Code" />
                    </div>
                </div>
                <div className="pay">
                    <button onClick={handlePayClick}>Pay</button>
                </div>

            </div>
        </div>
    );
};

export default PaymentPage;
