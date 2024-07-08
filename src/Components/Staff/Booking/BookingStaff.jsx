// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import './BookingStaff.scss';
// import ReactPaginate from 'react-paginate';
// import BookingDetailModal from './BookingDetailModal';

// const BookingStaff = () => {
//   const [bookings, setBookings] = useState([]);
//   const [filteredBookings, setFilteredBookings] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [postPerPage] = useState(5); // Fixed posts per page

//   // Calculate the indices for slicing the bookings array
//   const indexOfLastPost = currentPage * postPerPage;
//   const indexOfFirstPost = indexOfLastPost - postPerPage;
//   const currentPosts = filteredBookings.slice(indexOfFirstPost, indexOfLastPost);

//   // Fetch bookings data from API on component mount
//   useEffect(() => {
//     fetch('http://localhost:8080/booking/getAll')
//       .then(response => response.json())
//       .then(data => {
//         setBookings(data);
//         setFilteredBookings(data);
//       })
//       .catch(error => console.error('Error fetching bookings:', error));
//   }, []);

//   // Handler for navigating back
//   const handleBack = () => {
//     navigate('/staff');
//   };

//   // Placeholder handlers for actions (to be implemented)
//   const handleAddNew = () => {
//     // Add new booking logic
//   };

//   const handleEdit = (bookingId) => {
//     // Edit booking logic
//   };

//   const handleDelete = (bookingId) => {
//     // Delete booking logic
//   };

//   // Filter bookings based on search term
//   useEffect(() => {
//     const lowerCaseSearchTerm = searchTerm.toLowerCase();
//     const filtered = bookings.filter(booking =>
//       `${booking.bookingId}`.toLowerCase().includes(lowerCaseSearchTerm) ||
//       `${booking.userId}`.toLowerCase().includes(lowerCaseSearchTerm) ||
//       formatDateTime(booking.date).date.toLowerCase().includes(lowerCaseSearchTerm)
//     );
//     setFilteredBookings(filtered);
//   }, [searchTerm, bookings]);

//   // Sort bookings based on date
//   const handleSort = () => {
//     const sorted = [...filteredBookings].sort((a, b) => {
//       const dateA = new Date(a.date);
//       const dateB = new Date(b.date);
//       return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
//     });
//     setFilteredBookings(sorted);
//     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//   };

//   return (
//     <div className="container">
//       <h2 className="my-4">Booking List</h2>
//       <div className='header'>
//         <button className="back-button" onClick={handleBack}>Back</button>
//         <input
//           type="text"
//           placeholder="Search by Booking ID, User ID, Date"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <button className="sort-button" onClick={handleSort}>
//           Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
//         </button>
//       </div>
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Booking ID</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Status</th>
//             <th>Total Price</th>
//             <th>User ID</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentPosts.map((booking, index) => {
//             const { date, time } = formatDateTime(booking.date);
//             console.log('bk', booking);
//             return (
//               <tr key={index}>
//                 <td>{booking.bookingId}</td>
//                 <td>{date}</td>
//                 <td>{time}</td>
//                 <td>{booking.status}</td>
//                 <td>{booking.totalPrice}</td>
//                 <td>{booking.userId}</td>
//                 <td>
//                   <button className="edit-button" onClick={() => handleEdit(booking.bookingId)}>Edit</button>
//                   <button className="delete-button" onClick={() => handleDelete(booking.bookingId)}>Delete</button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <ReactPaginate
//         previousLabel={'Previous'}
//         nextLabel={'Next'}
//         pageCount={Math.ceil(filteredBookings.length / postPerPage)}
//         onPageChange={({ selected }) => setCurrentPage(selected + 1)}
//         containerClassName={'pagination'}
//         activeClassName={'active'}
//       />
//     </div>
//   );
// }


// Utility function to format date and time
// export const formatDateTime = (dateTime) => {
//   const dateObj = new Date(dateTime);
//   const date = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
//   const time = dateObj.toLocaleTimeString();
//   return { date, time };
// };

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingStaff.scss';

const BookingStaff = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage.');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.User.map.userID;
        const response = await axios.get(`http://localhost:8080/booking/getAllById/${userID}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBookingHistory(response.data);
        setBookings(response.data);
        setFilteredBookings(response.data);
      } catch (error) {
        console.error('Error fetching booking history:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingHistory();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    const sortedData = [...bookingHistory].sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
    setBookingHistory(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDateFilter = () => {
    const filteredData = bookingHistory.filter((booking) => {
      const bookingDate = new Date(booking.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date();
      return bookingDate >= start && bookingDate <= end;
    });
    setBookingHistory(filteredData);
  };

  const handleBookingClick = async (booking) => {
    try {
      const response = await axios.get(`http://localhost:8080/bookingDetail/getAllByBookingId/${booking.bookingId}`);
      setSelectedBooking(booking);
      setSelectedBookingDetails(response.data);
      console.log('bkdetail', response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:8080/booking/update/status/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Confirmed' }),
      });

      if (response.ok) {
        // Update the status in the state without reloading the page
        setBookingHistory((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, status: 'Confirmed' } : booking
          )
        );
        setFilteredBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, status: 'Confirmed' } : booking
          )
        );
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, status: 'Confirmed' } : booking
          )
        );
      } else {
        console.error('Error updating booking status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setSelectedBookingDetails([]);
  };

  const filteredData = bookingHistory.filter((booking) => {
    const bookingDate = booking.date ?? '';
    const bookingId = booking.bookingId.toString();
    const bookingStatus = booking.status?.toLowerCase() ?? '';

    return bookingDate.includes(searchTerm) ||
      bookingId.includes(searchTerm) ||
      bookingStatus.includes(searchTerm.toLowerCase());
  });

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
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search by booking ID or status..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleSort}>
          Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>
      <div className="filters">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText="Start Date"
          dateFormat="yyyy/MM/dd"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText="End Date"
          dateFormat="yyyy/MM/dd"
        />
        <button onClick={handleDateFilter}>Filter by Date Range</button>
      </div>
      <div className="table">
        <div className="table-header">
          <div className="header-item">Date</div>
          <div className="header-item">Time</div>
          <div className="header-item">Booking ID</div>
          <div className="header-item">Status</div>
          <div className="header-item">Total Price</div>
          <div className="header-item">Actions</div>
        </div>
        {filteredData.map((booking) => {
          const date = new Date(booking.date);
          const formattedDate = date.toLocaleDateString();
          const formattedTime = date.toLocaleTimeString();
          return (
            <div
              key={booking.bookingId}
              className="table-row"
            >
              <div className="table-item">{formattedDate}</div>
              <div className="table-item">{formattedTime}</div>
              <div className="table-item">{booking.bookingId}</div>
              <div className={`table-item status ${booking.status.toLowerCase()}`}>{booking.status}</div>
              <div className="table-item">${booking.totalPrice}</div>
              <div className="table-item">
                <button className='btx' onClick={() => handleBookingClick(booking)}>View</button>
                <button className='btx' onClick={() => handleConfirm(booking.bookingId)}>Confirm</button>
              </div>
            </div>
          );
        })}
      </div>
      {selectedBooking && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <h2>Booking Details</h2>
            {selectedBookingDetails.map((detail, index) => (
              <React.Fragment key={detail.bookingDetailId}>
                <div className="booking-detail">
                  <p><strong>Booking Detail ID:</strong> {detail.bookingDetailId}</p>
                  <p><strong>Pet:</strong> {detail.pet.petName} - <strong>Pet Type:</strong> {detail.pet.petType}</p>
                  <p><strong>Service:</strong> {detail.services.name} - ${detail.services.price}</p>
                  <p><strong>Description:</strong> {detail.services.description}</p>
                  <p><strong>Need Cage:</strong> {detail.needCage ? 'Yes' : 'No'}</p>
                  <p><strong>Date:</strong> {new Date(detail.date).toLocaleDateString()}</p>
                  <p><strong>Slot:</strong> {detail.slot.slotId} - <strong>Start:</strong> {detail.slot.startTime}</p>
                </div>
                {index < selectedBookingDetails.length - 1 && <hr className="divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStaff;
