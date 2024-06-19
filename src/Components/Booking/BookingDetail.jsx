import React from 'react';
import './BookingDetail.scss';

const BookingDetail = ({ bookings, onDelete, showDeleteButton = true }) => {
    if (!bookings || bookings.length === 0) return null;

    const handleDelete = (index) => {
        // Tạo một bản sao của bookings
        const updatedBookings = [...bookings];
        // Xóa phần tử tại vị trí index
        updatedBookings.splice(index, 1);
        // Cập nhật localStorage với danh sách bookings đã được cập nhật
        localStorage.setItem('bookedInfo', JSON.stringify(updatedBookings));
        // Gọi onDelete với danh sách bookings đã được cập nhật
        onDelete(updatedBookings);
    };

    return (
        <div className="booking-detail-container">
            {bookings.map((booking, index) => (
                <div key={index} className="booking-detail-card">
                    <p>Pet: {booking.petName} ; Service: {booking.serviceName} ; Doctor: {booking.doctorName} ;
                        Slot: {booking.slotTime} ; Cost: ${booking.totalCost}
                    </p>
                    {showDeleteButton && (
                        <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                    )}
                    {index < bookings.length - 1 && <hr />}
                </div>
            ))}
        </div>
    );
};

export default BookingDetail;
