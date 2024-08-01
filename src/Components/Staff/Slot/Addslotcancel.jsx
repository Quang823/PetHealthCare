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
  const [showInputFields, setShowInputFields] = useState(false); // Initialize as false

  useEffect(() => {
    fetchCancelledBookings();
    setShowAvailableVets(false);
    setAvailableVets([]);
    setNoAvailableVets(false);
  }, [selectedDate, selectedSlot]);

  const handlehideInput = () => {
    setShowInputFields(false);
  };

  const cancelBooking = async (bookingDetailId) => {
    const cancelledBookings = JSON.parse(localStorage.getItem('cancelledBookings'));
    const booking = cancelledBookings.find(booking => booking.bookingDetailId === bookingDetailId);
    const userId = booking.pet.user ? booking.pet.user.userId : null;

    try {
      const response = await axios.get(`http://localhost:8080/bookingDetail/staffCancelBookingDetail/`, {
        params: {
          bookingDetailID: bookingDetailId,
          userId: userId,
        }
      });

      if (response.data.status === "ok") {
        toast.success('Booking cancelled successfully');
        setCancelledBookings(prevBookings => prevBookings.filter(booking => booking.bookingDetailId !== bookingDetailId));
      } else {
        toast.error('Failed to cancel booking. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);

      // Check for the specific error message and display a relevant toast notification
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message === 'booking/bookingDetail is already cancelled or completed or pending') {
          toast.error('The booking is already cancelled, completed, or pending.');
        } else {
          toast.error('An error occurred while cancelling the booking.');
        }
      }
    }
  };

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

      // Store the fetched bookings in localStorage
      localStorage.setItem('cancelledBookings', JSON.stringify(filteredBookings));

      setCancelledBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching cancelled bookings:', error);
    }
  };

  const handleAddSlot = async (booking) => {
    setSelectedBooking(booking);
    setSelectedSlot(booking.slot ? booking.slot.slotId.toString() : '');
    setInputDate(booking.date);
    setNoAvailableVets(false);
    setIsLoading(true);
    setShowInputFields(true); // Show input fields when "View" is clicked

    try {
      const response = await axios.post('http://localhost:8080/sev-slot/vet-available', {
        slotId: booking.slot.slotId,
        date: booking.date,
      });

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
    <div className="addslotcancel-container">
      <h2 className="addslotcancel-heading">Cancelled Bookings Slot</h2>
      <div className="addslotcancel-date-picker">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <table className="addslotcancel-styled-table">
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
              <td>{`${booking.slot.startTime} - ${booking.slot.endTime}`}</td>
              <td>{booking.status}</td>
              <td>{booking.booking.totalPrice}</td>
              <td>{booking.pet.petName}</td>
              <td>{booking.pet.user.firstName}</td>
              <td>{booking.pet.user.email}</td>
              <td>{booking.pet.user.phoneNumber}</td>
              <td>{booking.vetCancelled ? 'Cancelled' : booking.vetName}</td>
              <td>
                {booking.vetCancelled ? (
                  <button className="addslotcancel-button" onClick={() => handleAddSlot(booking)}>View</button>
                ) : (
                  <button className="addslotcancel-button" onClick={() => cancelBooking(booking.bookingDetailId)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showInputFields && ( // Render input fields conditionally
        <div className="addslotcancel-input-fields">
          <label>Date:</label>
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          <label>Slot:</label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
          <button
            className="addslotcancel-button"
            onClick={handleCheckAvailability}
            disabled={isLoading}
          >
            Check Availability
          </button>
          <button
            className="addslotcancel-button"
            onClick={handlehideInput}
            disabled={isLoading}
          >
            Hide
          </button>
        </div>
      )}
      {showAvailableVets && availableVets.length > 0 && (
        <div className="addslotcancel-available-vets">
          <h3>Available Vets</h3>
          <ul>
            {availableVets.map((vet, index) => (
              <li key={index}>
                {vet.user.firstName} - {vet.slot.startTime} to {vet.slot.endTime}
                <button
                  className="addslotcancel-button"
                  onClick={() =>
                    updateVetSlot(
                      selectedBooking.bookingDetailId,
                      vet.serviceSlotId,
                      inputDate
                    )
                  }
                >
                  Assign Vet
                </button>
              </li>
            ))}
          </ul>
          <button
            className="addslotcancel-button"
            onClick={handleCloseAvailableVets}
          >
            Close
          </button>
        </div>
      )}
      {noAvailableVets && (
        <div className="addslotcancel-no-vets">
          <p>No available vets for the selected slot and date.</p>
        </div>
      )}
    </div>
  );
};

export default Addslotcancel;
