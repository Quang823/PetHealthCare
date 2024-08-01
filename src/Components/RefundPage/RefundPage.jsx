import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './RefundPage.scss'; // Import the CSS file

const RefundPage = () => {
    const [refunds, setRefunds] = useState([]);
    const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchRefunds = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const userId = decoded.User.map.userID;

                const response = await axios.get(`http://localhost:8080/getRefundByUserId/${userId}`);
                console.log('Refunds Data:', response.data);  // In dữ liệu ra console
                setRefunds(response.data);
            } catch (error) {
                console.error('Error fetching refunds:', error);
            }
        };

        fetchRefunds();
    }, []);



    const handleViewDetails = async (bookingDetailId) => {
        try {
            const response = await axios.get(`http://localhost:8080/getRefundByBookingDetailId/${bookingDetailId}`);
            setSelectedBookingDetail(response.data.bookingDetail);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching booking detail:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBookingDetail(null);
    };

    return (
        <div className='refunds-page'>
            <h2>Refund History</h2>
            {refunds.length === 0 ? (
                <p>No refunds found.</p>
            ) : (
                <table className="refunds-table">
                    <thead>
                        <tr>
                            <th>Refund Date</th>
                            <th>Amount</th>
                            <th>Refund Percent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refunds.map((refund) => {

                            return (
                                <tr key={refund.transactionNo}>
                                    <td>{new Date(refund.refundDate).toLocaleDateString()}</td>
                                    <td>{refund.amount}</td>
                                    <td>{refund.refundPercent}%</td>
                                    <td>
                                        <button onClick={() => handleViewDetails(refund.bookingDetail.bookingDetailId)}>View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closeModal}>&times;</span>
                        <h3>Booking Detail</h3>
                        <table className="booking-detail-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>User Name</th>
                                    <th>Need Cage</th>
                                    <th>Status</th>
                                    <th>Pet Name</th>
                                    <th>Pet Image</th>
                                    <th>Service</th>
                                    <th>Slot</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{selectedBookingDetail.date}</td>
                                    <td>{selectedBookingDetail.user.name}</td>
                                    <td>{selectedBookingDetail.needCage ? 'Yes' : 'No'}</td>
                                    <td>{selectedBookingDetail.status}</td>
                                    <td>{selectedBookingDetail.pet.petName}</td>
                                    <td>
                                        {selectedBookingDetail.pet.imageUrl && (
                                            <img
                                                src={selectedBookingDetail.pet.imageUrl}
                                                alt={selectedBookingDetail.pet.petName}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </td>
                                    <td>{selectedBookingDetail.services.name}</td>
                                    <td>{selectedBookingDetail.slot.startTime} - {selectedBookingDetail.slot.endTime}</td>
                                    <td>{selectedBookingDetail.services.price}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefundPage;
