import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api";
import { useAppContext } from "../store";
import "../style/MyOrder.css";

export default function MyOrder() {
  const {
    store: { jwtToken },
  } = useAppContext();
  const headers = { Authorization: jwtToken };

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);

  const fetchOrders = async () => {
    if (loading || lastPage) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `/api/v1/orders/user-orders?page=${page}&size=10`,
        { headers }
      );

      const { content, last } = response.data.data;
      setOrders((prevOrders) => [...prevOrders, ...content]);
      setLastPage(last);
    } catch (error) {
      console.error("주문 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 10 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "예매 완료":
        return "payment-completed";
      case "예매 취소":
        return "canceled";
      default:
        return "";
    }
  };

  return (
    <div className="myorder-container">
      <h2 className="myorder-title">예매 내역</h2>
      <div className="myorder-list">
        {!loading && orders.length === 0 && (
          <div className="no-orders-message">예매 내역이 없습니다.</div>
        )}
        {orders.map((order, index) => (
          <div
            className={`myorder-detail ${index === 0 ? "first-order" : ""}`}
            key={order.id}
          >
            <div className="myorder-header">
              <div
                className={`order-status ${getOrderStatusClass(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </div>
              <div className="performance-name">{order.performanceName}</div>
            </div>
            <table className="order-table">
              <tbody>
                <tr>
                  <td className="order-label">시작일</td>
                  <td>{order.startDate}</td>
                </tr>
                <tr>
                  <td className="order-label">좌석</td>
                  <td>{`${order.row}석, ${order.col}열 (${order.seatGrade})`}</td>
                </tr>
                <tr>
                  <td className="order-label">공연장</td>
                  <td>{order.performanceHallName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
        {loading && <div>...</div>}
      </div>
    </div>
  );
}
