import React from 'react';
import './BookingDetailModal.scss';

const BookingDetailModal = ({ bookingDetail, onClose }) => {
    if (!bookingDetail) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Booking Detail</h2>
                <button className="close-button" onClick={onClose}>Close</button>
                <div className="detail">
                    <h3>Pet Information</h3>
                    <p>Name: {bookingDetail.pet.petName}</p>
                    <p>Age: {bookingDetail.pet.petAge}</p>
                    <p>Gender: {bookingDetail.pet.petGender}</p>
                    <p>Type: {bookingDetail.pet.petType}</p>
                    <p>Vaccination: {bookingDetail.pet.vaccination}</p>
                    <h3>Owner Information</h3>
                    <p>Name: {bookingDetail.pet.user.name}</p>
                    <p>Email: {bookingDetail.pet.user.email}</p>
                    <p>Phone: {bookingDetail.pet.user.phone}</p>
                    <p>Address: {bookingDetail.pet.user.address}</p>
                    <h3>Service Information</h3>
                    <p>Service: {bookingDetail.services.name}</p>
                    <p>Price: {bookingDetail.services.price}</p>
                    <p>Description: {bookingDetail.services.description}</p>
                    <h3>Slot Information</h3>
                    <p>Start Time: {bookingDetail.slot.startTime}</p>
                    <p>End Time: {bookingDetail.slot.endTime}</p>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;
