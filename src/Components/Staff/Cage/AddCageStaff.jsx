import './AddCage.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCageStaff = () => {
  const [cageType, setCageType] = useState('');

  const handleSelectChange = (event) => {
    setCageType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8080/cage/create", { type: cageType });
      toast.success("Cage added successfully");
    } catch (err) {
      toast.error("Failed to add cage");
    }
  };

  return (
    <div className="add-cage-container">
      <h1 className="add-cage-title">Add Cage</h1>
      <form onSubmit={handleSubmit} className="add-cage-form">
        <label className="add-cage-label">
          Cage Type:
          <select
            value={cageType}
            onChange={handleSelectChange}
            className="add-cage-select"
          >
            <option value="">Select Type</option>
            <option value="DOG">DOG</option>
            <option value="CAT">CAT</option>
            <option value="BIRD">BIRD</option>
            <option value="HAMSTER">HAMSTER</option>
            <option value="CHICKEN">CHICKEN</option>
          </select>
        </label>
        <button type="submit" className="add-cage-button">Add Cage</button>
      </form>
    </div>
  );
};

export default AddCageStaff;