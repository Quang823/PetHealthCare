import React, { useState, useEffect } from 'react';
import BookingForm from './BookingForm';
import BookingDetail from './BookingDetail';
import { useNavigate } from "react-router-dom";
import './BookingPage.scss';

const BookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedBookings = JSON.parse(localStorage.getItem('bookedInfo')) || [];
        setBookings(storedBookings);
    }, []);

    const Payment = () => {
        navigate('/payment');
    };

    const handleBookingComplete = (newBooking) => {
        const existingBooking = bookings.find(
            (booking) => booking.petId === newBooking.petId && booking.slotTime === newBooking.slotTime
        );

        if (existingBooking) {
            alert('This pet already has a booking for this slot.');
            return;
        }

        const updatedBookings = [...bookings, newBooking];
        setBookings(updatedBookings);
        localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings));
        localStorage.setItem('selectedDate', newBooking.date);
    };

    const handleDelete = (updatedBookings) => {
        setBookings(updatedBookings);
    };

    const totalCost = bookings.reduce((acc, booking) => acc + parseFloat(booking.totalCost), 0);

    const bookedSlots = bookings.map((booking) => booking.slotTime.toString());

    return (
        <div className="booking-page-container">
            <div className="booking-page-content">
                <div className="booking-form-container">
                    <BookingForm onBookingComplete={handleBookingComplete} bookedSlots={bookedSlots} />
                </div>
                {bookings.length > 0 && (
                    <div className="booking-detail-wrapper">
                        <h3>Booking Details</h3>
                        <BookingDetail bookings={bookings} onDelete={handleDelete} showDeleteButton={true} />
                        <div className="booking-total-cost">Total Cost: ${totalCost.toFixed(2)}</div>
                        <button id='paymentbutton' onClick={Payment}>Payment</button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default BookingPage;
