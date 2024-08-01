import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import './Feedback.scss';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackContent, setFeedbackContent] = useState('');
  const userID = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).User.map.userID;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/bookingDetail/getBookingDetailByCusIdStatus/${userID}`);
        console.log('Fetched bookings:', response.data);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      }finally{
        setIsLoading(false);
      }
    };
  
    fetchBookings();
  }, [userID]);

  const handleFeedback = async () => {
    try {
      const selectedBooking = bookings.find(booking => booking.bookingDetailId === selectedBookingId);
      if (selectedBooking && selectedBooking.status === 'COMPLETED') {
        const response = await axios.post(`http://localhost:8080/feedback/create/${selectedBookingId}`, {
          feedbackContent,
          rating
        });
        toast.success('Feedback submitted successfully');
        setBookings(prevBookings => prevBookings.map(booking => 
          booking.bookingDetailId === selectedBookingId 
            ? { ...booking, feedback: response.data.data } 
            : booking
        ));
        closeModal();
      } else {
        toast.error('Feedback error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback');
    }
  };

  const openModal = (e, bookingDetailId) => {
    e.stopPropagation();
    console.log('Opening modal for booking:', bookingDetailId);
    setSelectedBookingId(bookingDetailId);
    setShowModal(true);
    console.log('showModal set to:', true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRating(0);
    setFeedbackContent('');
  };

  return (
    <>
      <div className='feedback'>
        <h2>Feedback</h2>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Pet Name</th>
              <th>Service</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.date}</td>
                <td>{booking.pet.petName}</td>
                <td>{booking.services.name}</td>
                <td>{booking.booking.totalPrice}</td>
                <td>
                  {booking.feedback ? (
                    <div>
                      <p>Rating: {booking.feedback.rating}</p>
                      <p>Feedback: {booking.feedback.feedbackContent}</p>
                    </div>
                  ) : (
                    <button onClick={(e) => openModal(e, booking.bookingDetailId)}>Submit Feedback</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Submit Feedback</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleFeedback(); }}>
              <div className="form-group">
                <label htmlFor="rating">Rating:</label>
                <Rating
                  count={5}
                  value={rating}
                  onChange={(newRating) => setRating(newRating)}
                  size={24}
                  activeColor="#ffd700"
                />
              </div>
              <div className="form-group">
                <label htmlFor="feedbackContent">Feedback:</label>
                <textarea
                  id="feedbackContent"
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;
