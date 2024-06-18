import React, { useState } from 'react';
import './Cage.scss'
const Cage = () =>{
    const Seat = ({ seatNumber, isSelected, toggleSelect }) => {
        return (
          <div
            className={`seat ${isSelected ? 'selected' : ''}`}
            onClick={() => toggleSelect(seatNumber)}
          >
            {seatNumber}
          </div>
        );
      };
    
      const rows = 5;
      const seatsPerRow = 10;
      const [selectedSeats, setSelectedSeats] = useState([]);
    
      const toggleSelect = (seatNumber) => {
        setSelectedSeats((prevSelectedSeats) =>
          prevSelectedSeats.includes(seatNumber)
            ? prevSelectedSeats.filter((seat) => seat !== seatNumber)
            : [...prevSelectedSeats, seatNumber]
        );
      };
    
      const renderSeats = () => {
        let seatNumber = 1;
        const seats = [];
        for (let row = 0; row < rows; row++) {
          const rowSeats = [];
          for (let seat = 0; seat < seatsPerRow; seat++) {
            rowSeats.push(
              <Seat
                key={seatNumber}
                seatNumber={seatNumber}
                isSelected={selectedSeats.includes(seatNumber)}
                toggleSelect={toggleSelect}
              />
            );
            seatNumber++;
          }
          seats.push(
            <div key={row} className="row">
              {rowSeats}
            </div>
          );
        }
        return seats;
      };
    
      return <div className="cinema">{renderSeats()}</div>;
}
export default Cage