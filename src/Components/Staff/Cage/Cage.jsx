import React, { useState } from 'react';
import './Cage.scss';
import img from '../../../Assets/dat09.jpg';
import Sidebar from '../Sidebar';
import { info } from 'sass';
import Nav from '../Nav';
const Cage = ({ Toggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const items = Array.from({ length: 50 }, (_, index) => ({
    id: index,
    image: img,
    info: `Cage empty`,
    title: `Cage ${index + 1}`,
    description: ``,
    status: info % 2 === 0 ? 'available' : 'booked' // Alternating status for demonstration
  }));

  const filteredItems = items.filter(item => {
    return (
      (filterStatus === 'all' || item.status === filterStatus) &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="cage-layout">
      <Sidebar />
      <div className="content">
      <Nav Toggle={Toggle} />
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            <button onClick={() => setFilterStatus('all')} className="filter-button">
              All
            </button>
            <button onClick={() => setFilterStatus('available')} className="filter-button">
              Available
            </button>
            <button onClick={() => setFilterStatus('booked')} className="filter-button">
              Booked
            </button>
          </div>
        </div>
        <div className="cage-container">
          {filteredItems.map(item => (
            <div key={item.id} className="card">
              <img src={item.image} alt={`Item ${item.id}`} />
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="info">{item.info}</div>
                <button className="card-button">Add cage</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cage;
