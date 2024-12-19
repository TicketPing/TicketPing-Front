// PerformanceDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../api";
import "../style/PerformanceDetail.css";

function PerformanceDetail() {
  const { id } = useParams();
  const [performance, setPerformance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      console.log("Fetching performance details for ID:", id);
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`http://localhost:10001/api/v1/performances/${id}`);
        console.log("Performance data fetched successfully:", response.data);
        setPerformance(response.data.data);
      } catch (err) {
        console.error("Error fetching performance:", err);
        if (err.response && err.response.status === 404) {
          setError("존재하지 않는 공연입니다!");
        } else {
          setError("공연 정보를 불러오는 데 실패했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformance();
  }, [id]);

  useEffect(() => {
    if (performance) {
      const updateRemainingTime = () => {
        console.log("Updating remaining time...");
        const now = new Date();
        const bookingDate = new Date(performance.reservationStartDate);
        const endBookingDate = new Date(performance.reservationEndDate);

        if (now < bookingDate) {
          const diff = bookingDate - now;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          if (days > 0) {
            setTimeRemaining(`예매까지 D-${days}`);
          } else {
            setTimeRemaining(`예매까지 ${hours}시간 ${minutes}분 ${seconds}초`);
          }
        } else if (now >= bookingDate && now <= endBookingDate) {
          setTimeRemaining("공연 예매하기");
        } else {
          setTimeRemaining("예매 마감");
        }
      };

      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);

      return () => clearInterval(interval);
    }
  }, [performance]);

  const formatPrice = (price) => {
    console.log("Formatting price:", price);
    return price.toLocaleString();
  };

  if (isLoading) {
    console.log("Loading state active...");
    return <p>로딩 중...</p>;
  }

  if (error) {
    console.error("Error state:", error);
    return <p>{error}</p>;
  }

  console.log("Rendering performance details:", performance);

  return (
    <div className="performance-detail">
      <div className="poster-detail">
        <img src={performance.posterUrl} alt={performance.name} />
      </div>
      <div className="details">
        <h2>{performance.name}</h2>
        <table className="performance-table">
          <tbody>
            <tr>
              <th>등급</th>
              <td>{performance.grade}세 이상</td>
            </tr>
            <tr>
              <th>관람시간</th>
              <td>{performance.runTime}분</td>
            </tr>
            <tr>
              <th>가격</th>
              <td className="price-cell">
                {performance.seatCostResponses.map((seat, index) => (
                  <div key={index}>
                    {seat.seatGrade} {formatPrice(seat.cost)}원
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <th>공연 날짜</th>
              <td>
                {performance.startDate} ~ {performance.endDate}
              </td>
            </tr>
            <tr>
              <th>공연장</th>
              <td>{performance.performanceHallName}</td>
            </tr>
          </tbody>
        </table>
        <button disabled={timeRemaining !== "공연 예매하기"}>{timeRemaining}</button>
      </div>
    </div>
  );
}

export default PerformanceDetail;
