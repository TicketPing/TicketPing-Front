import { axiosInstance } from "../api";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../store";
import { notification } from "antd";
import { FrownOutlined } from "@ant-design/icons";

export const useEnterQueue = (setIsModalVisible) => {
  const navigate = useNavigate();
  const { store: { jwtToken } } = useAppContext();
  const headers = { Authorization: jwtToken };

  const enterQueue = async (performanceId) => {
    try { 
      await axiosInstance.get(`/api/v1/waiting-queue?performanceId=${performanceId}`, { headers });
      
      // 이미 대기열에 있는 인원
      setIsModalVisible(true); 

    } catch (error) {

      // 대기열에 없는 인원
      if (error.response && error.response.status === 404) {
        
        try {
          const response = await axiosInstance.post(`/api/v1/waiting-queue?performanceId=${performanceId}`, {}, { headers });
          const tokenStatus = response.data.data.tokenStatus;

          if (tokenStatus === "WAITING") {
            setIsModalVisible(true); 
          } else if (tokenStatus === "WORKING") {
            navigate(`/performance/${performanceId}/schedule`);
          }
        } catch (error) {
          if (error.response) {
            notification.open({
              message: `대기열 진입 실패`,
              description: error.response.data.message,
              icon: <FrownOutlined style={{ color: "#ff3333" }} />,
            });
          }
        }

      } else {
        if (error.response) {
          notification.open({
            message: `대기열 진입 실패`,
            description: error.response.data.message,
            icon: <FrownOutlined style={{ color: "#ff3333" }} />,
          });
        }
      }

    }
  };

  return { 
    enterQueue
  };
};
