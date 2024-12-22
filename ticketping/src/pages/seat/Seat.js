import React, { useState } from 'react';
import SeatLayout from './SeatLayout';
import '../../style/Seat.css';

function Seat() {
  const rows = 5;
  const columns = 10;
  const performanceName = "햄릿";

  const grades = ['S', 'A', 'B', 'B', 'B'];
  
  const seats = Array.from({ length: rows * columns }, (_, index) => ({
    grade: grades[Math.floor(index / columns)],
    price: 10000,
    reserved: index % 7 === 0,
  }));

  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleSeatSelect = (seatId) => {
    if (selectedSeat === seatId) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seatId);
    }
  };

  return (
    <div className="seat-page">
      <div className="seat-layout-container">
        <SeatLayout
          rows={rows}
          columns={columns}
          grades={grades}
          seats={seats}
          selectedSeat={selectedSeat}
          onSeatSelect={handleSeatSelect}
        />
      </div>
      <div className="page-detail">
        <div className="order-detail">
          <h2>{performanceName}</h2>
          {selectedSeat !== null ? (
            <div className="seat-info">
              <p>좌석: {Math.floor(selectedSeat / columns) + 1}행 {selectedSeat % columns + 1}열</p>
              <p>등급: {seats[selectedSeat].grade}</p>
              <p>가격: {seats[selectedSeat].price}원</p>
            </div>
          ) : (
            <p>선택된 좌석이 없습니다.</p>
          )}
        </div>
        <button
          className="booking-button"
          disabled={selectedSeat === null}
        >
          예매하기
        </button>
      </div>
    </div>
  );
}

export default Seat;
