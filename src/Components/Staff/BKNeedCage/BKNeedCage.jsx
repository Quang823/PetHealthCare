import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useNavigate } from "react-router-dom";

const BKNeedCage = () => {
  const [booking, setBooking] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get('http://localhost:8080/bookingDetail/getAllBookingDetailNeedCage');
        setBooking(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooking();
  }, []);

  const handleAddCage = (bookingDetailId, petType) => {
    localStorage.setItem('bookingDetailId', bookingDetailId);
    navigate(`/staff/cagestaff`, { state: { petType } });
  };

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;
  const currentPosts = booking.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="container">
      <h2 className="my-4">List Booking Need Cage</h2>
     
      <table className="table table-striped">
        <thead>
          <tr>
            <th>BookingDetailId</th>
            <th>Need Cage</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((bookingDetail, index) => (
            <tr key={index}>
              <td>{bookingDetail.bookingDetailId}</td>
              <td>{bookingDetail.needCage ? "Yes" : "No"}</td>
              <td>{new Date(bookingDetail.date).toLocaleDateString()}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleAddCage(bookingDetail.bookingDetailId, bookingDetail.pet.petType)}
                >
                  Add Cage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={Math.ceil(booking.length / postPerPage)}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default BKNeedCage;
