  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './BookingStaff.scss';

  const BookingStaff = () => {
    const [bookingDetails, setBookingDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchBookingDetails = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get("http://localhost:8080/bookingDetail/getBookingDetailByPaidBooking");
          console.log('API Response:', response.data);
          setBookingDetails(response.data);
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
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking Detail ID</th>
              <th>Pet Name</th>
              <th>Service Name</th>
              <th>Need Cage</th>
              <th>Date</th>
              <th>Slot Start Time</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookingDetails.length > 0 ? (
              bookingDetails.map((detail) => (
                <tr key={detail.bookingDetailId}>
                  <td>{detail.bookingDetailId}</td>
                  <td>{detail.pet?.petName || 'N/A'}</td>
                  <td>{detail.services?.name || 'N/A'}</td>
                  <td>{detail.needCage ? 'Yes' : 'No'}</td>
                  <td>{formatDate(detail.date)}</td>
                  <td>{detail.slot?.startTime || 'N/A'}</td>
                  
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
                <td colSpan="8">No booking details found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  export default BookingStaff;