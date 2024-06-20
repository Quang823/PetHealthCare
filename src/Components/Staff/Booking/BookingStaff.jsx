import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingStaff.scss';
import ReactPaginate from 'react-paginate';

// Utility function to format date and time
const formatDateTime = (dateTime) => {
  const dateObj = new Date(dateTime);
  const date = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
  const time = dateObj.toLocaleTimeString();
  return { date, time };
};

const BookingStaff = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(5); // Fixed posts per page

  // Calculate the indices for slicing the bookings array
  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = filteredBookings.slice(indexOfFirstPost, indexOfLastPost);

  // Fetch bookings data from API on component mount
  useEffect(() => {
    fetch('http://localhost:8080/booking/getAll')
      .then(response => response.json())
      .then(data => {
        setBookings(data);
        setFilteredBookings(data);
      })
      .catch(error => console.error('Error fetching bookings:', error));
  }, []);

  // Handler for navigating back
  const handleBack = () => {
    navigate('/staff');
  };

  // Placeholder handlers for actions (to be implemented)
  const handleAddNew = () => {
    // Add new booking logic
  };

  const handleEdit = (bookingId) => {
    // Edit booking logic
  };

  const handleDelete = (bookingId) => {
    // Delete booking logic
  };

  // Filter bookings based on search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = bookings.filter(booking =>
      `${booking.bookingId}`.toLowerCase().includes(lowerCaseSearchTerm) ||
      `${booking.userId}`.toLowerCase().includes(lowerCaseSearchTerm) ||
      formatDateTime(booking.date).date.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  // Sort bookings based on date
  const handleSort = () => {
    const sorted = [...filteredBookings].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredBookings(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container">
      <h2 className="my-4">Booking List</h2>
      <div className='header'>
        <button className="back-button" onClick={handleBack}>Back</button>
        <input
          type="text"
          placeholder="Search by Booking ID, User ID, Date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="sort-button" onClick={handleSort}>
          Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>User ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((booking, index) => {
            const { date, time } = formatDateTime(booking.date);
            return (
              <tr key={index}>
                <td>{booking.bookingId}</td>
                <td>{date}</td>
                <td>{time}</td>
                <td>{booking.status}</td>
                <td>{booking.totalPrice}</td>
                <td>{booking.customerId}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(booking.bookingId)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(booking.bookingId)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={Math.ceil(filteredBookings.length / postPerPage)}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
}

export default BookingStaff;
