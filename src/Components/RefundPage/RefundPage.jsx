import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';

const RefundPage = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchRefunds = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
                if (!token) {
                    throw new Error('No token found');
                }

                const decodedToken = jwtDecode(token);
                const userId = decodedToken.User.map.userID;

                const response = await axios.get(`http://localhost:8080/refund/getRefundByUserId/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Refunds fetched:', response.data);
                setRefunds(response.data);
            } catch (error) {
                console.error('Error fetching refunds:', error);
                console.log('Error details:', error.response);
                setError(`Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchRefunds();
    }, []);

    const handleViewClick = async (bookingDetailId) => {
        try {
            const response = await axios.get(`http://localhost:8080/refund/getRefundByBookingDetailId/${bookingDetailId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Booking details fetched:', response.data);
            setBookingDetails([response.data]);
            setIsModalOpen(true); // Open modal when data is fetched
        } catch (error) {
            console.error('Error fetching booking details:', error);
            setError('Failed to fetch booking detail');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Refunds</h1>
            <table>
                <thead>
                    <tr>
                        <th>Transaction No</th>
                        <th>Amount</th>
                        <th>Refund Percent</th>
                        <th>Refund Date</th>
                        <th>Booking Detail ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {refunds.map(refund => (
                        <tr key={refund.transactionNo}>
                            <td>{refund.transactionNo}</td>
                            <td>{refund.amount}</td>
                            <td>{refund.refundPercent}</td>
                            <td>{refund.refundDate}</td>
                            <td>{refund.bookingDetail?.id}</td>
                            <td>
                                <button onClick={() => handleViewClick(refund.bookingDetail?.id)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Booking Details"
            >
                <h2>Booking Details</h2>
                {bookingDetails.length === 0 ? (
                    <p>No booking details found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Need Cage</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Booking ID</th>
                                <th>Pet ID</th>
                                <th>User ID</th>
                                <th>Service ID</th>
                                <th>Slot ID</th>
                                <th>Feedback</th>
                                <th>Refund</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingDetails.map(detail => (
                                <tr key={detail.id}>
                                    <td>{detail.needCage ? 'Yes' : 'No'}</td>
                                    <td>{detail.date}</td>
                                    <td>{detail.status}</td>
                                    <td>{detail.booking.id}</td>
                                    <td>{detail.pet.id}</td>
                                    <td>{detail.user.id}</td>
                                    <td>{detail.services.id}</td>
                                    <td>{detail.slot.id}</td>
                                    <td>{detail.feedback ? 'Yes' : 'No'}</td>
                                    <td>{detail.refund ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <button onClick={() => setIsModalOpen(false)}>Close</button>
            </Modal>
        </div>
    );
};

export default RefundPage;
