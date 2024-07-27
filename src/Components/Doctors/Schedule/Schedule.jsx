import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Sidebar from '../SideBar';
const Schedule = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const handleBack = () => {
    

  };
  return (
    <>
      <div className="container">
        <div className='hehe'>
          <h2 className="my-4">Schedule</h2>
          <button className="back-button" onClick={handleBack}>Back</button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Pet nam</th>
              <th>Gender</th>
              <th>Note</th>
              <th>HEHE</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default Schedule