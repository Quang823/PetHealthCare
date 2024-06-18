import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './BookingStaff.scss';
import ReactPaginate from 'react-paginate';
function BookingStaff() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage,setpostPerPage] =useState(5);
  const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);
  useEffect(() => {
    fetch('http://localhost:8080/account/getAll')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  
  const handleBack = () => {
    navigate('/admin')
    
};
const handleAddNew = () => {
  
};

const handleEdit = () => {
 
};

const handleDelete = () => {
  
};

  return (
    <div className="container">
       <div className='hehe'>
              <h2 className="my-4">Booking List</h2>
              <button className="back-button" onClick={handleBack}>Back</button>
        </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Pet</th>
            <th>Service</th>
            <th>Doctor</th>
            <th>Slot</th>
            <th>Cost</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit()}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete()}>Delete</button>
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
    </div>
  );
}

export default BookingStaff;