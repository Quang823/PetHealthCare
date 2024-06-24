import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './UserList.scss';
import ReactPaginate from 'react-paginate';
import axios from 'axios';

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postPerPage;
  const indexOfFirstPost = indexOfLastPost - postPerPage;

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPosts = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    fetch('http://localhost:8080/account/getAll')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleBack = () => {
    navigate('/admin');
  };

  const handleEdit = (user) => {
    console.log('Editing user:', user);
    setEditUser({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || ''
    });
    setCurrentUserId(user.userId);
    setShowEditForm(true);
  };

  const handleDelete = (userId) => {
    console.log('Deleting user with ID:', userId);
    axios.delete(`http://localhost:8080/account/delete/${userId}`)
      .then(() => {
        setUsers(users.filter(user => user.userId !== userId));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();  // Prevent the default form submission
    console.log('Submitting edit for user ID:', currentUserId);
    console.log('Edit user data:', editUser);

    // Prepare the payload according to the API's requirements
    const payload = {
      newrole: editUser.role
    };

    axios.put(`http://localhost:8080/account/manageRole/${currentUserId}`, payload)
      .then(response => {
        console.log('Edit response:', response.data);
        setUsers(users.map(user => (user.userId === currentUserId ? { ...user, role: editUser.role } : user)));
        setShowEditForm(false);
        setEditUser({
          name: '',
          email: '',
          phone: '',
          address: '',
          role: ''
        });
      })
      .catch(error => console.error('Error updating user:', error));
  };

  return (
    <div className="container">
      <div className='header'>
        <h2 className="my-4">Customer List</h2>
        <button className="back-button" onClick={handleBack}>Back</button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((user, index) => (
            <tr key={index}>
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(user.userId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        pageCount={Math.ceil(filteredUsers.length / postPerPage)}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />

      {showEditForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  readOnly
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  readOnly
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={editUser.phone}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                  readOnly
                />
              </div>
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={editUser.address}
                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                  readOnly
                />
              </div>
              <div>
                <label>Role</label>
                <input
                  type="text"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                />
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
