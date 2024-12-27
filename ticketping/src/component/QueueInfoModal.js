import React, { useEffect, useState } from 'react';
import { Modal, Button, Progress } from 'antd';
import { useAppContext } from "../store";
import { axiosInstance } from "../api";
import { useNavigate } from "react-router-dom";
import "../style/QueueInfoModal.css";

const QueueInfoModal = ({ visible, onClose, performance }) => {
  const navigate = useNavigate();
  const { store: { jwtToken } } = useAppContext();
  const headers = { Authorization: jwtToken };

  const [queueData, setQueueData] = useState({
    tokenStatus: null,
    position: 0,
    totalUsers: 0
  });

  const fetchQueueInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/waiting-queue?performanceId=${performance.id}`,
        { headers }
      );
      
      const newData = response.data.data;
      setQueueData(newData);

      if (newData.tokenStatus === "WORKING") {
        navigate(`/performance/${performance.id}/schedule`, { state: { performance } });
      }
    } catch (error) {
      console.error("대기열 정보 요청 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchQueueInfo();
      const intervalId = setInterval(fetchQueueInfo, 3000);
      return () => clearInterval(intervalId);
    }
  }, [visible, performance, navigate]);

  const progressPercentage = queueData.totalUsers > 0 
    ? ((queueData.totalUsers - queueData.position) / queueData.totalUsers * 100).toFixed(1) 
    : 0;

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      styles={{ mask: { backgroundColor: 'rgba(0, 0, 0, 0.90)' } }}
    >
      <div className="queue-entry-modal-content">
        <h3 className="waiting-message">티켓 예매를 위해 접속 대기중입니다.</h3>
        <h1 className="queue-number">나의 대기 순번: {queueData.position}</h1>
        <Progress
          percent={progressPercentage}
          status="active"
          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
          style={{ marginBottom: '16px' }}
        />
        <h1 className="waiting-message">
          현재 <span style={{ color: '#4A90E2' }}>{queueData.totalUsers}</span>명 중{' '}
          <span style={{ color: '#4A90E2' }}>{queueData.position}</span>번째로 대기 중입니다.
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
