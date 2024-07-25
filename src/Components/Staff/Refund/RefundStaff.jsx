import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Table, Button, Modal } from 'react-bootstrap';

const RefundStaff = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchRefunds = async () => {
            try {
                const response = await axios.get('http://localhost:8080/getRefund');
                setRefunds(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching refunds:', error);
                setLoading(false);
            }
        };

        fetchRefunds();
    }, []);

    const handleShowDetails = (bookingDetail) => {
        setSelectedBookingDetail(bookingDetail);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedBookingDetail(null);
    };

    return (
        <div className="container">
            <h1>Refunds</h1>
            {loading ? (
                <div className="loading-indicator">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Transaction No</th>
                            <th>Amount</th>
                            <th>Refund Percent</th>
                            <th>Refund Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refunds.map((refund, index) => (
                            <tr key={index}>
                                <td>{refund.transactionNo}</td>
                                <td>{refund.amount}</td>
                                <td>{refund.refundPercent}%</td>
                                <td>{new Date(refund.refundDate).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleShowDetails(refund.bookingDetail)}>
                                        Show Booking Detail
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {selectedBookingDetail && (
                <Modal show={showModal} onHide={handleClose} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Booking Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Booking Detail ID:</strong> {selectedBookingDetail.bookingDetailId}</p>
                        <p><strong>Need Cage:</strong> {selectedBookingDetail.needCage ? 'Yes' : 'No'}</p>
                        <p><strong>Date:</strong> {new Date(selectedBookingDetail.date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedBookingDetail.status}</p>
                        <h5>Booking Info</h5>
                        <p><strong>Booking ID:</strong> {selectedBookingDetail.booking.bookingId}</p>
                        <p><strong>Date:</strong> {new Date(selectedBookingDetail.booking.date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {selectedBookingDetail.booking.status}</p>
                        <p><strong>Total Price:</strong> {selectedBookingDetail.booking.totalPrice}</p>
                        <h5>Pet Info</h5>
                        <p><strong>Pet ID:</strong> {selectedBookingDetail.pet.petId}</p>
                        <p><strong>Pet Name:</strong> {selectedBookingDetail.pet.petName}</p>
                        <p><strong>Pet Age:</strong> {selectedBookingDetail.pet.petAge}</p>
                        <p><strong>Pet Gender:</strong> {selectedBookingDetail.pet.petGender}</p>
                        <p><strong>Pet Type:</strong> {selectedBookingDetail.pet.petType}</p>
                        <p><strong>Vaccination:</strong> {selectedBookingDetail.pet.vaccination}</p>
                        <p><strong>Stay Cage:</strong> {selectedBookingDetail.pet.stayCage ? 'Yes' : 'No'}</p>
                        <h5>User Info</h5>
                        <p><strong>User ID:</strong> {selectedBookingDetail.pet.user.userId}</p>
                        <p><strong>Name:</strong> {selectedBookingDetail.pet.user.name}</p>
                        <p><strong>Email:</strong> {selectedBookingDetail.pet.user.email}</p>
                        <p><strong>Phone:</strong> {selectedBookingDetail.pet.user.phone}</p>
                        <p><strong>Address:</strong> {selectedBookingDetail.pet.user.address}</p>
                        <p><strong>Role:</strong> {selectedBookingDetail.pet.user.role}</p>
                        <p><strong>Status:</strong> {selectedBookingDetail.pet.user.status}</p>
                        <h5>Service Info</h5>
                        <p><strong>Service ID:</strong> {selectedBookingDetail.services.serviceId}</p>
                        <p><strong>Name:</strong> {selectedBookingDetail.services.name}</p>
                        <p><strong>Price:</strong> {selectedBookingDetail.services.price}</p>
                        <p><strong>Description:</strong> {selectedBookingDetail.services.description}</p>
                        <img src={selectedBookingDetail.services.imageUrl} alt="Service" style={{ width: '100%' }} />
                        <h5>Slot Info</h5>
                        <p><strong>Slot ID:</strong> {selectedBookingDetail.slot.slotId}</p>
                        <p><strong>Start Time:</strong> {selectedBookingDetail.slot.startTime}</p>
                        <p><strong>End Time:</strong> {selectedBookingDetail.slot.endTime}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default RefundStaff;