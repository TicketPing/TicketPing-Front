import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { axiosInstance } from "../../api";
import { useAppContext } from "../../store";
import { notification } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import { useCheckExpiredToken } from "../../component/CheckExpiredToken"; 
import SeatLayout from './SeatLayout';
import '../../style/Seat.css';

function Seat() {
  const location = useLocation();
  const navigate = useNavigate();

  const { performance } = location.state || {};
  const { performanceId, scheduleId } = useParams();
  const { checkExpiredToken } = useCheckExpiredToken();
  const { store: { jwtToken } } = useAppContext();
  const headers = { Authorization: jwtToken };

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  const performanceName = performance.name;
  const rows = performance.rows;
  const columns = performance.columns;
  const grades = Array.from({ length: rows }, (_, index) => {
    if (index < rows * 0.2) {
      return 'S';
    } else if (index < rows * 0.4) {
      return 'A';
    } else {
      return 'B';
    }
  });

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/schedules/${scheduleId}/seats`,
          { headers }
        );

        const seatData = response.data.data.map((seat) => ({
          row: seat.row,
          col: seat.col,
          grade: seat.seatGrade,
          price: seat.cost,
          reserved: seat.seatStatus !== "AVAILABLE",
          seatId: seat.seatId, 
        }));

        const sortedSeats = seatData.sort((a, b) => {
          if (a.row === b.row) {
            return a.col - b.col;
          }
          return a.row - b.row;
        });

        setSeats(sortedSeats);
      } catch (error) {
        checkExpiredToken(error.response.data);
        console.error('Error fetching seat data:', error);
        setError("좌석 정보를 불러오는데 실패하였습니다!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, []);

  const handleSeatSelect = (seatId) => {
    setSelectedSeat(selectedSeat === seatId ? null : seatId);
  };

  const handleBooking = async () => {
    if (selectedSeat === null) return;

    const selectedSeatData = seats[selectedSeat];
    if (!selectedSeatData) {
      alert("선택된 좌석이 유효하지 않습니다.");
      return;
    }

    try {
      setIsBooking(true);
      await axiosInstance.post(
        `http://localhost:10001/api/v1/seats/${selectedSeatData.seatId}/pre-reserve?performanceId=${performanceId}&scheduleId=${scheduleId}`,
        {},
        { headers }
      );      
      navigate(`/performance/${performanceId}/schedule/${scheduleId}/order`, { state: { performance: performance, seat: selectedSeatData } });
    } catch (error) {
      checkExpiredToken(error.response.data);
      console.error("Error during booking:", error);
      if (error.response) {
        notification.open({
          message: error.response.data.message || "서버 오류가 발생했습니다.",
          icon: <FrownOutlined style={{ color: "#ff3333" }} />,
        });
      } else {
        notification.open({
          message: "서버 응답이 없습니다. 잠시 후 다시 시도해주세요.",
          icon: <FrownOutlined style={{ color: "#ff3333" }} />,
        });
      } 
    } finally {
      setIsBooking(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  if (isLoading) {
    return <div className="seat-page">Loading seats...</div>;
  }

  if (error) {
    console.error("Error state:", error);
    return <p>{error}</p>;
  }

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
              <p>
                좌석: {seats[selectedSeat].row}열 {seats[selectedSeat].col}행
              </p>
              <p>등급: {seats[selectedSeat].grade}</p>
              <p>가격: {formatPrice(seats[selectedSeat].price)}원</p>
            </div>
          ) : (
            <p>선택된 좌석이 없습니다.</p>
          )}
        </div>
        <button
          className="booking-button"
          onClick={handleBooking}
          disabled={selectedSeat === null || isBooking} 
        >
          {isBooking ? "예약 중..." : "예매하기"}
        </button>
      </div>
    </div>
  );
}

export default Seat;
