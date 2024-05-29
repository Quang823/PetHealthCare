import React from "react";
import './register.css';
import { FaUser,FaLock, } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
const Register = ()  =>{
    return (
        <div className="wrapper">
        <div className="signup-form">
        <form action="">
           <h1>Register</h1>
        <div className="input-box">
            <input type="text" placeholder="Username" required>
            </input> <FaUser className="icon" />
        </div>
        <div className="input-box">
            <input type="password" placeholder="Password" required>
            </input> <FaLock className="icon" />
        </div>
        <div className="input-box">
            <input type="text" placeholder="Email" required>
            </input> <SiGmail className="icon" />
        </div>
        <div className="agree">
        <label >
        <input type="checkbox" /> 
         Agree with 
        </label>
        </div>
        <button type="submit">
          Register
        </button>
        </form>

        </div>

        </div>
    );
};
export default Register;