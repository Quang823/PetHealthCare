import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import './SuccessPaymentPage.scss'; // Import the CSS file

const SuccessFailurePage = () => {
    const navigate = useNavigate();

    const handleRetryPayment = () => {
        navigate('/booking-history');
    };

    const handleViewWallet = () => {
        navigate('/wallet');
    };

    return (
        <div className="success-failure-page">
            <div className="message-container failure">
                <FontAwesomeIcon icon={faTimesCircle} className="iconc failure-icon" />
                <h1>Payment Failed</h1>
                <p>Your payment has failed. Please try again or choose another payment method.</p>
                <div className="button-group">
                    <button className="btnc" onClick={handleRetryPayment}>Retry Payment</button>
                    <button className="btnc" onClick={handleViewWallet}>View Wallet</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessFailurePage;