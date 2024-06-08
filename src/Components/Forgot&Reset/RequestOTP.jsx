import React, { useState } from 'react';
import axios from 'axios';
import './RequestOTP.scss';

const RequestOTP = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/request-otp', { email });
            setMessage(response.data.message);
            setToken(response.data.token);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="request-otp-container">
            <h2>Request OTP</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Get OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RequestOTP;
