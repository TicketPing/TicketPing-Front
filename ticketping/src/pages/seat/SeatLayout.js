import React from 'react';
import '../../style/SeatLayout.css';

function SeatLayout({ rows, columns, grades, seats, selectedSeat, onSeatSelect }) {
  const handleSeatClick = (seatId) => {
    if (!seats[seatId].reserved) {
      onSeatSelect(seatId);
    }
  };

  const seatLayout = [];

  seatLayout.push(
    <div key="stage" className="stage">
      공연장
    </div>
  );

  for (let i = 1; i <= rows; i++) {
    const row = [];
    row.push(
      <div key={`grade-${i}`} className="seat-grade">
        {grades[i - 1]}
      </div>
    );

    for (let j = 1; j <= columns; j++) {
      const seat = seats.find((s) => s.row === i && s.col === j);
      const isReserved = seat?.reserved || false;
      const isSelected = seat && selectedSeat === seats.indexOf(seat);

      row.push(
        <div
          key={`${i}-${j}`}
          className={`seat ${isReserved ? 'reserved' : ''} ${
            isSelected ? 'selected' : ''
          }`}
          onClick={() => handleSeatClick(seats.indexOf(seat))}
          title={seat ? `등급: ${seat.grade}, 가격: ${seat.price}원` : ''}
        >
          {i}-{j}
        </div>
      );
    }

    seatLayout.push(
      <div key={`row-${i}`} className="seat-row">
        {row}
      </div>
    );
  }

  return <div className="seat-layout-wrapper">{seatLayout}</div>;
}

export default SeatLayout;
