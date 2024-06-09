import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOTP } from '../../Service/UserService';
import './ForgetPassword.scss'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            let success = await getOTP(email);
            if (success && success === "Please check your email address to get OTP") {
                localStorage.setItem("email", email);
                console.log(success)
                navigate('/verify-otp');
                alert('Success');
            } else {
                alert('Failed to get OTP. Please try again.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="forget-container">
            <div className="form-container">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Get OTP</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
