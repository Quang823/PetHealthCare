// src/components/EditUser.js

import React, { useState } from 'react';
import './ManageAccount.scss';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const EditUserForm = ({ user, onSave }) => {
    const [name, setName] = useState(user.name);
    const [email] = useState(user.email); // Email is not editable
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State for validation errors
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    // State for password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // Validation functions
    const validateName = (name) => /^[a-zA-Z\s]{6,12}$/.test(name);
    const validatePhone = (phone) => /^\d{10}$/.test(phone);
    const validatePassword = (password) => password.length >= 6;

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value) ? '' : 'Name must be between 6 and 12 characters, letters only.');
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);
        setPhoneError(validatePhone(value) ? '' : 'Phone number must be exactly 10 digits.');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(validatePassword(value) ? '' : 'Password must be at least 6 characters long.');
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setConfirmPasswordError(value === password ? '' : 'Passwords do not match.');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for any remaining errors
        if (nameError || phoneError || passwordError || confirmPasswordError) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        // Call the onSave function if no errors
        onSave({ name, email, phone, address, password });
    };

    return (
        <form className="edit-user-form" onSubmit={handleSubmit}>
            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className={nameError ? 'invalid' : 'valid'}
            />
            {nameError && <p className="error-message">{nameError}</p>}

            <label>Email:</label>
            <input
                type="email"
                value={email}
                disabled // Email is not editable
            />

            <label>Password:</label>
            <div className="password-container">
                <input
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    className={passwordError ? 'invalid' : 'valid'}
                />
                {/* <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button> */}
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}

            <label>Confirm Password:</label>
            <div className="password-container">
                <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={confirmPasswordError ? 'invalid' : 'valid'}
                />
                {/* <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button> */}
            </div>
            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}

            <label>Phone:</label>
            <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                className={phoneError ? 'invalid' : 'valid'}
            />
            {phoneError && <p className="error-message">{phoneError}</p>}

            <label>Address:</label>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <button type="submit">Save</button>
        </form>
    );
};

export default EditUserForm;
