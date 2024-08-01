import './SlotDoctor.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../Context/UserContext'; // Make sure you have a way to get userId from the token
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const Slotdoctor = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Assuming useAuth provides user object
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationError, setCancellationError] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError(null);

      // Lấy ngày theo múi giờ local mà không dùng toISOString()
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.User.map.userID;

      try {
        // Changed to GET request with params
        const response = await axios.get('http://localhost:8080/sev-slot/getByVet', {
          params: {
            vetId: userId,
            date: formattedDate
          }
        });
        setSlots(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, user]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCancelSlots = async () => {
    setCancellationLoading(true);
    setCancellationError(null);

    // Lấy ngày theo múi giờ local mà không dùng toISOString()
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.User.map.userID;

    const cancellationData = slots.map(slot => ({
      ...slot,
      status: 'CANCELLED'
    }));

    try {
      console.log('Sending cancellation request with date:', formattedDate, 'and vetId:', userId);
      const response = await axios.put(`http://localhost:8080/sev-slot/vetCancelDate`, cancellationData, {
        params: {
          date: formattedDate,
          vetId: userId
        }
      });
      toast.success('Cancel success');
      console.log('Cancelled slots:', response.data);
      // Optionally refresh the slots or show a success message
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling slots:', error.response ? error.response.data : error.message);
      setCancellationError(error);
    } finally {
      setCancellationLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="slotdoctor-container">
      <h1 className="slotdoctor-title">Available Slots</h1>
      <div className="slotdoctor-date-picker">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="form-control"
          minDate={new Date()} // Chỉ cho phép chọn từ hôm nay trở đi
        />
      </div>
      <button
        className="slotdoctor-button"
        onClick={handleCancelSlots}
        disabled={cancellationLoading}
      >
        {cancellationLoading ? 'Cancelling...' : 'Cancel Slots'}
      </button>
      {cancellationError && <p>Error cancelling slots: {cancellationError.message}</p>}
      {slots.length > 0 ? (
        <table className="slotdoctor-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Doctor</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.serviceSlotId}>
                <td>{slot.date}</td>
                <td>{slot.slot.startTime}</td>
                <td>{slot.slot.endTime}</td>
                <td>{slot.status}</td>
                <td>{slot.user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="slotdoctor-no-slots">No slots available for the selected date.</p>
      )}
    </div>
  );
};

export default Slotdoctor;
