import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddUser.scss';

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
        file: null,
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: '',
        file: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        validateField(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp', 'image/svg+xml'];

        if (file && validImageTypes.includes(file.type)) {
            setFormData({
                ...formData,
                file
            });
            setErrors({
                ...errors,
                file: ''
            });
        } else {
            toast.error("Please select a valid image file (jpg, jpeg, png, gif, bmp, tiff, tif, webp, svg).");
            e.target.value = null; // Reset the file input
            setErrors({
                ...errors,
                file: 'Invalid image file'
            });
        }
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };

        switch (name) {
            case 'name':
                const nameRegex = /^[A-Za-z\s]+$/;
                newErrors.name = !value || !nameRegex.test(value) ? 'Name must not contain numbers and cannot be empty' : '';
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                newErrors.email = !value || !emailRegex.test(value) ? 'Valid email is required' : '';
                break;
            case 'password':
                newErrors.password = !value || value.length < 6 ? 'Password must be at least 6 characters long' : '';
                break;
            case 'phone':
                const phoneRegex = /^[0-9]{10}$/;
                newErrors.phone = !value || !phoneRegex.test(value) ? 'Valid 10-digit phone number is required' : '';
                break;
            case 'address':
                newErrors.address = !value ? 'Address is required' : '';
                break;
            case 'role':
                newErrors.role = !value ? 'Role is required' : '';
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { ...errors };

        Object.keys(formData).forEach((key) => {
            validateField(key, formData[key]);
        });

        if (!formData.file) {
            newErrors.file = 'Image file is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formDataToSend = new FormData();

            // Append form fields
            formDataToSend.append('request', JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                role: formData.role
            }));

            // Append file if selected
            if (formData.file) {
                formDataToSend.append('file', formData.file);
            }

            try {
                const res = await axios.post('http://localhost:8080/account/createmultirole', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // Reset form data
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    address: '',
                    role: '',
                    file: null,
                });
                setErrors({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    address: '',
                    role: '',
                    file: '',
                });
                toast.success('Add successfully');
            } catch (er) {
                console.log(er.response.data); // Log the error response for debugging
                toast.error('Error adding user');
            }
        } else {
            toast.error('Please fix the errors in the form');
        }
    };

    return (
        <div className='adduser-form-page'>
            <div className='adduser-form-header'>
                <h2>Add a new User</h2>
            </div>
            <form className="adduser-form" onSubmit={handleSubmit}>
                <div className="adduser-form-group">
                    <label className="adduser-label">Name:</label>
                    <input className="adduser-input" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    {errors.name && <span className="adduser-error">{errors.name}</span>}
                </div>
                <div className="adduser-form-group">
                    <label className="adduser-label">Email:</label>
                    <input className="adduser-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    {errors.email && <span className="adduser-error">{errors.email}</span>}
                </div>
                <div className="adduser-form-group">
                    <label className="adduser-label">Password:</label>
                    <input className="adduser-input" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    {errors.password && <span className="adduser-error">{errors.password}</span>}
                </div>
                <div className="adduser-form-group">
                    <label className="adduser-label">Phone:</label>
                    <input className="adduser-input" type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    {errors.phone && <span className="adduser-error">{errors.phone}</span>}
                </div>
                <div className="adduser-form-group">
                    <label className="adduser-label">Address:</label>
                    <input className="adduser-input" type="text" name="address" value={formData.address} onChange={handleChange} required />
                    {errors.address && <span className="adduser-error">{errors.address}</span>}
                </div>
                <div className="adduser-form-group">
                    <label className="adduser-label">Image:</label>
                    <input className="adduser-input" type="file" name="file" accept="image/*" onChange={handleFileChange} required />
                    {errors.file && <span className="adduser-error">{errors.file}</span>}
                </div>
                <div className="adduser-form-group">
                    <label className="adduser-label">Role:</label>
                    <select className="adduser-select" name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select Role</option>
                        <option value="Veterinarian">Veterinarian</option>
                        <option value="Staff">Staff</option>
                        <option value="Customer">Customer</option>
                    </select>
                    {errors.role && <span className="adduser-error">{errors.role}</span>}
                </div>
                <button className="adduser-submit-button" type="submit">Create User</button>
            </form>
        </div>
    );
};

export default AddUser;
