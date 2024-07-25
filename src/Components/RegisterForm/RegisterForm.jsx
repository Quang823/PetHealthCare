import { MdEmail } from "react-icons/md";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './RegisterForm.scss';
import { FaUser, FaPhoneAlt, FaAddressBook } from "react-icons/fa";
import logo from '../../Assets/v186_574.png';
import video from '../../Assets/7515875-hd_1080_1920_30fps.mp4';
import axios from "axios";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [nameError, setNameError] = useState("");
    const [IsShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isNameValid, setIsNameValid] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validatePhone = (phone) => {
        const re = /^\d{10}$/;
        return re.test(phone);
    };

    const validateName = (name) => {
        const re = /^[a-zA-Z\s]{6,}$/; // Regular expression to check for only letters and spaces, minimum 6 characters
        return re.test(name);
    };

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        const isValid = validateEmail(value);
        setEmailError(isValid ? "" : "Invalid email format");
        setIsEmailValid(isValid);
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        const isValid = validatePassword(value);
        setPasswordError(isValid ? "" : "Password must be at least 6 characters");
        setIsPasswordValid(isValid);
    };

    const handlePhoneChange = (event) => {
        const value = event.target.value;
        setPhone(value);
        const isValid = validatePhone(value);
        setPhoneError(isValid ? "" : "Phone number must be exactly 10 digits");
        setIsPhoneValid(isValid);
    };

    const handleNameChange = (event) => {
        const value = event.target.value;
        setName(value);
        const isValid = validateName(value);
        setNameError(isValid ? "" : "Name must be at least 6 characters and contain only letters and spaces");
        setIsNameValid(isValid);
    };

    const loginLink = (event) => {
        event.preventDefault();
        navigate('/login');
    };

    async function save(event) {
        event.preventDefault();

        if (!name || !email || !password || !phone) {
            toast.error("Please fill all the fields before submitting");
            return;
        }

        if (emailError || passwordError || phoneError || nameError) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post("http://localhost:8080/account/create", {
                name: name,
                address: address,
                phone: phone,
                email: email,
                password: password,
            });

            alert("Registration Successful");
            navigate('/login');
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const isLoginActive = email !== '' && password !== '' && name !== '';

    return (
        <div className="register-page flex">
            <div className="container flex">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h2 className="title">Your pet's happiness is our priority</h2>
                        <p>Furry friends, endless joy</p>
                    </div>
                    <div className="footerDiv flex">
                        <p>
                            Already have an account?
                            <a className="butn" onClick={loginLink}>Login</a>
                        </p>
                    </div>
                </div>
                <div className="formDiv flex">
                    <div className="headerDiv">
                        <div className="logo-container">
                            <img src={logo} alt="Logo image" className="logo" />
                        </div>
                    </div>
                    <div className="wrapper">
                        <h1>Register</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                value={name}
                                onChange={handleNameChange}
                                className={isNameValid ? 'valid' : 'invalid'}
                            />
                            <FaUser className="icon" />
                            {nameError && <p className="errors-messages">{nameError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                className={isEmailValid ? 'valid' : 'invalid'}
                            />
                            <MdEmail className="icon" />
                            {emailError && <p className="errors-messages">{emailError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type={IsShowPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={isPasswordValid ? 'valid' : 'invalid'}
                            />
                            <i
                                className={IsShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setIsShowPassword(!IsShowPassword)}
                            ></i>
                            {passwordError && <p className="errors-messages">{passwordError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Phone number"
                                value={phone}
                                onChange={handlePhoneChange}
                                className={isPhoneValid ? 'valid' : 'invalid'}
                            />
                            <FaPhoneAlt className="icon" />
                            {phoneError && <p className="errors-messages">{phoneError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                            />
                            <FaAddressBook className="icon" />
                        </div>
                        <div className="remember-forgot">
                            <label>
                                <input type="checkbox" /> I agree to terms & conditions
                            </label>
                        </div>
                        <button type="submit" className={isLoginActive ? "active" : ""}
                            onClick={save} disabled={isLoading}>
                            {isLoading ? (
                                <span className="spinner-container">
                                    <i className="spinner"></i> Register...
                                </span>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;