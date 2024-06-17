// BookingHistory.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BookingHistory.scss';

const BookingHistory = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in localStorage.');
                    return;
                }
                const response = await axios.get('http://localhost:8080/bookings/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBookingHistory(response.data);
            } catch (error) {
                console.error('Error fetching booking history:', error);
            }
        };
        fetchBookingHistory();
    }, []);

    const handleSearch = (e) => {
        setSearchDate(e.target.value);
    };

    const filteredBookings = bookingHistory.filter(booking =>
        booking.date.includes(searchDate)
    );

    return (
        <div className='bookingHistory'>
            <h2>Booking History</h2>
            <div className='search-bar'>
                <input
                    type='date'
                    value={searchDate}
                    onChange={handleSearch}
                    placeholder='Search by date'
                />
            </div>
            <div className='history-list'>
                {filteredBookings.map(booking => (
                    <div key={booking.id} className='history-item'>
                        <p>Date: {booking.date}</p>
                        <p>Time: {booking.time}</p>
                        <Link to={`/booking-detail/${booking.id}`}>View</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingHistory;
