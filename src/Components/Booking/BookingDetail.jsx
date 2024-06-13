// src/components/BookingDetail.js
import React from 'react';
import './BookingDetail.scss';
const BookingDetail = ({ bookings }) => {
    if (!bookings || bookings.length === 0) return null;

    return (
        <div className="booking-detail-container">
            {bookings.map((booking, index) => (
                <div key={index} className="booking-detail-card">
                    <p>Pet: {booking.petName} ; Service: {booking.serviceName} ; Doctor: {booking.doctorName} ;
                        Slot: {booking.slotTime} ; Cost: ${booking.totalCost}
                    </p>
                    {index < bookings.length - 1 && <hr />}
                </div>
            ))}
        </div>
    );
};

export default BookingDetail;