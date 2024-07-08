import React from 'react';
import './BookingDetailModal.scss';
import { FaTimes } from 'react-icons/fa'; // Using react-icons for a better close button

const BookingDetailModal = ({ bookingDetail, onClose }) => {
    if (!bookingDetail) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ color: '#2c3e50' }}>Booking Detail</h2> {/* Professional dark color for header */}
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                <div className="detail">
                    <div className="table-container">
                        <h3>Pet Information</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{bookingDetail.pet.petName}</td>
                                </tr>
                                <tr>
                                    <th>Age</th>
                                    <td>{bookingDetail.pet.petAge}</td>
                                </tr>
                                <tr>
                                    <th>Gender</th>
                                    <td>{bookingDetail.pet.petGender}</td>
                                </tr>
                                <tr>
                                    <th>Type</th>
                                    <td>{bookingDetail.pet.petType}</td>
                                </tr>
                                <tr>
                                    <th>Vaccination</th>
                                    <td>{bookingDetail.pet.vaccination}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="table-container">
                        <h3>Owner Information</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{bookingDetail.pet.user.name}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{bookingDetail.pet.user.email}</td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>{bookingDetail.pet.user.phone}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>{bookingDetail.pet.user.address}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="table-container">
                        <h3>Service Information</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Service</th>
                                    <td>{bookingDetail.services.name}</td>
                                </tr>
                                <tr>
                                    <th>Price</th>
                                    <td>{bookingDetail.services.price}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{bookingDetail.services.description}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="table-container">
                        <h3>Slot Information</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Start Time</th>
                                    <td>{bookingDetail.slot.startTime}</td>
                                </tr>
                                <tr>
                                    <th>End Time</th>
                                    <td>{bookingDetail.slot.endTime}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailModal;
