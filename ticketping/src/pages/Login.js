import React, { useState } from "react";
import { Card, Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api";
import { useAppContext, setToken } from "../store";
import "../style/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [fieldErrors, setFieldErrors] = useState({});
  const [form] = Form.useForm(); 

  const onFinish = async (values) => {
    const { email, password } = values;

    setFieldErrors({});

    const data = { email, password };
    try {
      const response = await axiosInstance.post("/api/v1/auth/login", data);
      const jwtToken = response.data.data.accessToken;

      notification.open({
        message: "로그인 완료",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });

      dispatch(setToken(jwtToken));
      navigate("/");
    } catch (error) {
      if (error.response) {
        notification.open({
          message: `로그인 실패`,
          description: error.response.data.message,
          icon: <FrownOutlined style={{ color: "#ff3333" }} />,
        });

        setFieldErrors((prevErrors) => {
          const updatedErrors = {};
          for (const [fieldName, errors] of Object.entries(prevErrors)) {
            const errorMessage =
              errors instanceof Array ? errors.join(" ") : errors;
            updatedErrors[fieldName] = {
              validateStatus: "error",
              help: errorMessage,
            };
          }
          return {
            ...prevErrors,
            ...updatedErrors,
          };
        });
      }
    }
  };

  return (
    <div className="Login">
      <Card className="card" title={<span className="card-title">로그인</span>}>
        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            className="form-item"
            label={<span className="form-label">Email</span>}
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
            hasFeedback
            {...fieldErrors.email}
            {...fieldErrors.non_field_errors}
          >
            <Input className="form-wrapper" />
          </Form.Item>

          <Form.Item
            className="form-item"
            label={<span className="form-label">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            {...fieldErrors.password}
          >
            <Input.Password className="form-wrapper" />
          </Form.Item>

          <div className="tail-wrapper">
            <Button htmlType="submit" className="button">
              Login
            </Button>
          </div>

          <div className="tail-wrapper">
            <Button className="button">
              <a href="/join">Join</a>
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
