import React from 'react';
import './CageInfo.scss';

const CageInfo = ({ cageInfo, closeInfo }) => {
  return (
    <div className="cage-info-overlay">
      <div className="cage-info-container">
        <h2>Cage Information</h2>
        <table className="table table-striped">
          <tbody>
           
            
            <tr>
              <th>Pet Name</th>
              <td>{cageInfo.pet.petName}</td>
            </tr>
            <tr>
              <th>Pet Age</th>
              <td>{cageInfo.pet.petAge}</td>
            </tr>
            <tr>
              <th>Pet Gender</th>
              <td>{cageInfo.pet.petGender}</td>
            </tr>
            <tr>
              <th>Pet Type</th>
              <td>{cageInfo.pet.petType}</td>
            </tr>
            <tr>
              <th>Vaccination</th>
              <td>{cageInfo.pet.vaccination}</td>
            </tr>
            
            <tr>
              <th>User Name</th>
              <td>{cageInfo.pet.user.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{cageInfo.pet.user.email}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{cageInfo.pet.user.phone}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{cageInfo.pet.user.address}</td>
            </tr>
            
          </tbody>
        </table>
        <button onClick={closeInfo} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default CageInfo;
