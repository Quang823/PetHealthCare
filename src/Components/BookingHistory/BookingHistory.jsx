import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingHistory.scss';
import { toast } from 'react-toastify';

const BookingHistory = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userID = decodedToken.User.map.userID;  // Adjust if the structure is different
                const response = await axios.get(`http://localhost:8080/booking/getAllByUserId/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBookingHistory(response.data);
            } catch (error) {
                console.error('Error fetching booking history:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookingHistory();
    }, [isModalOpen]);

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
        const filteredData = bookingHistory.filter((booking) => {
            const bookingDate = new Date(booking.date);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date();
            return bookingDate >= start && bookingDate <= end;
        });
        setBookingHistory(filteredData);
    };

    const viewBookingDetails = async (bookingId) => {
        try {
            const response = await axios.get(`http://localhost:8080/bookingDetail/getAllByBookingId/${bookingId}`);
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
    const cancelBookingDetail = async (bookingDetailId, userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/bookingDetail/cancelBookingDetail/?bookingDetailID=${bookingDetailId}&userId=${userId}`);
            if (response.data.status === "ok") {
                // Filter out the canceled booking detail
                setSelectedBookingDetails(prevDetails => 
                    prevDetails.filter(detail => detail.bookingDetailId !== bookingDetailId)
                );
                toast.success("Cancel success")// Show success message
            }
        } catch (error) {
            console.error('Error canceling booking detail:', error);
            toast.error("Failed to cancel booking detail");
        }
    };
    

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
                    placeholder="Search by booking ID or status..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className='SortbyDate' onClick={handleSort}>
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>
            <div className="filtersdate">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                    dateFormat="yyyy/MM/dd"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End Date"
                    dateFormat="yyyy/MM/dd"
                />
                <button className='FilterbyDateRange' onClick={handleDateFilter}>Filter by Date Range</button>
            </div>
            <div className="booking-list">
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingHistory.filter(booking => 
                            booking.bookingId.toString().includes(searchTerm) ||
                            booking.status.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(booking => (
                            <tr key={booking.bookingId} className="booking-item">
                                <td>{booking.bookingId}</td>
                                <td>{booking.date}</td>
                                <td>{booking.status}</td>
                                <td>{booking.totalPrice}</td>
                                <td>
                                    <button onClick={() => viewBookingDetails(booking.bookingId)}>View Booking Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <div className="modal show">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>Booking Details</h3>
                        <table className="booking-details-table">
                            <thead>
                                <tr>
                                    <th>Booking Detail ID</th>
                                    <th>Need Cage</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Pet Name</th>
                                    <th>Service Name</th>
                                    <th>Slot Time</th>
                                    <th>Acction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBookingDetails.map(detail => (
                                    <tr key={detail.bookingDetailId}>
                                        <td>{detail.bookingDetailId}</td>
                                        <td>{detail.needCage ? 'Yes' : 'No'}</td>
                                        <td>{detail.date}</td>
                                        <td>{detail.status}</td>
                                        <td>{detail.pet.petName}</td>
                                        <td>{detail.services.name}</td>
                                        <td>{detail.slot.startTime} - {detail.slot.endTime}</td>
                                        <td>
                                        <button onClick={() => cancelBookingDetail(detail.bookingDetailId, detail.pet.user.userId)}>Cancle</button>
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