import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BookingDetail from '../Booking/BookingDetail';
import {jwtDecode} from 'jwt-decode';
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const navigate = useNavigate();
    const paymentSavedRef = useRef(false);
    const location = useLocation();

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
        if (bookedInfo) {
            setBookings(bookedInfo);
        }
        setBillCode(uuidv4());
    }, []);

    useEffect(() => {
        const savePayment = async (paymentDetails) => {
            try {
                const { responseCode, transactionNo, amount, bankCode, bankTranNo, cardType, vnpPayDate, orderInfo, txnRef } = paymentDetails;
        if (responseCode) {
            const transactionNo = parseInt(urlParams.get('vnp_TransactionNo'), 10);
            const amount = parseInt(urlParams.get('vnp_Amount'), 10);
            const bankCode = urlParams.get('vnp_BankCode');
            const bankTranNo = urlParams.get('vnp_BankTranNo');
            const cardType = urlParams.get('vnp_CardType');
            const vnpPayDate = urlParams.get('vnp_PayDate');
            const orderInfo = urlParams.get('vnp_OrderInfo');
            const txnRef = parseInt(urlParams.get('vnp_TxnRef'), 10);
                if (responseCode === '00') {
                    await axios.post(`http://localhost:8080/payment/save-payment`, null, {
                        params: {
                            transactionNo,
                            amount,
                            bankCode,
                            bankTranNo,
                            cardType,
                            vnpPayDate,
                            orderInfo,
                            txnRef
                        }
                    });
              
                    
                    navigate('/payment-success');
                } else {
                    navigate('/payment-failure');
                }
            } catch (error) {
                console.error('Error saving payment:', error);
                navigate('/payment-failure');
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const responseCode = urlParams.get('vnp_ResponseCode');

        if (responseCode && !paymentSavedRef.current) {
            paymentSavedRef.current = true;

            const paymentDetails = {
                responseCode,
                transactionNo: parseInt(urlParams.get('vnp_TransactionNo'), 10),
                amount: parseInt(urlParams.get('vnp_Amount'), 10),
                bankCode: urlParams.get('vnp_BankCode'),
                bankTranNo: urlParams.get('vnp_BankTranNo'),
                cardType: urlParams.get('vnp_CardType'),
                vnpPayDate: urlParams.get('vnp_PayDate'),
                orderInfo: urlParams.get('vnp_OrderInfo'),
                txnRef: parseInt(urlParams.get('vnp_TxnRef'), 10)
            };

            savePayment(paymentDetails);
        }
    }, [navigate, bookings]);

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
            status: "Paid",
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
        console.log("Booking Data to be sent:", bookingData);

        try {
            const token = localStorage.getItem('token');
            const bookingResponse = await axios.post('http://localhost:8080/booking/add', bookingData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Response from server:", bookingResponse);

            const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);
            const paymentResponse = await axios.get(`http://localhost:8080/payment/vn-pay`, {
                params: {
                    amount: totalCost,
                    bookingId: bookingResponse.data.data.bookingId
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Payment Response from server:", paymentResponse);

            window.location.href = paymentResponse.data.data;

            localStorage.removeItem('bookedInfo');
            localStorage.removeItem('selectedDate');
        } catch (error) {
            console.error('Payment failed:', error.response?.data || error);
            navigate('/payment-failure');
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
                    </div>
                );
            case 'paypal':
                return (
                    <div className="payment-details">
                        <img src={paypal} alt="PayPal" />
                        <p>You will be redirected to PayPal to complete your purchase.</p>
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
                    </div>
                );
            default:
                return <p>Please select a payment method.</p>;
        }
    };

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
                        <p><b>Notes:</b> </p>
                    </div>
                    <div className="booking-details">
                        <h5>Booking details</h5>
                        <BookingDetail bookings={bookings} showDeleteButton={false} />
                    </div>

                    {renderPaymentMethodDetails()}
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
                    <button onClick={handlePayClick}>Pay</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
