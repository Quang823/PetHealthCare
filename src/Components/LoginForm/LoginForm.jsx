import React, { useState } from "react";
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import logo from '../Assets/v186_574.png';


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const isLoginActive = email !== '' && password !== '';
    const [IsShowPassword, setIsShowPassword] = useState(false);
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
                        <input type="text" placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        ></input>
                        <FaUser className="icon" />
                    </div>

                    <div className="input-box">
                        <input type={IsShowPassword === true ? "text" : "password"} placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <i className={IsShowPassword === true ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                            onClick={() => setIsShowPassword(!IsShowPassword)}></i>
                    </div>

                    <div className="remember-forgot">
                        <label> <input type="checkbox" />Remember me</label>
                        <a href="#">Forgot Password</a>
                    </div>

                    <button className={isLoginActive ? "active" : ""}
                        disabled={isLoginActive ? false : true}
                    >Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="#">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm