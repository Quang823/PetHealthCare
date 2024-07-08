import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './SuccessPaymentPage.scss'; // Import the CSS file

const SuccessPaymentPage = () => {
    const navigate = useNavigate();

    const handleViewHistory = () => {
        navigate('/booking-history');
    };

    const handleBackToBooking = () => {
        navigate('/booking');
    };

    return (
        <div className="success-failure-page">
            <div className="message-container success">
                <FontAwesomeIcon icon={faCheckCircle} className="iconc success-icon" />
                <h1>Payment Successful</h1>
                <p>Your payment was successful!</p>
                <div className="button-group">
                    <button className="btnc" onClick={handleViewHistory}>View Booking History</button>
                    <button className="btnc" onClick={handleBackToBooking}>Back to Booking</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPaymentPage;
