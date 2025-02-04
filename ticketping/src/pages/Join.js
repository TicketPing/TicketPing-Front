import React, { useState } from "react";
import { Card, Form, Input, Button, notification } from "antd";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../api";
import "../style/Join.css";

export default function Join() {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [form] = Form.useForm(); 

  const onFinish = async (values) => {
    const { email, nickname, password } = values;

    setFieldErrors({});

    const data = { email, nickname, password };
    try {
      await axiosInstance.post("/api/v1/users/signup", data);

      notification.open({
        message: "회원가입 완료",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });

      navigate("/login");
    } catch (error) {
      if (error.response) {
        notification.open({
          message: `회원가입 실패`,
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
    <div className="Join">
      <Card className="card" title={<span className="card-title">회원가입</span>}>
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
            label={<span className="form-label">Nickname</span>}
            name="nickname"
            rules={[{ required: true, message: "Please input your nickname!" }]}
            hasFeedback
            {...fieldErrors.nickname}
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
            {...fieldErrors.non_field_errors}
          >
            <Input.Password className="form-wrapper" />
          </Form.Item>

          <Button htmlType="submit" className="button">
            Submit
          </Button>
        </Form>
      </Card>
    </div>
  );
}
