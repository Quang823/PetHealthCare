
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
 // Import the CSS file

const AddUser = () => {
    const [FormData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...FormData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/account/createmultirole', FormData);
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                address: '',
                role: '',
            });
            toast.success('Add successfully');
        } catch (er) {
            console.log(er);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={FormData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={FormData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={FormData.password} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={FormData.phone} onChange={handleChange} required />
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={FormData.address} onChange={handleChange} required />
            </div>
            <div>
                <label>Role:</label>
                <select name="role" value={FormData.role} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Veterinarian">Veterinarian</option>
                    <option value="Staff">Staff</option>
                    <option value="Customer">Customer</option>
                </select>
            </div>
            <button type="submit">Create User</button>
        </form>
    );
};

export default AddUser;
