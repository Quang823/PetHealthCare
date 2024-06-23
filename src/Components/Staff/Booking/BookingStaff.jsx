import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './BookingStaff.scss';
import ReactPaginate from 'react-paginate';
import BookingDetailModal from './BookingDetailModel';

function BookingStaff() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState(null);

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    fetch('http://localhost:8080/bookingDetail/getAllBookingDetail')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleBack = () => {
    navigate('/admin');
  };

  const handleShowDetails = (bookingDetail) => {
    setSelectedBookingDetail(bookingDetail);
    setShowModal(true);
  };

  const handleSaveCage = () => {
    console.log(`Save cage for booking detail ID: ${selectedBookingDetail.bookingDetailId}`);
    // Add your save cage logic here
  };

  return (
    <div className="container">
      <div className='header'>
        <h2 className="my-4">Booking List</h2>
        <button className="back-button" onClick={handleBack}>Back</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Pet</th>
            <th>Type</th>
            <th>user name</th>
            <th>Need Cage</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((user, index) => (
            <tr key={index}>
              <td>{user.bookingDetailId}</td>
              <td>{user.pet.petName}</td>
              <td>{user.needCage ? 'Yes' : 'No'}</td>
              <td>{new Date(user.date).toLocaleString()}</td>
              <td>
                <button className="toggle-button" onClick={() => handleShowDetails(user)}>
                  Show Booking Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={Math.ceil(users.length / postPerPage)}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
      {showModal && (
        <BookingDetailModal
          bookingDetail={selectedBookingDetail}
          onClose={() => setShowModal(false)}
          onSaveCage={handleSaveCage}
        />
      )}
    </div>
  );
}

export default BookingStaff;
