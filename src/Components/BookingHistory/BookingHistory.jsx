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
    const [selectedBookingDetails, setSelectedBookingDetails] = useState([]);
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

    const handleBookingClick = async (booking) => {
        try {
            const response = await axios.get(`http://localhost:8080/bookingDetail/getAllByBookingId/${booking.bookingId}`);
            setSelectedBooking(booking);
            setSelectedBookingDetails(response.data);
            console.log('bkdetail', response.data);
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedBooking(null);
        setSelectedBookingDetails([]);
    };

    const handleCancelBookingDetail = async (bookingDetailId) => {
        try {
            const response = await axios.get(`http://localhost:8080/bookingDetail/cancelBookingDetail/${bookingDetailId}`);
            if (response.data.status === "WAITING") {
                alert('Booking detail canceled successfully!');
                // Optionally, refresh the booking details or booking history
                if (selectedBooking) {
                    handleBookingClick(selectedBooking);
                }
            } else {
                alert('' + response.data.message);
            }
        } catch (error) {
            console.error('Error canceling booking detail:', error);
            alert('Failed to cancel booking detail.');
        }
    };


    const filteredData = bookingHistory.filter((booking) => {
        const bookingDate = booking.date ?? '';
        const bookingId = booking.bookingId.toString();
        const bookingStatus = booking.status?.toLowerCase() ?? '';

        return bookingDate.includes(searchTerm) ||
            bookingId.includes(searchTerm) ||
            bookingStatus.includes(searchTerm.toLowerCase());
    });

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

                    const statusClass = `timetable-item status ${booking.status.toLowerCase()}`;
                    const statusColor = booking.status.toLowerCase() === 'confirmed' ? 'green' : booking.status.toLowerCase() === 'paid' ? 'red' : '';

                    return (
                        <div
                            key={booking.bookingId}
                            className="timetable-row"
                            onClick={() => handleBookingClick(booking)}
                        >
                            <div className="timetable-item">{formattedDate}</div>
                            <div className="timetable-item">{booking.bookingId}</div>
                            <div className={`${statusClass} ${statusColor}`}>{booking.status}</div>
                            <div className="timetable-item">${booking.totalPrice}</div>
                        </div>
                    );
                })}
            </div>
            {selectedBooking && (
                <div className="modal">
                    <div className="custom-modal-content">
                        <span className="custom-close-button" onClick={handleCloseModal}>&times;</span>
                        <h2>Booking History Details</h2>
                        {selectedBookingDetails.map((detail, index) => (
                            <React.Fragment key={detail.bookingDetailId}>
                                <table className="table-section">
                                    <thead>
                                        <tr>
                                            <th colSpan="2">Booking Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-field-name">Booking Detail ID:</td>
                                            <td>{detail.bookingDetailId}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Need Cage:</td>
                                            <td>{detail.needCage ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Date:</td>
                                            <td>{new Date(detail.date).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Booking ID:</td>
                                            <td>{detail.booking?.bookingId}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Booking Date:</td>
                                            <td>{new Date(detail.booking?.date).toLocaleDateString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Status:</td>
                                            <td>{detail.status}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Total Price:</td>
                                            <td>${detail.booking?.totalPrice}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table-section">
                                    <thead>
                                        <tr>
                                            <th colSpan="2">Pet Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-field-name">Pet Name:</td>
                                            <td>{detail.pet?.petName}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Pet Age:</td>
                                            <td>{detail.pet?.petAge}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Pet Gender:</td>
                                            <td>{detail.pet?.petGender}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Pet Type:</td>
                                            <td>{detail.pet?.petType}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Vaccination:</td>
                                            <td>{detail.pet?.vaccination}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table-section">
                                    <thead>
                                        <tr>
                                            <th colSpan="2">Owner Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-field-name">Owner Name:</td>
                                            <td>{detail.pet?.user?.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Email:</td>
                                            <td>{detail.pet?.user?.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Phone:</td>
                                            <td>{detail.pet?.user?.phone}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Address:</td>
                                            <td>{detail.pet?.user?.address}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table-section">
                                    <thead>
                                        <tr>
                                            <th colSpan="2">Service Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-field-name">Service Name:</td>
                                            <td>{detail.services?.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Price:</td>
                                            <td>${detail.services?.price}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Description:</td>
                                            <td>{detail.services?.description}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table-section">
                                    <thead>
                                        <tr>
                                            <th colSpan="2">Veterinarian</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-field-name">Doctor Name:</td>
                                            <td>{detail.doctors?.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">Phone Number:</td>
                                            <td>{detail.doctors?.phone}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table className="table-section">
                                    <thead>
                                        <tr>
                                            <th colSpan="2">Slot Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="table-field-name">Start Time:</td>
                                            <td>{detail.slot?.startTime}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-field-name">End Time:</td>
                                            <td>{detail.slot?.endTime}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <button className="cancel-button" onClick={() => handleCancelBookingDetail(detail.bookingDetailId)}>
                                    Cancel Booking Detail
                                </button>

                                {index < selectedBookingDetails.length - 1 && <hr className="divider" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
