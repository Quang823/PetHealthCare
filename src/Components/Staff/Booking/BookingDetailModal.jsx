import React from 'react';
import './BookingDetailModal.scss';

function BookingDetailModal({ bookingDetail, onClose, onSaveCage }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Booking Details</h3>
                <p><strong>Booking Detail ID:</strong> {bookingDetail.bookingDetailId}</p>
                <p><strong>Need Cage:</strong> {bookingDetail.needCage ? 'Yes' : 'No'}</p>
                <p><strong>Date:</strong> {new Date(bookingDetail.date).toLocaleString()}</p>
                <p><strong>Booking ID:</strong> {bookingDetail.booking.bookingId}</p>
                <p><strong>Booking Date:</strong> {new Date(bookingDetail.booking.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {bookingDetail.booking.status}</p>
                <p><strong>Total Price:</strong> ${bookingDetail.booking.totalPrice}</p>
                <h4>Pet Details</h4>
                <p><strong>Pet Name:</strong> {bookingDetail.pet.petName}</p>
                <p><strong>Pet Age:</strong> {bookingDetail.pet.petAge}</p>
                <p><strong>Pet Gender:</strong> {bookingDetail.pet.petGender}</p>
                <p><strong>Pet Type:</strong> {bookingDetail.pet.petType}</p>
                <p><strong>Vaccination:</strong> {bookingDetail.pet.vaccination}</p>
                <h4>Owner Details</h4>
                <p><strong>Owner Name:</strong> {bookingDetail.pet.user.name}</p>
                <p><strong>Email:</strong> {bookingDetail.pet.user.email}</p>
                <p><strong>Phone:</strong> {bookingDetail.pet.user.phone}</p>
                <p><strong>Address:</strong> {bookingDetail.pet.user.address}</p>
                <h4>Service Details</h4>
                <p><strong>Service Name:</strong> {bookingDetail.services.name}</p>
                <p><strong>Price:</strong> ${bookingDetail.services.price}</p>
                <p><strong>Description:</strong> {bookingDetail.services.description}</p>
                <h4>Slot Details</h4>
                <p><strong>Start Time:</strong> {bookingDetail.slot.startTime}</p>
                <p><strong>End Time:</strong> {bookingDetail.slot.endTime}</p>
                <button className="save-button" onClick={onSaveCage}>Save Cage</button>
                <button className="close-button" onClick={onClose}>Close</button>
                
            </div>
        </div>
    );
}

export default BookingDetailModal;