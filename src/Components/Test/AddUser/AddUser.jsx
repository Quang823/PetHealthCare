import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
        imageUrl: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
        imageUrl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ''
        });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = {
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            role: '',
            imageUrl: '',
        };

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!formData.name || !nameRegex.test(formData.name)) {
            newErrors.name = 'Name must not contain numbers and cannot be empty';
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Valid email is required';
            valid = false;
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            valid = false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Valid 10-digit phone number is required';
            valid = false;
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
            valid = false;
        }

        if (!formData.imageUrl) {
            newErrors.imageUrl = 'Image URL is required';
            valid = false;
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const res = await axios.post('http://localhost:8080/account/createmultirole', formData);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    address: '',
                    role: '',
                    imageUrl: '',
                });
                toast.success('Add successfully');
            } catch (er) {
                console.log(er);
                toast.error('Error adding user');
            }
        } else {
            toast.error('Please fix the errors in the form');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div>
                <label>Address:</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                {errors.address && <span className="error">{errors.address}</span>}
            </div>
            <div>
                <label>Image URL:</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                {errors.imageUrl && <span className="error">{errors.imageUrl}</span>}
            </div>
            <div>
                <label>Role:</label>
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Veterinarian">Veterinarian</option>
                    <option value="Staff">Staff</option>
                    <option value="Customer">Customer</option>
                </select>
                {errors.role && <span className="error">{errors.role}</span>}
            </div>
            <button type="submit">Create User</button>
        </form>
    );
};

export default AddUser;
