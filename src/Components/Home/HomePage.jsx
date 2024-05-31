import React, { useState } from "react";
import './HomePage.css';
import { useNavigate } from "react-router-dom";


const HomePage = () => {
    const navigate = useNavigate();
    const LoginLink = (event) => {
        event.preventDefault();
        navigate('/login');  // Use navigate to go to the register page
    }

    return (
        <div className="Tittle">
            <h1>HomePage</h1>
            <a href="#" onClick={LoginLink}> Logout</a>
        </div>
    )
}
export default HomePage