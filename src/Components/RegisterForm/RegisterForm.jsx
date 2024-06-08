import { MdEmail } from "react-icons/md";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RegisterForm.scss';
import { FaUser } from "react-icons/fa";
import logo from '../../Assets/v186_574.png';
import axios from "axios";
const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("")
    const [address, setAddress] = useState("");
    const isLoginActive = email !== '' && password !== '' && name !== '';
    const [IsShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate();  // Initialize useNavigate


    const loginLink = (event) => {
        event.preventDefault();
        navigate('/');  // Use navigate to go to the register page
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
            alert("Employee Registation Successfully");
            navigate('/login')
        } catch (err) {
            alert(err);
        }
    }

    return (
        <div className="register-page">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
            </header>
            <div className="formDiv">
                <div className="wrapper">
                    <form action="">
                        <h1>Register</h1>

                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Name"
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
        </div>
    );
}

export default RegisterForm;