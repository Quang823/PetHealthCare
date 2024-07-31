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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bookingDetail/getBookingDetailByCusIdStatus/${userID}`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [userID]);

  const handleFeedback = async () => {
    const feedback = {
      rating: rating.toString(),
      feedbackContent,
    };

    try {
      const response = await axios.post(`http://localhost:8080/feedback/create/${selectedBookingId}`, feedback);
      console.log(`Feedback submitted for booking detail ID: ${selectedBookingId}`, response.data);
      setShowModal(false);
      setRating(0);
      setFeedbackContent('');

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingDetailId === selectedBookingId
            ? { ...booking, feedback: { rating: feedback.rating, feedbackContent: feedback.feedbackContent } }
            : booking,
          toast.success("Feedback success")
        )

      );
    } catch (error) {
      toast.error("Cannot feedback")
      console.error('Error submitting feedback:', error);

    }
  };

  const openModal = (bookingDetailId) => {
    setSelectedBookingId(bookingDetailId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRating(0);
    setFeedbackContent('');
  };

  return (
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
                  <button onClick={() => openModal(booking.bookingDetailId)}>Submit Feedback</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default Feedback;