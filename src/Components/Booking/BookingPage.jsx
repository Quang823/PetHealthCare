// src/pages/BookingPage.js

import React, { useState } from 'react';
import BookingForm from './BookingForm';
import BookingDetail from './BookingDetail';
import { Link, useNavigate } from "react-router-dom";
import './BookingPage.scss';

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const Payment = () => {
        navigate('/payment');
    }
    const handleBookingComplete = (newBooking) => {
        setBookings([...bookings, newBooking]);
    };


    const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);

    return (
        <div className="booking-page-container">
            <BookingForm onBookingComplete={handleBookingComplete} />
            {bookings.length > 0 && (
                <div className="booking-summary-container">
                    <h2>Booking Details</h2>
                    <BookingDetail bookings={bookings} />
                    <div className="booking-total-cost">Total Cost: ${totalCost.toFixed(2)}</div>

                    <button id='paymentbutton' onClick={Payment}>Payment</button>

                </div>
            )}
        </div>
    );
};

export default BookingPage;

