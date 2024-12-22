import React from 'react';
import '../../style/SeatLayout.css';

function SeatLayout({ rows, columns, grades, seats, selectedSeat, onSeatSelect }) {

  const handleSeatClick = (seatId) => {
    if (!seats[seatId].reserved) {
      onSeatSelect(seatId);
    }
  };

  const seatLayout = [];

  // 공연장 추가
  seatLayout.push(
    <div key="stage" className="stage">
      공연장
    </div>
  );

  for (let i = 0; i < rows; i++) {
    const row = [];
    const grade = seats[i * columns].grade; // 수정: 올바른 grade를 참조
    row.push(
      <div key={`grade-${i}`} className="seat-grade">
        {grades[i]}
      </div>
    );

    for (let j = 0; j < columns; j++) {
      const seatId = i * columns + j;
      const seat = seats[seatId];
      const isReserved = seat.reserved;
      const isSelected = seatId === selectedSeat;

      row.push(
        <div
          key={seatId}
          className={`seat ${isReserved ? 'reserved' : ''} ${
            isSelected ? 'selected' : ''
          }`}
          onClick={() => handleSeatClick(seatId)}
          title={`등급: ${seat.grade}, 가격: ${seat.price}`}
        >
          {i + 1}-{j + 1}
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
