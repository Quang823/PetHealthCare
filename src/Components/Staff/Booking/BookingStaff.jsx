import React, { useState } from 'react';
import axios from 'axios';
import './BookingStaff.scss';

const BookingStaff = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [phone, setPhoneNumber] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    
  };

  const handlePhoneChange = (event) => {
    setPhoneNumber(event.target.value);
    
  };

  const handleFetchBookingDetails = async () => {
    if (!selectedDate || !phone) {
      
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert the date from MM-DD-YYYY to YYYY-MM-DD
      const [month, day, year] = selectedDate.split('-');
      const formattedDate = `${year}-${month}-${day}`;
     

      const response = await axios.get(`http://localhost:8080/bookingDetail/getAllBookingDetail_ByPhoneNumberAndDate`, {
        params: {
          phone,
          date: formattedDate
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('API Response:', response.data);
      setBookingDetails(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleupdateStatus = async (bookingDetailId) =>{
        try{
          const res = await axios.put(`http://localhost:8080/bookingDetail/update/status/${bookingDetailId}`,{
            status:'CONFIRMED'
          },{
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
        }catch (error) {
          console.error('Error updating status:', error);
        }
  }

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
  };

  console.log('Current bookingDetails state:', bookingDetails);

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
      <div className="filters">
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={handlePhoneChange}
        />
        <input
          type="text"
          placeholder="MM-DD-YYYY"
          value={selectedDate}
          onChange={handleDateChange}
        />
        <button onClick={handleFetchBookingDetails}>Fetch Booking Details</button>
      </div>
      <div className="table">
        <div className="table-header">
          <div className="header-item">Booking Detail ID</div>
          <div className="header-item">Pet Name</div>
          <div className="header-item">Service Name</div>
          <div className="header-item">Need Cage</div>
          <div className="header-item">Date</div>
          <div className="header-item">Slot Start Time</div>
          <div className="header-item">Status</div>
          <div className="header-item">Action</div>
        </div>
        {bookingDetails.length > 0 ? (
          bookingDetails.map((detail) => (
            <div key={detail.bookingDetailId} className="table-row">
              <div className="table-item">{detail.bookingDetailId}</div>
              <div className="table-item">{detail.pet?.petName || 'N/A'}</div>
              <div className="table-item">{detail.services?.name || 'N/A'}</div>
              <div className="table-item">{detail.needCage ? 'Yes' : 'No'}</div>
              <div className="table-item">{formatDate(detail.date)}</div>
              <div className="table-item">{detail.slot?.startTime || 'N/A'}</div>
              <div className="table-item">{detail.status}</div>
              <div className="table-item">
                {detail.status === 'WAITING' && (
                  <button className='table-row' onClick={() => handleupdateStatus(detail.bookingDetailId)}>Confirm</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">No booking details found</div>
        )}
      </div>
    </div>
  );
};

export default BookingStaff;
