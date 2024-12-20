import React from "react";
import { notification } from "antd";
import { MehOutlined } from "@ant-design/icons";
import { axiosInstance } from "../api";
import { useNavigate } from "react-router-dom";
import { useAppContext, deleteToken } from "../store";

export const Logout = () => {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const { store: { jwtToken } } = useAppContext();

  const handleLogout = async () => {
    const headers = { Authorization: jwtToken };
    
    try {
      await axiosInstance.post("/api/v1/auth/logout", {}, { headers });
      
      notification.open({
        message: "로그아웃 완료",
        icon: <MehOutlined style={{ color: "#fa8c16" }} />,
      });
      
      dispatch(deleteToken());
      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return { handleLogout }; 
};