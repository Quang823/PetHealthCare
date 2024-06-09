import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetAccPassword } from '../../Service/UserService';
import './ResetPassword.scss'; // Import CSS

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Lấy email từ localStorage
        const storedEmail = localStorage.getItem('email');
        setEmail(storedEmail);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        try {
            let success = await ResetAccPassword(email,password);
            if (success && success === "Reset password successfully") {
                alert('Password reset successfully. You can now login with your new password.');
                navigate('/login');
            } else {
                alert('Failed to reset password. Please try again.');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="reset-container">
            <div className="form-container">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
