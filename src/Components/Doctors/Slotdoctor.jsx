import './SlotDoctor.scss';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../../Context/UserContext'; // Make sure you have a way to get userId from the token
import {jwtDecode} from 'jwt-decode';
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
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.User.map.userID;
      try {
        const response = await axios.post('http://localhost:8080/sev-slot/slot-available', {
          userId: userId,
          date: formattedDate
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
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
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
      toast.success('Cancel success')
      console.log('Cancelled slots:', response.data);
      // Optionally refresh the slots or show a success message
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
    <div className="slotdoctor">
      <h1>Available Slots</h1>
      <div className="date-picker">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
        />
      </div>
      <button onClick={handleCancelSlots} disabled={cancellationLoading}>
        {cancellationLoading ? 'Cancelling...' : 'Cancel Slots'}
      </button>
      {cancellationError && <p>Error cancelling slots: {cancellationError.message}</p>}
      {slots.length > 0 ? (
        <table>
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
        <p>No slots available for the selected date.</p>
      )}
    </div>
  );
};

export default Slotdoctor;
