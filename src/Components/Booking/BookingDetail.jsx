import React from 'react';
import './BookingDetail.scss';

const BookingDetail = ({ bookings, onDelete, showDeleteButton = true }) => {
    if (!bookings || bookings.length === 0) return null;

    const handleDelete = (index) => {
        const updatedBookings = [...bookings];
        const bookingToDelete = updatedBookings[index];

        updatedBookings.splice(index, 1);
        localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings));

        const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
        if (bookingToDelete) {
            const doctorSlots = bookedSlots[bookingToDelete.doctorId] || [];
            bookedSlots[bookingToDelete.doctorId] = doctorSlots.filter(slot => slot !== `${bookingToDelete.slotTime}-${bookingToDelete.date}`);
            localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
        }

        onDelete(updatedBookings);
    };

    return (
        <div className="booking-detail-container">
            {bookings.map((booking, index) => (
                <div key={index} className="booking-detail-card">
                    <p>Pet: {booking.petName} ; Service: {booking.serviceName} ; Doctor: {booking.doctorName} ;
                        Slot: {booking.slotTime} ; Cost: ${booking.totalCost}; Date: {booking.date}
                    </p>
                    {showDeleteButton && (<button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                    )}
                    {index < bookings.length - 1 && <hr />}
                </div>
            ))}
        </div>
    );
};

export default BookingDetail;
