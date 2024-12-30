import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../api";
import { useAppContext } from "../store";
import { notification } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import { useCheckExpiredToken } from "../component/CheckExpiredToken"; 
import "../style/Order.css";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const { performance, seat } = location.state || {};
  const { performanceId, scheduleId } = useParams();
  const { checkExpiredToken } = useCheckExpiredToken();
  const { store: { jwtToken } } = useAppContext();
  const headers = { Authorization: jwtToken };

  const handleBack = async () => {
    try {
      await axiosInstance.post(
        `http://localhost:10001/api/v1/seats/${seat.seatId}/cancel-reserve?performanceId=${performanceId}&scheduleId=${scheduleId}`,
        {},
        { headers }
      );      
      navigate(-1);
    } catch (error) {
      checkExpiredToken(error.response.data);
      console.error("Error during cancle pre-reserve:", error);
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
    }
  };

  const handlePayment = async () => {
    try {
      const response = await axiosInstance.post(
        `http://localhost:10001/api/v1/orders?performanceId=${performanceId}&scheduleId=${scheduleId}&seatId=${seat.seatId}`,
        {},
        { headers }
      );      
      navigate('/checkout', { state: { order: response.data.data } });
    } catch (error) {
      checkExpiredToken(error.response.data);
      console.error("Error during create order:", error);
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
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString();
  };

  return (
    <div className="order-page">
      <h1>주문 정보 확인</h1>
      <div className="order-info">
        {performance ? (
          <>
            <p><strong>공연 이름:</strong> {performance.name}</p>
            <p><strong>좌석:</strong> {seat.row}열 {seat.col}행</p>
            <p><strong>등급:</strong> {seat.grade}</p>
            <p><strong>가격:</strong> {formatPrice(seat.price)}원</p>
          </>
        ) : (
          <p>주문 정보를 가져올 수 없습니다.</p>
        )}
      </div>
      <div className="order-actions">
        <button className="back-button" onClick={handleBack}>
          뒤로가기
        </button>
        <button className="pay-button" onClick={handlePayment}>
          결제하기
        </button>
      </div>
    </div>
  );
}

export default Order;
