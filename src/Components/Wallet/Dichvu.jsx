// src/components/DichVu.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DichVu.scss';

const DichVu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const vnpResponseCode = searchParams.get('vnp_ResponseCode');

    const handleGoBack = () => {
        navigate('/wallet');
    };

    return (
        <div className="dichvu">
            {vnpResponseCode === '00' ? (
                <div className="notification success">
                    <h2>Payment Successful</h2>
                    <p>Your wallet has been updated.</p>
                </div>
            ) : (
                <div className="notification failure">
                    <h2>Payment Failed</h2>
                    <p>There was an issue with your payment. Please try again.</p>
                </div>
            )}
            <button className="go-back-button" onClick={handleGoBack}>Go Back</button>
        </div>
    );
};

export default DichVu;
