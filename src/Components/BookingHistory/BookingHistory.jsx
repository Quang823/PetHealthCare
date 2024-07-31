import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingHistory.scss';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const BookingHistory = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [unfilteredBookingHistory, setUnfilteredBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchDate, setSearchDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmPayment, setShowConfirmPayment] = useState(false);
    const [pendingPaymentBooking, setPendingPaymentBooking] = useState(null);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userID = decodedToken.User.map.userID; // Adjust if the structure is different
                const response = await axios.get(`http://localhost:8080/booking/getAllByUserId/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Sort by bookingId descending (newest first)
                const sortedData = response.data.sort((a, b) => b.bookingId - a.bookingId);
                setBookingHistory(sortedData);
                setUnfilteredBookingHistory(sortedData);
                console.log('Booking history fetched:', response.data);
            } catch (error) {
                console.error('Error fetching booking history:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingHistory();
    }, [showConfirmPayment]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = () => {
        const sortedData = [...bookingHistory].sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.date) - new Date(b.date);
            } else {
                return new Date(b.date) - new Date(a.date);
            }
        });
        setBookingHistory(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleDateFilter = () => {
        const filteredData = unfilteredBookingHistory.filter((booking) => {
            const bookingDate = new Date(booking.date).toDateString();
            const searchDateString = searchDate ? new Date(searchDate).toDateString() : '';
            return bookingDate === searchDateString;
        });
        setBookingHistory(filteredData);
    };

    const viewBookingDetails = async (bookingId) => {
        try {
            const response = await axios.get(`http://localhost:8080/bookingDetail/getAllByBookingId/${bookingId}`);
            console.log("Booking details fetched:", response);
            setSelectedBookingDetails(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBookingDetails(null);
    };

    const cancelBookingDetail = (bookingDetailId, userId) => {
        confirmAlert({
            title: 'Confirm Cancel',
            message: 'Cancellation of booking may not be 100% refundable. Please check carefully before you cancel your booking! Are you sure you want to cancel this booking detail?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await axios.get(`http://localhost:8080/bookingDetail/cancelBookingDetail/?bookingDetailID=${bookingDetailId}&userId=${userId}`);
                            if (response.data.status === "ok") {
                                // Update the booking detail status locally
                                setSelectedBookingDetails(prevDetails =>
                                    prevDetails.map(detail =>
                                        detail.bookingDetailId === bookingDetailId
                                            ? { ...detail, status: 'canceled' } // Update status
                                            : detail
                                    )
                                );

                                // Check if all details of a booking are canceled
                                const updatedDetails = selectedBookingDetails.map(detail =>
                                    detail.bookingDetailId === bookingDetailId
                                        ? { ...detail, status: 'canceled' }
                                        : detail
                                );

                                const allCanceled = updatedDetails.every(detail => detail.status === 'canceled');

                                // Update the booking status if all details are canceled
                                if (allCanceled) {
                                    setBookingHistory(prevHistory =>
                                        prevHistory.map(booking =>
                                            booking.bookingId === updatedDetails[0].bookingId
                                                ? { ...booking, status: 'canceled' }
                                                : booking
                                        )
                                    );
                                }

                                toast.success("Cancel success");
                            }
                            if (response.data.status === "failed") {
                                toast.error("This booking detail has bean cancelled");
                            }
                        } catch (error) {
                            console.error('Error canceling booking detail:', error);
                            toast.error("This booking detail has bean cancelled");
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => console.log('Cancel action declined.')
                }
            ]
        });
    };

    const handlePayment = (booking) => {
        setPendingPaymentBooking(booking);
        setShowConfirmPayment(true);

    };


    const confirmPayment = async () => {
        const token = localStorage.getItem('token');
        if (!token || !pendingPaymentBooking) {
            console.error('No token found in localStorage or no pending payment.');
            return;
        }

        try {
            const walletId = localStorage.getItem('walletId');
            const paymentData = {
                walletId: walletId,
                bookingId: pendingPaymentBooking.bookingId,
                amount: pendingPaymentBooking.totalPrice
            };

            const paymentResponse = await axios.post('http://localhost:8080/payment/pay-booking', paymentData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (paymentResponse.data.data === "Account balance is not enough to make transactions") {
                toast.error("Insufficient balance. Please add funds to your wallet.");
            } else if (paymentResponse.data.message === "Success") {
                toast.success("Payment successful!");
                setShowConfirmPayment(false);
                setPendingPaymentBooking(null);
            } else {
                toast.error("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error("Payment failed. Please try again.");
        }
    };

    useEffect(() => {
        console.log('Selected booking details updated:', selectedBookingDetails);
    }, [selectedBookingDetails]);

    if (loading) return (
        <div className="loading">
            <span role="img" aria-label="dog running">🐕‍🦺</span>
            <p>Loading...</p>
        </div>
    );
    if (error) return <p>Error: {error.message}</p>;
    return (
        <div className="booking-history-container">
            <div className="header-text">
                <h2>Booking History</h2>
            </div>
            <div className="search-sort-container">
                <input
                    type="text"
                    placeholder="Search by status..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className='SortbyDate' onClick={handleSort}>
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>
            <div className="filtersdate">
                <DatePicker
                    selected={searchDate}
                    onChange={(date) => setSearchDate(date)}
                    placeholderText="Select Date"
                    dateFormat="dd MMMM yyyy"
                />
                <button className='FilterbyDateRange' onClick={handleDateFilter}>Search Date</button>
            </div>
            <div className="booking-list">
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total Price</th>
                            {/* <th>Pet Name</th>
                            <th>Veterinarian Name</th>
                            <th>Slot</th>
                            <th>Service Name</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookingHistory.filter(booking =>
                            booking.status.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(booking => (
                            <tr key={booking.bookingId} className="booking-item">
                                <td>{booking.date}</td>
                                <td>{booking.status}</td>
                                <td>{booking.totalPrice}</td>
                                {/* <td>{booking.petName}</td>
                                <td>{booking.veterinarianName}</td>
                                <td>{booking.slot}</td>
                                <td>{booking.serviceName}</td> */}
                                <td>
                                    <button onClick={() => viewBookingDetails(booking.bookingId)}>View Booking Details</button>
                                    {booking.status.toLowerCase() === 'pending' && (
                                        <button onClick={() => handlePayment(booking)}>Pay Again</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showConfirmPayment && pendingPaymentBooking && (
                <div className="modal show">
                    <div className="modal-content">
                        <h3>Confirm Payment</h3>
                        <p>Are you sure you want to pay again for this booking?</p>
                        <p>Total amount: {pendingPaymentBooking.totalPrice}</p>
                        <button onClick={confirmPayment}>Confirm Payment</button>
                        <button onClick={() => {
                            setShowConfirmPayment(false);
                            setPendingPaymentBooking(null);
                        }}>Cancel</button>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="modal show">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>Booking Details</h3>
                        <table className="booking-details-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Veterinarian Name</th>
                                    <th>Need Cage</th>
                                    <th>Status</th>
                                    <th>Pet Name</th>
                                    <th>Pet Image</th>
                                    <th>Service Name</th>
                                    <th>Slot Time</th>
                                    <th>Total Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBookingDetails.map(detail => (
                                    <tr key={detail.bookingDetailId}>
                                        <td>{detail.date}</td>
                                        <td>{detail.user.name}</td>
                                        <td>{detail.needCage ? 'Yes' : 'No'}</td>
                                        <td>{detail.status}</td>
                                        <td>{detail.pet.petName}</td>
                                        <td>{detail.pet.imageUrl && <img src={detail.pet.imageUrl} alt={detail.pet.petName} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />}</td>
                                        <td>{detail.services.name}</td>
                                        <td>{detail.slot.startTime} - {detail.slot.endTime}</td>
                                        <td>{detail.services.price}</td>
                                        <td>
                                            <button onClick={() => cancelBookingDetail(detail.bookingDetailId, detail.pet.user.userId)}>Cancel</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
