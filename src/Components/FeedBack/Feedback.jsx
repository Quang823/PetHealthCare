import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import './Feedback.scss';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [bookings, setBookings] = useState([]);
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
        const bookingsData = response.data;

        // Fetch feedback details for each booking
        const updatedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const feedbackResponse = await axios.get(`http://localhost:8080/feedback/get/${booking.bookingDetailId}`);
              return {
                ...booking,
                feedback: feedbackResponse.data.data
              };
            } catch (error) {
              return booking;
            }
          })
        );

        setBookings(updatedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [userID]);

  const handleFeedback = async (e, bookingDetailId) => {
    e.preventDefault();
    try {
      const selectedBooking = bookings.find(booking => booking.bookingDetailId === bookingDetailId);
      if (selectedBooking && selectedBooking.status === 'COMPLETED') {
        const response = await axios.post(`http://localhost:8080/feedback/create/${bookingDetailId}`, {
          feedbackContent,
          rating
        });
        toast.success('Feedback submitted successfully');
        
        setBookings(prevBookings => prevBookings.map(booking => 
          booking.bookingDetailId === bookingDetailId 
            ? { ...booking, feedback: response.data.data } 
            : booking
        ));
        setSelectedBookingId(null);
        setRating(0);
        setFeedbackContent('');
      } else {
        toast.error('Feedback error');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Error submitting feedback');
    }
  };

  const toggleFeedbackForm = (bookingDetailId) => {
    setSelectedBookingId(selectedBookingId === bookingDetailId ? null : bookingDetailId);
    setRating(0);
    setFeedbackContent('');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <React.Fragment key={index}>
              <tr>
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
                    <button onClick={() => toggleFeedbackForm(booking.bookingDetailId)}>
                      {selectedBookingId === booking.bookingDetailId ? 'Cancel' : 'Submit Feedback'}
                    </button>
                  )}
                </td>
              </tr>
              {selectedBookingId === booking.bookingDetailId && (
                <tr>
                  <td colSpan="5">
                    <form onSubmit={(e) => handleFeedback(e, booking.bookingDetailId)}>
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
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Feedback;