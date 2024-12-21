import React, { useEffect, useState } from 'react';
import { Modal, Button, Progress } from 'antd';
import { useAppContext } from "../store";
import { axiosInstance } from "../api";
import { useNavigate } from "react-router-dom";
import "../style/QueueInfoModal.css";

const QueueInfoModal = ({ visible, onClose, performanceId }) => {
  const navigate = useNavigate();
  const { store: { jwtToken } } = useAppContext();
  const headers = { Authorization: jwtToken };

  const [tokenStatus, setTokenStatus] = useState(null); 
  const [position, setPosition] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchQueueInfo = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/waiting-queue?performanceId=${performanceId}`, { headers });
     
      console.log(response);

      setTokenStatus(response.data.data.tokenStatus);
      setPosition(response.data.data.position);
      setTotalUsers(response.data.data.totalUsers);
      
      if (response.data.data.tokenStatus === "WORKING") {
        navigate(`/performance/${performanceId}/schedule`);
      }
    } catch (error) {
      console.error("대기열 정보 요청 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (visible) { 
      fetchQueueInfo(); 

      const intervalId = setInterval(fetchQueueInfo, 3000); // 3초 주기 Polling

      return () => clearInterval(intervalId); 
    }
  }, [visible]); 

  const progressPercentage = totalUsers > 0 ? ((totalUsers - position) / totalUsers * 100).toFixed(1) : 0;

  return (
    <Modal
      open={visible}
      footer={null} 
      closable={false} 
      styles={{ mask: { backgroundColor: 'rgba(0, 0, 0, 0.90)' } }}
    >
      <div className="queue-entry-modal-content">
        <h3 className="waiting-message">티켓 예매를 위해 접속 대기중입니다.</h3>

        <h1 className="queue-number">나의 대기 순번: {position}</h1>

        <Progress 
          percent={progressPercentage} 
          status="active" 
          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} 
          style={{ marginBottom: '16px' }}
        />

        <h1 className="waiting-message">
          현재 <span style={{ color: '#4A90E2' }}>{totalUsers}</span>명 중 <span style={{ color: '#4A90E2' }}>{position}</span>번째로 대기 중입니다.
        </h1>

        <div className="modal-divider"></div>

        <p>현재 접속량이 많아 대기 중입니다.</p>
        <p>잠시만 기다려 주시면 예매 페이지로 연결됩니다.</p>
      </div>
      <Button key="back" onClick={onClose}>
        닫기
      </Button>
    </Modal>
  );
};

export default QueueInfoModal;
