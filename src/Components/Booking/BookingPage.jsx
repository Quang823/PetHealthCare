import React, { useState } from 'react';
import BookingForm from './BookingForm';
import BookingDetail from './BookingDetail';
import { useNavigate } from "react-router-dom";
import './BookingPage.scss';

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    const Payment = () => {
        navigate('/payment');
    };

    const handleBookingComplete = (newBooking) => {
        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings)); // Lưu thông tin booking vào localStorage
        localStorage.setItem('selectedDate', newBooking.date); // Lưu ngày đã chọn vào localStorage
    };

    const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);

    return (
        <div className="booking-page-container">
            <div className="booking-page-content">
                <div className="booking-form-container">
                    <BookingForm onBookingComplete={handleBookingComplete} />
                </div>
                {bookings.length > 0 && (
                    <div className="booking-detail-container">
                        <h2>Booking Details</h2>
                        <BookingDetail bookings={bookings} />
                        <div className="booking-total-cost">Total Cost: ${totalCost.toFixed(2)}</div>
                        <button id='paymentbutton' onClick={Payment}>Payment</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
