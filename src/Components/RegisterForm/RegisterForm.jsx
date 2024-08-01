import { MdEmail } from "react-icons/md";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './RegisterForm.scss';
import { FaUser, FaPhoneAlt, FaAddressBook } from "react-icons/fa";
import logo from '../../Assets/v186_574.png';
import video from '../../Assets/7515875-hd_1080_1920_30fps.mp4';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from "axios";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [nameError, setNameError] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isNameValid, setIsNameValid] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
        const re = /^[a-zA-Z\s]{6,15}$/;
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
        validateConfirmPassword(confirmPassword, value);
    };

    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        setConfirmPassword(value);
        validateConfirmPassword(value, password);
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        const isValid = confirmPassword === password && validatePassword(confirmPassword);
        setConfirmPasswordError(isValid ? "" : "Passwords do not match or password is invalid");
        setIsConfirmPasswordValid(isValid);
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
        setNameError(isValid ? "" : "Name must be between 6 and 15 characters (letters only)");
        setIsNameValid(isValid);
    };

    const loginLink = (event) => {
        event.preventDefault();
        navigate('/login');
    };

    async function save(event) {
        event.preventDefault();

        if (!name || !email || !password || !confirmPassword || !phone) {
            toast.error("Please fill all the fields before submitting");
            return;
        }

        if (emailError || passwordError || confirmPasswordError || phoneError || nameError) {
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

            toast.success("Registration Successful");
            navigate('/login');
        } catch (err) {
            toast.error("Email already exists, please change to another email");
        } finally {
            setIsLoading(false);
        }
    }

    const isLoginActive = email !== '' && password !== '' && confirmPassword !== '' && name !== '';

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
                            <FaUser className="iconm" />
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
                            <MdEmail className="iconm" />
                            {emailError && <p className="errors-messages">{emailError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type={isShowPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                className={isPasswordValid ? 'valid' : 'invalid'}
                            />
                            <i
                                className={isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setIsShowPassword(!isShowPassword)}
                            ></i>
                            {passwordError && <p className="errors-messages">{passwordError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type={isShowConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className={isConfirmPasswordValid ? 'valid' : 'invalid'}
                            />
                            <i
                                className={isShowConfirmPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                            ></i>
                            {confirmPasswordError && <p className="errors-messages">{confirmPasswordError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Phone number"
                                value={phone}
                                onChange={handlePhoneChange}
                                className={isPhoneValid ? 'valid' : 'invalid'}
                            />
                            <FaPhoneAlt className="iconm" />
                            {phoneError && <p className="errors-messages">{phoneError}</p>}
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Address"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}
                            />
                            <FaAddressBook className="iconm" />
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
