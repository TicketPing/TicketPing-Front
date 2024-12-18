import { notification } from "antd";
import { MehOutlined } from "@ant-design/icons";
import { axiosInstance } from "../api";
import { deleteToken } from "../store";

export const processLogout = async (dispatch, jwtToken, navigate) => {
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
