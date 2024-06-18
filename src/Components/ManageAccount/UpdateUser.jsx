import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
const updateUser = async (userData) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userID = decodedToken.User.map.userID;
    console.log('Updating user:', userID, userData);
    try {
        const response = await axios.put(`http://localhost:8080/account/update/${userID}`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Update response:', response.data);

        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export default updateUser;