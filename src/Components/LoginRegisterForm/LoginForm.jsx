import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import logo from '../Assets/v186_574.png';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isLoginActive = email !== '' && password !== '';
    const [IsShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate();  // Initialize useNavigate

    const registerLink = (event) => {
        event.preventDefault();
        navigate('/register');  // Use navigate to go to the register page
    }

    const homePageLink = (event) => {
        event.preventDefault();
        navigate('/home');  // Use navigate to go to the home page
    }

    return (
        <div className="login-form">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
            </header>

            {/* LOGIN FORM */}
            <div className="wrapper">
                <form action="">
                    <h1>Login</h1>

                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <FaUser className="icon" />
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
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button
                        className={isLoginActive ? "active" : ""}
                        disabled={!isLoginActive}
                        onClick={homePageLink}
                    >
                        Login
                    </button>

                    <div className="register-link">
                        <p>
                            Don't have an account?
                            <a href="#" onClick={registerLink}> Register</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
