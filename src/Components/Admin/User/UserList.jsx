import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './UserList.scss';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
function CustomerList() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage,setpostPerPage] =useState(5);
  const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);
    const [newUser, setNewUser] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: ''
  });
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

const handleEdit = () => {
  const { userID, ...serviceData } = setNewUser;
 axios.put(`http://localhost:8080/Service/update/${userID}`, serviceData)
 .then( res => {
  setNewUser(users.map(s => (s.serviceID === userID ? res.data : s)));
  setShowEditForm(false);
  setNewUser({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: ''
  });
 })
};


  };

  return (
    <div className="container">
      <div className='hehe'>
        <h2 className="my-4">Customer List</h2>
        <button className="back-button" onClick={handleBack}>Back</button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((user, index) => (
            <tr key={index}>
              <td>{user.Name}</td>
              <td>{user.Email}</td>
              <td>{user.Phone}</td>
              <td>{user.Address}</td>
              <td>{user.Role}</td>
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

export default CustomerList;