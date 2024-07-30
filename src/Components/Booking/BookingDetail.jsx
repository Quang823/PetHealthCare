import React from 'react';
import './BookingDetail.scss';

const BookingDetail = ({ bookings, onDelete, showDeleteButton = true }) => {
    if (!bookings || bookings.length === 0) return null;

    // const handleDelete = (index) => {
    //     const updatedBookings = [...bookings];
    //     const bookingToDelete = updatedBookings[index];

    //     updatedBookings.splice(index, 1);
    //     localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings));

    //     const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
    //     if (bookingToDelete) {
    //         const doctorSlots = bookedSlots[bookingToDelete.doctorId] || [];
    //         bookedSlots[bookingToDelete.doctorId] = doctorSlots.filter(slot => slot !== `${bookingToDelete.slotTime}-${bookingToDelete.date}`);
    //         localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));
    //     }

    //     onDelete(updatedBookings);
    // };


    const handleDelete = (index) => {
        // Clone bookings array to avoid direct mutation
        const updatedBookings = [...bookings];
        const bookingToDelete = updatedBookings[index];

        if (!bookingToDelete) {
            // Exit if no booking found at the given index
            return;
        }

        // Remove the booking at the specified index
        updatedBookings.splice(index, 1);

        // Update local storage with the updated bookings list
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));

        // Update bookedSlots in local storage
        const bookedSlots = JSON.parse(localStorage.getItem('bookedSlots')) || {};
        if (bookingToDelete) {
            // Ensure there's an entry for the doctor in bookedSlots
            const doctorSlots = bookedSlots[bookingToDelete.doctorId] || [];

            // Remove the specific slot time for the date from the doctor's booked slots
            bookedSlots[bookingToDelete.doctorId] = doctorSlots.filter(slot => slot !== `${bookingToDelete.slotTime}-${bookingToDelete.date}`);

            // Update local storage with the updated booked slots
            localStorage.setItem('bookedSlots', JSON.stringify(bookedSlots));

        }

        // Call the onDelete callback to update the UI or perform any additional actions
        onDelete(updatedBookings);
    };


    return (
        <div className="booking-detail-container">
            {bookings.map((booking, index) => (
                <div key={index} className="booking-detail-card">
                    <p>Pet: {booking.petName} ; Service: {booking.serviceName} ; Doctor: {booking.doctorName} ;
                        Slot: {booking.slotTime} ; Cost: {booking.totalCost} VND; Date: {booking.date}
                    </p>
                    {showDeleteButton && (<button onClick={() => handleDelete(index)} className="deletes-button">Delete</button>
                    )}
                    {index < bookings.length - 1 && <hr />}
                </div>
            ))}
        </div>
    );
};

export default BookingDetail;
