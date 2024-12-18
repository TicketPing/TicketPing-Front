import React from "react";
import { useParams } from "react-router-dom";
import "../style/PerformanceDetail.css";

const performances = Array.from({ length: 2 }, (_, i) => ({
  id: i + 1,
  name: `공연 ${i + 1}`,
  grade: `등급 ${i + 1}`,
  duration: "120분", 
  price: "VIP: 100,000원 / 일반: 50,000원", 
  startDate: "2024-01-01",
  endDate: "2024-01-10",
  venue: `공연장 ${i + 1}`,
  bookingDate: "2024-01-05",
  poster: "https://via.placeholder.com/300x400",
}));

function PerformanceDetail() {
  const { id } = useParams(); 
  const performance = performances.find((performance) => performance.id === parseInt(id));

  if (!performance) {
    return <p>공연을 찾을 수 없습니다!</p>;
  }

  // 현재 날짜, 예매 가능 날짜, 공연 종료 날짜 설정
  const today = new Date();
  const bookingDate = new Date(performance.bookingDate);
  const endDate = new Date(performance.endDate);

  // 조건 설정
  const isBeforeBooking = today.getTime() < bookingDate.getTime(); // 예매 날짜 이전
  const isAfterEnd = today.getTime() > endDate.getTime(); // 공연 종료 날짜 이후
  const isAfterBooking = today.getTime() > bookingDate.getTime(); // 예매 가능 날짜 이후
  const isBookingAvailable = !isBeforeBooking && !isAfterEnd; // 예매 가능 여부

  // D-Day 계산
  const daysUntilBooking = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)); // 남은 일 수

  // 버튼 텍스트 설정
  const buttonText = isBeforeBooking
    ? `D-${daysUntilBooking}`
    : isAfterEnd
    ? "예매 불가"
    : isAfterBooking && !isBookingAvailable
    ? "예약 만료"
    : "공연 예매하기";

  return (
    <div className="performance-detail">
      <div className="poster-detail">
        <img src={performance.poster} alt={performance.name} />
      </div>
      <div className="details">
        <h2>{performance.name}</h2>
        <table className="performance-table">
          <tbody>
            <tr>
              <th>등급</th>
              <td>{performance.grade}</td>
            </tr>
            <tr>
              <th>상영 시간</th>
              <td>{performance.duration}</td>
            </tr>
            <tr>
              <th>등급별 가격</th>
              <td>{performance.price}</td>
            </tr>
            <tr>
              <th>공연 날짜</th>
              <td>{performance.startDate} ~ {performance.endDate}</td>
            </tr>
            <tr>
              <th>공연장</th>
              <td>{performance.venue}</td>
            </tr>
          </tbody>
        </table>
        <button disabled={!isBookingAvailable}>{buttonText}</button>
      </div>
    </div>
  );
}

export default PerformanceDetail;
