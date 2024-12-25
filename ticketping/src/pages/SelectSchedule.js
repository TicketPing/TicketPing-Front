import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../api";
import { useAppContext } from "../store";
import { Calendar, Button } from 'antd';
import dayjs from 'dayjs';
import "../style/SelectSchedule.css";

export default function SelectSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { store: { jwtToken } } = useAppContext();
  const headers = { Authorization: jwtToken };

  const [schedules, setSchedules] = useState([]);
  const [selectedDateId, setSelectedDateId] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/performances/${id}/schedules`, { headers });
        setSchedules(response.data.data.content);
      } catch (err) {

      } 
    };

    fetchSchedules();
  }, [id, headers]);

  const disabledDate = (current) => {
    const hasSchedule = schedules.some(schedule => schedule.startDate.startsWith(current.format('YYYY-MM-DD')));
    return !hasSchedule; 
  };

  const monthCellRender = (value) => {
    const month = value.month();
    const year = value.year();

    const daysWithSchedules = schedules
      .filter(schedule => {
        const scheduleDate = dayjs(schedule.startDate);
        return (
          scheduleDate.year() === year &&
          scheduleDate.month() === month
        );
      })
      .map(schedule => schedule.date());

    return (
      <div className="dates">
        {daysWithSchedules.length > 0 && daysWithSchedules.map((currentDay) => (
          <div key={currentDay} className="day has-schedule">
            {currentDay}
          </div>
        ))}
      </div>
    );
  };

  const headerRender = ({ value, onChange }) => {
    return (
      <div className="calendar-header">
        <span>{dayjs(value).format('MMMM YYYY')}</span>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a onClick={() => onChange(value.subtract(1, 'month'))}>&lt;</a>
          <a onClick={() => onChange(value.add(1, 'month'))}>&gt;</a>
        </div>
      </div>
    );
  };

  const handleDateSelect = () => {
    if (selectedDateId) {
      console.log(`공연 id: ${id}`);
      console.log(`선택된 스케줄 id: ${selectedDateId}`);
      
      // 좌석 선점 페이지 이동
      navigate('/'); 
    } else {

    }
  };

  const onDateSelect = (date) => {
    const schedule = schedules.find(schedule => schedule.startDate.startsWith(date.format('YYYY-MM-DD')));
    if (schedule) {
      setSelectedDateId(schedule.id);
    }
  };

  return (
    <div className="container">
      <h1>일정 선택</h1>
      <div className="calendar-container">
        <Calendar 
          disabledDate={disabledDate} 
          monthCellRender={monthCellRender} 
          headerRender={headerRender} 
          fullscreen={false}
          onSelect={onDateSelect} 
        />
      </div>
      <div className="button-container">
        <Button 
          onClick={handleDateSelect} 
          style={{ width: '15%', height: '50%' }}
        >
          선택
        </Button>
      </div>
    </div>
  );
}
