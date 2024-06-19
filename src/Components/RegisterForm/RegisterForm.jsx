import { MdEmail } from "react-icons/md";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RegisterForm.scss';
import { FaUser, FaPhoneAlt, FaAddressBook } from "react-icons/fa";
import logo from '../../Assets/v186_574.png';
import video from '../../Assets/7515875-hd_1080_1920_30fps.mp4';
import axios from "axios";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("")
    const [address, setAddress] = useState("");
    const isLoginActive = email !== '' && password !== '' && name !== '';
    const [IsShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();  // Initialize useNavigate


    const loginLink = (event) => {
        event.preventDefault();
        navigate('/login');  // Use navigate to go to the register page
    }
    async function save(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8080/account/create", {
                name: name,
                address: address,
                phone: phone,
                email: email,
                password: password,
            });

            alert("Registation Successfully");
            navigate('/login')
        } catch (err) {
            alert(err);
        }
    }

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
                                onChange={(event) => setName(event.target.value)}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <MdEmail className="icon" />
                        </div>

                        <div className="input-box">
                            <input
                                type={IsShowPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <i
                                className={IsShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                                onClick={() => setIsShowPassword(!IsShowPassword)}
                            ></i>
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Phone number"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                            />
                            <FaPhoneAlt className="icon" />
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

                        <button type="submit" className={isLoginActive ? "active" : ""

                        } onClick={save} disabled={isLoading}>
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
}

export default RegisterForm;