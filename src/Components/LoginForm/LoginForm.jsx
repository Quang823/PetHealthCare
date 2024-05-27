import React from "react";
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import logo from '../Assets/v186_574.png';


const LoginForm = () => {
    return (
        <div className="login-form">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
            </header>
            <div className="wrapper">
                <form action="">
                    <h1>Login</h1>

                    <div className="input-box">
                        <input type="text" placeholder="Username" required></input>
                        <FaUser className="icon" />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder="Password" required></input>
                        <FaLock className="icon" />
                    </div>

                    <div className="remember-forgot">
                        <label> <input type="checkbox" />Remember me</label>
                        <a href="#">Forgot Password</a>
                    </div>

                    <button type="submit" className="button-login">Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="#">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default LoginForm