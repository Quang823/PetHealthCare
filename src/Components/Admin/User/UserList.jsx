import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './UserList.scss'
function CustomerList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
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
          {users.map((user, index) => (
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
    </div>
  );
}

export default CustomerList;