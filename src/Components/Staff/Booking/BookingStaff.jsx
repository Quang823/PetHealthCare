import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingStaff.scss';
import ReactPaginate from 'react-paginate';
import BookingDetailModal from './BookingDetailModal';
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
            console.log('bk', booking);
            return (
              <tr key={index}>
                <td>{booking.bookingId}</td>
                <td>{date}</td>
                <td>{time}</td>
                <td>{booking.status}</td>
                <td>{booking.totalPrice}</td>
                <td>{booking.userId}</td>
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
// function BookingStaff() {
//   const [users, setUsers] = useState([]);
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [postPerPage, setPostPerPage] = useState(5);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);

//   const indexOfLastPost = currentPage * postPerPage;
//   const indexOfFirstPost = indexOfLastPost - postPerPage;
//   const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

//   useEffect(() => {
//     fetch('http://localhost:8080/bookingDetail/getAllBookingDetail')
//       .then(response => response.json())
//       .then(data => setUsers(data))
//       .catch(error => console.error('Error fetching users:', error));
//   }, []);

//   const handleBack = () => {
//     navigate('/admin');
//   };

//   const handleShowDetails = (bookingDetail) => {
//     setSelectedBookingDetail(bookingDetail);
//     setShowModal(true);
//   };

//   const handleSaveCage = () => {
//     console.log(`Save cage for booking detail ID: ${selectedBookingDetail.bookingDetailId}`);
//     // Add your save cage logic here
//   };

//   return (
//     <div className="container">
//       <div className='header'>
//         <h2 className="my-4">Booking List</h2>
//         <button className="back-button" onClick={handleBack}>Back</button>
//       </div>
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Pet</th>
//             <th>Type</th>
//             <th>user name</th>
//             <th>Need Cage</th>
//             <th>Date</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentPosts.map((user, index) => (
//             <tr key={index}>
//               <td>{user.bookingDetailId}</td>
//               <td>{user.pet.petName}</td>
//               <td>{user.needCage ? 'Yes' : 'No'}</td>
//               <td>{new Date(user.date).toLocaleString()}</td>
//               <td>
//                 <button className="toggle-button" onClick={() => handleShowDetails(user)}>
//                   Show Booking Detail
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <ReactPaginate
//         previousLabel={'Previous'}
//         nextLabel={'Next'}
//         pageCount={Math.ceil(users.length / postPerPage)}
//         onPageChange={({ selected }) => setCurrentPage(selected + 1)}
//         containerClassName={'pagination'}
//         activeClassName={'active'}
//       />
//       {showModal && (
//         <BookingDetailModal
//           bookingDetail={selectedBookingDetail}
//           onClose={() => setShowModal(false)}
//           onSaveCage={handleSaveCage}
//         />
//       )}
//     </div>
//   );
// }
export default BookingStaff;
