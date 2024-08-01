import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingStaff.scss';
import { toast } from 'react-toastify';

const BookingStaff = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filteredBookingDetails, setFilteredBookingDetails] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:8080/bookingDetail/getBookingDetailByPaidBooking");
        console.log('API Response:', response.data);
        setBookingDetails(response.data);
        setFilteredBookingDetails(response.data); // Initialize filtered details
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleUpdateStatus = async (bookingDetailId) => {
    try {
      const res = await axios.put(`http://localhost:8080/bookingDetail/update/status/${bookingDetailId}`, {
        status: 'CONFIRMED'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200) {
        toast.success("Confirm successfully");
        setBookingDetails((prevDetails) =>
          prevDetails.map((detail) =>
            detail.bookingDetailId === bookingDetailId ? { ...detail, status: 'CONFIRMED' } : detail
          )

        );
      } else {
        console.error('Failed to update status:', res.statusText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  };

  const handleSearch = () => {
    const results = bookingDetails.filter(detail => {
      const matchesDate = searchDate ? detail.date.includes(searchDate) : true;
      const matchesName = searchName ? detail.pet?.petName.toLowerCase().includes(searchName.toLowerCase()) : true;
      return matchesDate && matchesName;
    });
    setFilteredBookingDetails(results);
  };

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
      <div className="search">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking Detail ID</th>
            <th>Pet Name</th>
            <th>Service Name</th>
            <th>Need Cage</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Status</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookingDetails.length > 0 ? (
            filteredBookingDetails.map((detail) => (
              <tr key={detail.bookingDetailId}>
                <td>{detail.bookingDetailId}</td>
                <td>{detail.pet?.petName || 'N/A'}</td>
                <td>{detail.services?.name || 'N/A'}</td>
                <td>{detail.needCage ? 'Yes' : 'No'}</td>
                <td>{formatDate(detail.date)}</td>
                <td>{detail.slot?.slotId || 'N/A'}</td>
                <td>{detail.status}</td>
                <td>{detail.user.phone}</td>
                <td>
                  {detail.status === 'WAITING' && (
                    <button onClick={() => handleUpdateStatus(detail.bookingDetailId)}>Confirm</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No booking details found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingStaff;
