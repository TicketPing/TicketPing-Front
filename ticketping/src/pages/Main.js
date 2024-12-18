import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/Main.css";

const ITEMS_PER_LOAD = 10;

function Main() {
  const [performances, setPerformances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPerformances = async (page) => {
    setIsLoading(true);
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const start = (page - 1) * ITEMS_PER_LOAD;

          const newPerformances = Array.from({ length: ITEMS_PER_LOAD }, (_, i) => ({
            id: start + i + 1,
            name: `공연 ${start + i + 1}`,
            startDate: "2024-01-01",
            endDate: "2024-01-10",
            venue: `공연장 ${start + i + 1}`,
            poster: "https://via.placeholder.com/300x400",
          })).filter((_, idx) => start + idx < 10);

          resolve(newPerformances);
        }, 1000);
      });

      if (response.length === 0) {
        setHasMore(false);
      } else {
        setPerformances((prev) => [...prev, ...response]);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching performances:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        fetchPerformances(currentPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    if (currentPage === 1 && performances.length === 0) {
      fetchPerformances(1);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [performances, currentPage, isLoading, hasMore]);

  return (
    <div className="container">
      <h1>공연 목록</h1>
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
