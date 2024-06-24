import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingHistory.scss';

const BookingHistory = () => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage.');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userID = decodedToken.User.map.userID;
                const response = await axios.get(`http://localhost:8080/booking/getAllById/${userID}`, {
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
    }, []);

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

    const handleBookingClick = (booking) => {
        setSelectedBooking(booking);
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
    };

    const filteredData = bookingHistory.filter((booking) =>
        booking.date.includes(searchTerm) ||
        booking.bookingId.toString().includes(searchTerm) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading...</p>;
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
                <button onClick={handleSort}>
                    Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>
            <div className="filters">
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
                <button onClick={handleDateFilter}>Filter by Date Range</button>
            </div>
            <div className="timetable">
                <div className="timetable-header">
                    <div className="timetable-header-item">Date</div>
                    <div className="timetable-header-item">Booking ID</div>
                    <div className="timetable-header-item">Status</div>
                    <div className="timetable-header-item">Total Price</div>
                </div>
                {filteredData.map((booking) => {
                    const date = new Date(booking.date);
                    const formattedDate = date.toLocaleDateString();
                    const formattedTime = date.toLocaleTimeString();
                    return (
                        <div
                            key={booking.bookingId}
                            className="timetable-row"
                            onClick={() => handleBookingClick(booking)}
                        >
                            <div className="timetable-item">{formattedDate}</div>
                            <div className="timetable-item">{booking.bookingId}</div>
                            <div className="timetable-item">{booking.status}</div>
                            <div className="timetable-item">${booking.totalPrice}</div>
                        </div>
                    );
                })}
            </div>
            {selectedBooking && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        <h2>Booking History Details</h2>
                        <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
                        <p><strong>Booking Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
                        <p><strong>Booking Time:</strong> {new Date(selectedBooking.date).toLocaleTimeString()}</p>
                        <p><strong>Total Price:</strong> ${selectedBooking.totalPrice}</p>
                        <p><strong>Status:</strong> {selectedBooking.status}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
