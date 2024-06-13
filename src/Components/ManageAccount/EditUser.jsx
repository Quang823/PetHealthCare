import React, { useState } from 'react';
import './ManageAccount.scss'
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const EditUserForm = ({ user, onSave }) => {
   
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [address, setAddress] = useState(user.address);
    const [password,setPassWord] = useState(user.password);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Gọi hàm onSave để cập nhật thông tin người dùng
        onSave({ name, email, phone, address,password  });
    };

    return (
        <form className="edit-user-form" onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassWord(e.target.value)} />
            <label>Phone:</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <label>Address:</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            <button type="submit">Save</button>
        </form>
    );
};
export default EditUserForm;