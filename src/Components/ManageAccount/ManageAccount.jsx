// src/components/UserInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import updateUser from './EditUser';
import UpdateUser from './UpdateUser';
import './ManageAccount.scss'
import { toast } from "react-toastify";
import EditUserForm from './EditUser';

const ManageAccount = () => {
    const [user, setUser] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userID = decodedToken.User.userID;
            if (!token || !userID) {
                console.error('No token or user ID found in localStorage.');
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
            const decodedToken = jwtDecode(token);
            const userID = decodedToken.User.userID;
            const response = await axios.put(
                `http://localhost:8080/account/update/${userID}`,
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Update response:', response.data);
            toast.success("Update sucessfull");
            setIsEditing(false);
            // You can update the state here if needed
            // (but it might be redundant based on your API response)
        } catch (error) {
            console.error('Error updating user:', error);
            toast.success("Update fail !!!.Try again");
            throw error;
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
};;

export default ManageAccount;
