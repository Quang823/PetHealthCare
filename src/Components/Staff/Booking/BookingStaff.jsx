import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingStaff.scss';

const BookingStaff = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filteredBookingDetails, setFilteredBookingDetails] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const currentDate = getCurrentDate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:8080/bookingDetail/getBookingDetailByPaidBooking");
        console.log('API Response:', response.data);
        const todayBookings = response.data.filter(detail => detail.date === currentDate);
        setBookingDetails(todayBookings);
        setFilteredBookingDetails(todayBookings); // Initialize filtered details
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [currentDate,updateTrigger]);

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
        setBookingDetails((prevDetails) =>
          prevDetails.map((detail) =>
            detail.bookingDetailId === bookingDetailId ? { ...detail, status: 'CONFIRMED' } : detail
          )
        );
        setFilteredBookingDetails((prevDetails) =>
          prevDetails.map((detail) =>
            detail.bookingDetailId === bookingDetailId ? { ...detail, status: 'CONFIRMED' } : detail
          )
        );
        setUpdateTrigger(prev => prev + 1);
      } else {
        console.error('Failed to update status:', res.statusText);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSearch = () => {
    const results = bookingDetails.filter(detail => {
      const matchesName = searchName ? detail.pet?.petName.toLowerCase().includes(searchName.toLowerCase()) : true;
      const matchesPhone = searchPhone ? detail.user.phone.includes(searchPhone) : true;
      return matchesName && matchesPhone;
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
          type="text"
          placeholder="Search by Phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
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
                <td>{detail.date}</td>
                <td>{detail.slot?.slotId || 'N/A'}</td>
                <td>{detail.status}</td>
                <td>{detail.user.phone}</td>
                <td>
                  {detail.status === 'WAITING' && detail.date === currentDate && (
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