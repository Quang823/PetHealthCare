
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './ManageAccount.scss';
import EditUserForm from './EditUser';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ManageAccount = () => {
    const [user, setUser] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage.');
                return;
            }

            const decodedToken = jwtDecode(token);
            const userID = decodedToken.User.map.userID;
            if (!userID) {
                console.error('No user ID found in token.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/account/getaccount/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                console.error('Error fetching user info:', error);
                toast.error('Error fetching user information. Please try again later.');
            }
        };

        fetchUserInfo();
    }, [isEditing]);

    if (!user) {
        return <div>Loading user information...</div>;
    }

    const handleSave = async (updatedUser) => {
        console.log('Saving updated user:', updatedUser);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(token);
            const userID = decodedToken.User.map.userID;

            const formData = new FormData();
            formData.append("request", JSON.stringify({
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                password: updatedUser.password,
            }));


            if (updatedUser.file) {
                formData.append("file", updatedUser.file);
            }

            const response = await axios.put(
                `http://localhost:8080/account/update/${userID}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Update response:', response.data);
            toast.success("Update successful");
            setIsEditing(false);

            setUser(response.data);
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user information. Please try again later.');
        }
    };

    return (
        <div className='container111'>
            <h1>User Information</h1>
            {isEditing ? (
                <EditUserForm user={user} onSave={handleSave} />
            ) : (
                <div>
                    <p>Name: {user?.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    <p>Address: {user.address}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default ManageAccount;
