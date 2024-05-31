import { MdEmail } from "react-icons/md";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RegisterForm.css';
import { FaUser } from "react-icons/fa";
import logo from '../Assets/v186_574.png';

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const isLoginActive = email !== '' && password !== '' && username !== '';
    const [IsShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate();  // Initialize useNavigate


    const loginLink = (event) => {
        event.preventDefault();
        navigate('/login');  // Use navigate to go to the register page
    }

    return (
        <div className="register-form">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
            </header>

            <div className="wrapper">
                <form action="">
                    <h1>Register</h1>

                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
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

                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" /> I agree to terms & conditions
                        </label>
                    </div>

                    <button
                        className={isLoginActive ? "active" : ""}
                        disabled={!isLoginActive}
                        onClick={loginLink}
                    >
                        Register
                    </button>

                    <div className="register-link">
                        <p>
                            Already have an account?
                            <a href="#" onClick={loginLink}> Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
