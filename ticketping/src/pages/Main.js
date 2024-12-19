import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api";
import { Link } from "react-router-dom";
import "../style/Main.css";

const ITEMS_PER_LOAD = 10;

function Main() {
  const [performances, setPerformances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);

  const fetchPerformances = async (page) => {
    if (isLoading || !hasMore || error) return;
    setIsLoading(true);

    try {
      const response = await axiosInstance.get("http://localhost:10001/api/v1/performances", {
        params: {
          page,
          size: ITEMS_PER_LOAD,
        },
      });

      const { content, last } = response.data.data;

      if (content.length === 0 || last) {
        setHasMore(false);
      }

      const newPerformances = content.map((item) => ({
        id: item.id,
        name: item.name,
        startDate: item.startDate,
        endDate: item.endDate,
        venue: item.performanceHallName,
        poster: item.posterUrl,
      }));

      setPerformances((prev) => [...prev, ...newPerformances]);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error("Error fetching performances:", err);
      if (err.response) {
        setError(err.response.data.message || "서버 오류가 발생했습니다.");
      } else if (err.request) {
        setError("서버 응답이 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !isLoading &&
        hasMore &&
        !error
      ) {
        fetchPerformances(currentPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    if (currentPage === 0 && performances.length === 0 && !error) {
      fetchPerformances(0);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, isLoading, hasMore, error]);

  return (
    <div className="container">
      <h1>공연 목록</h1>
      {error && <div className="error-message">{error}</div>}
      {performances.length === 0 && !isLoading && !error && (
        <div className="no-performances">현재 공연이 존재하지 않습니다.</div>
      )}
      <div className="grid">
        {performances.map((performance) => (
          <div className="poster-container" key={performance.id}>
            <Link to={`/performance/${performance.id}`}>
              <div className="poster">
                <img src={performance.poster} alt={performance.name} />
              </div>
            </Link>
            <div className="poster-info">
              <h3>{performance.name}</h3>
              <p>
                {performance.startDate} ~ {performance.endDate}
              </p>
              <p>{performance.venue}</p>
            </div>
          </div>
        ))}
      </div>
      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default Main;
