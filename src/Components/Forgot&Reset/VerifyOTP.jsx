import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerifyOtp } from '../../Service/UserService';
import './VerifyOTP.scss'; // Import CSS

const VerifyOTP = () => {
    const [otp, setOTP] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy email từ localStorage
        const storedEmail = localStorage.getItem('email');
        setEmail(storedEmail);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let success = await VerifyOtp(email, otp);
            if (success && success === "Enter your new password") {
                navigate('/reset-password');
                alert('Success');
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="verify-container">
            <div className="form-container">
                <h2>Verify OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Verify OTP</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
