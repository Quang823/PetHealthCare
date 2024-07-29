import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Addslotcancel.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const Addslotcancel = () => {
  const slots = [
    { id: 1, startTime: '07:00:00', endTime: '08:00:00' },
    { id: 2, startTime: '08:00:00', endTime: '09:00:00' },
    { id: 3, startTime: '09:00:00', endTime: '10:00:00' },
    { id: 4, startTime: '10:00:00', endTime: '11:00:00' },
    { id: 5, startTime: '11:00:00', endTime: '12:00:00' },
    { id: 6, startTime: '12:00:00', endTime: '13:00:00' },
    { id: 7, startTime: '13:00:00', endTime: '14:00:00' },
    { id: 8, startTime: '14:00:00', endTime: '15:00:00' },
    { id: 9, startTime: '15:00:00', endTime: '16:00:00' },
    { id: 10, startTime: '16:00:00', endTime: '17:00:00' },
  ];

  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [availableVets, setAvailableVets] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noAvailableVets, setNoAvailableVets] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAvailableVets, setShowAvailableVets] = useState(false);
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    fetchCancelledBookings();
    setShowAvailableVets(false);
    setAvailableVets([]);
    setNoAvailableVets(false);
  }, [selectedDate, selectedSlot]);

  const updateVetSlot = async (bookingDetailId, serviceSlotId, date) => {
    try {
      setIsLoading(true);
      const availableVetsData = JSON.parse(localStorage.getItem('availableVets'));
      const selectedVet = availableVetsData.find(vet => vet.serviceSlotId === serviceSlotId);
      const slotId = selectedVet.slot.slotId;
      const userId = selectedVet.user.userId;

      const response = await axios.put('http://localhost:8080/bookingDetail/update/bookingDetail', {
        bookingDetailId: bookingDetailId,
        userId: userId,
        slotId: slotId,
        date: date,
      });

      if (response.status === 200) {
        const updatedBooking = response.data.data;
        toast.success('Booking detail updated successfully');
        console.log("Updated Booking", updatedBooking);

        setCancelledBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.bookingDetailId === bookingDetailId
              ? {
                  ...booking,
                  ...updatedBooking,
                  vetCancelled: false
                }
              : booking
          )
        );
        handleCloseAvailableVets();
        localStorage.removeItem('availableVets');
      } else {
        toast.error('Failed to update booking detail. Please try again.');
      }
    } catch (error) {
      console.error('Error updating booking detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCancelledBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bookingDetail/getBookingDetailByVetCancel');
      const filteredBookings = response.data.filter(
        (booking) => new Date(booking.date).toDateString() === selectedDate.toDateString()
      );
      setCancelledBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching cancelled bookings:', error);
    }
  };

  const handleAddSlot = async (booking) => {
    console.log('handleAddSlot called with booking:', booking);
    setSelectedBooking(booking);
    setSelectedSlot(booking.slot ? booking.slot.slotId.toString() : '');
    setInputDate(booking.date);
    setNoAvailableVets(false);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/sev-slot/vet-available', {
        slotId: booking.slot.slotId,
        date: booking.date,
      });

      console.log('API response:', response.data);

      if (response.data.length === 0) {
        setNoAvailableVets(true);
        setShowAvailableVets(false);
      } else {
        const availableVetsData = response.data.map(vet => ({
          ...vet,
          user: vet.user || booking.user
        }));
        setAvailableVets(availableVetsData);
        localStorage.setItem('availableVets', JSON.stringify(availableVetsData));
        setNoAvailableVets(false);
        setShowAvailableVets(true);
      }
    } catch (error) {
      console.error('Error fetching available vets:', error);
      setNoAvailableVets(true);
      setShowAvailableVets(false);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    setIsLoading(true);
    setShowAvailableVets(false);
    setAvailableVets([]);
    try {
      const response = await axios.post('http://localhost:8080/sev-slot/vet-available', {
        slotId: selectedSlot,
        date: inputDate,
      });

      console.log('API response:', response.data);

      if (response.data.length === 0) {
        setNoAvailableVets(true);
        setShowAvailableVets(false);
      } else {
        setAvailableVets(response.data);
        localStorage.setItem('availableVets', JSON.stringify(response.data));
        setNoAvailableVets(false);
        setShowAvailableVets(true);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setNoAvailableVets(true);
      setShowAvailableVets(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAvailableVets = () => {
    setShowAvailableVets(false);
    setAvailableVets([]);
    setNoAvailableVets(false);
  };

  return (
    <div className="container">
      <h2 className="heading">Cancelled Bookings Slot</h2>
      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Slot</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Pet Name</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Doctor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cancelledBookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.date}</td>
              <td>{booking.slot ? booking.slot.slotId : 'N/A'}</td>
              <td>{booking.status}</td>
              <td>{booking.booking.totalPrice}</td>
              <td>{booking.pet.petName}</td>
              <td>{booking.pet.user.name}</td>
              <td>{booking.pet.user.email}</td>
              <td>{booking.pet.user.phone}</td>
              <td>{booking.user.name}</td>
              <td>
                <button onClick={() => handleAddSlot(booking)}>View doctor</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isLoading && <p>Loading...</p>}

      {showAvailableVets && availableVets.length > 0 && (
        <div className="available-vets">
          <div className="available-vets-header">
            <h3>Available Veterinarians</h3>
            <button onClick={handleCloseAvailableVets} className="close-button">Close</button>
          </div>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Slot</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableVets.map((vet, index) => (
                <tr key={index}>
                  <td>{vet.user.name}</td>
                  <td>{vet.user.email}</td>
                  <td>{vet.slot ? vet.slot.slotId : 'N/A'}</td>
                  <td>
                    <button onClick={() => updateVetSlot(
                      selectedBooking.bookingDetailId,
                      vet.serviceSlotId,
                      inputDate || selectedBooking.date
                    )}>
                      Add Slot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noAvailableVets && (
        <div className="no-vets-message">
          <p>No veterinarians are available for the selected slot and date.</p>
          <div className="input-container">
            <h3>Enter Date and Select Slot to Display Available Veterinarians</h3>
            <label>
              Date:
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </label>
            <label>
              Slot:
              <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                <option value="">Select a slot</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.startTime} - {slot.endTime}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button onClick={handleCheckAvailability}>Check Availability</button>
        </div>
      )}
    </div>
  );
};

export default Addslotcancel;