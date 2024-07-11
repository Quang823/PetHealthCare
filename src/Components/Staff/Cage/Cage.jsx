import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cage.scss';
import img from '../../../Assets/zg6gynwuhdo3b44dou8fqz12l8ss_chuong-cho-hinh-ngoi-nha-4.webp';
import { useLocation, useNavigate } from 'react-router-dom';
import CageInfo from './CageInfo';

const Cage = ({ Toggle }) => {
  const location = useLocation();
  const { petType } = location.state || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [availableCages, setAvailableCages] = useState([]);
  const [bookedCages, setBookedCages] = useState([]);
  const [selectedCageInfo, setSelectedCageInfo] = useState(null);

  useEffect(() => {
    const fetchCages = async () => {
      try {
        if (petType) {
          const resAvailable = await axios.get(`http://localhost:8080/cage/getAvailableByType?type=${petType}`);
          setAvailableCages(resAvailable.data.data);
          const resBooked = await axios.get(`http://localhost:8080/cage/getHasPetByType?type=${petType}`);
          setBookedCages(resBooked.data.data);
        } else {
          const resAll = await axios.get('http://localhost:8080/cage/getall');
          const allCages = resAll.data.data;
          setAvailableCages(allCages.filter(cage => cage.status));
          setBookedCages(allCages.filter(cage => !cage.status));
        }
      } catch (error) {
        console.error('Error fetching cages:', error);
      }
    };

    fetchCages();
  }, [petType]);

  const handleBookCage = async (cageId, bookingDetailId) => {
    try {
      const res = await axios.post('http://localhost:8080/cage/checkin', {
        cageId,
        bookingDetailId,
      });
      setAvailableCages(availableCages.filter((cage) => cage.cageId !== cageId));
      setBookedCages([...bookedCages, res.data.data]);
    } catch (error) {
      console.error('Error booking cage:', error);
    }
  };

  const handleCheckoutCage = async (cageId) => {
    try {
      await axios.post('http://localhost:8080/cage/checkout', { cageId });
      setBookedCages(bookedCages.filter((cage) => cage.cageId !== cageId));
      setAvailableCages([...availableCages, { cageId, cageType: petType, status: true }]);
      localStorage.removeItem('bookingDetailId');
    } catch (error) {
      console.error('Error checking out cage:', error);
    }
  };

  const handleShowInfo = (cageInfo) => {
    setSelectedCageInfo(cageInfo);
  };

  const closeInfo = () => {
    setSelectedCageInfo(null);
  };

  const filteredItems = availableCages.filter((item) => {
    return (
      (filterStatus === 'all' || item.status === filterStatus) &&
      item.cageType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/staff/bkneedCage");
}

  return (
    <div className="cage-layout">
      <div className="content">
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <button className="back-button" onClick={handleBack}>Back</button>
          </div>
        </div>

        <div className="cage-container">
          {filteredItems.map((item) => (
            <div key={item.cageId} className="card">
              <img src={img} alt={`Cage ${item.cageId}`} />
              <div className="card-content">
                <h3>{`Cage ${item.cageId}`}</h3>
                <p>{`Type: ${item.cageType}`}</p>
                <div className="info">{item.status ? 'Available' : 'Booked'}</div>
                <button
                  className="card-button"
                  onClick={() => handleBookCage(item.cageId, localStorage.getItem('bookingDetailId'))}
                >
                  Add cage
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2>Booked Cages</h2>
        <div className="cage-container">
          {bookedCages.map((item) => (
            <div key={item.cageId} className="card">
              <img src={img} alt={`Cage ${item.cageId}`} />
              <div className="card-content">
                <h3>{`Cage ${item.cageId}`}</h3>
                <p>{`Type: ${item.cageType}`}</p>
                <div className="info">Booked</div>
                <button className="info-button" onClick={() => handleShowInfo(item)}>
                  Show Information
                </button>
                <button className="checkout-button" onClick={() => handleCheckoutCage(item.cageId)}>
                  Checkout
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedCageInfo && <CageInfo cageInfo={selectedCageInfo} closeInfo={closeInfo} />}
    </div>
  );
};

export default Cage;
