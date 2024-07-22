import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingStaff.scss';

const BookingStaff = () => {
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
        const userID = decodedToken.User.map.userID;
        const response = await axios.get(`http://localhost:8080/booking/getAll`, {
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

  const handleConfirm = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/booking/update/status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Confirmed' }),
      });

      if (response.ok) {
        // Update the status in the state without reloading the page
        setBookingHistory((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, status: 'Confirmed' } : booking
          )
        );
      } else {
        console.error('Error updating booking status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setSelectedBookingDetails([]);
  };

  const filteredData = bookingHistory
    .filter((booking) => booking.status !== 'CANCELLED')
    .filter((booking) => {
      const bookingDate = booking.date ?? '';
      const bookingId = booking.bookingId.toString();
      const bookingStatus = booking.status?.toLowerCase() ?? '';

      return bookingDate.includes(searchTerm) ||
        bookingId.includes(searchTerm) ||
        bookingStatus.includes(searchTerm.toLowerCase());
    });

  if (loading) return (
    <div className="loading-indicator">
      <span role="img" aria-label="dog running">🐕‍🦺</span>
      <p>Loading...</p>
    </div>
  );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="booking-staff">
      <div className="header">
        <h2>Booking Staff</h2>
      </div>
      <div className="search-sort">
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
      <div className="table">
        <div className="table-header">
          <div className="header-item">Date</div>
          <div className="header-item">Booking ID</div>
          <div className="header-item">Status</div>
          <div className="header-item">Total Price</div>
          <div className="header-item">Actions</div>
        </div>
        {filteredData.map((booking) => {
          const date = new Date(booking.date);
          const formattedDate = date.toLocaleDateString();

          return (
            <div
              key={booking.bookingId}
              className="table-row"
            >
              <div className="table-item">{formattedDate}</div>
              <div className="table-item">{booking.bookingId}</div>
              <div className={`table-item status ${booking.status.toLowerCase()}`}>{booking.status}</div>
              <div className="table-item">${booking.totalPrice}</div>
              <div className="table-item">
                <button className='btx' onClick={() => handleBookingClick(booking)}>View</button>
                <button className='btx' onClick={() => handleConfirm(booking.bookingId)}>Confirm</button>
              </div>
            </div>
          );
        })}
      </div>
      {selectedBooking && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <h2>Booking Details</h2>
            {selectedBookingDetails.map((detail, index) => (
              <React.Fragment key={detail.bookingDetailId}>
                <div className="booking-detail">
                  <p><strong>Booking Detail ID:</strong> {detail.bookingDetailId}</p>
                  <p><strong>Pet:</strong> {detail.pet.petName} - <strong>Pet Type:</strong> {detail.pet.petType}</p>
                  <p><strong>Service:</strong> {detail.services.name} - ${detail.services.price}</p>
                  <p><strong>Description:</strong> {detail.services.description}</p>
                  <p><strong>Need Cage:</strong> {detail.needCage ? 'Yes' : 'No'}</p>
                  <p><strong>Date:</strong> {new Date(detail.date).toLocaleDateString()}</p>
                  <p><strong>Slot:</strong> {detail.slot.slotId} - <strong>Start:</strong> {detail.slot.startTime}</p>
                </div>
                {index < selectedBookingDetails.length - 1 && <hr className="divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStaff;
