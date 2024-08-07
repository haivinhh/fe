import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container } from "react-bootstrap";
import { Button, notification, Spin } from "antd"; // Import Spin từ Ant Design
import Header from "../Common/Header";
import Footer from "../Common/Footer";

import http from "../HTTP/http"; // Đảm bảo đường dẫn này đúng

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await http.post("/api/forgot-password", { email, username });
      if (response.status === 200) {
        openNotification('success', 'Thành công', 'Đã gửi email xác nhận! Vui lòng kiểm tra hộp thư của bạn.');
        setTimeout(() => navigate("/login"), 2000); // Redirect to home after 2 seconds
      } else {
        openNotification('error', 'Lỗi', response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      openNotification('error', 'Lỗi', errorMsg);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <Container className="login-container mt-5">
        <h2 className="text-center">Quên Mật Khẩu</h2>
        <Spin spinning={loading}> {/* Thêm Spin bao quanh form */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-100" 
              loading={loading} // Thuộc tính loading của Ant Design Button
              disabled={loading} // Ngăn button được bấm nhiều lần
              style={{ backgroundColor: "black" }}
            >
              Gửi Email
            </Button>
          </Form>
        </Spin>
      </Container>
      <Footer />
    </>
  );
};

export default ForgotPassword;
