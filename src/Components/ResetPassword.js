import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, InputGroup, Alert } from "react-bootstrap";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../CSS/login.css";

import http from "../HTTP/http";

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("code");
  const username = searchParams.get("username") || location.state?.username;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      // If username is not provided, navigate back to forgot password
      navigate("/forgot-password");
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setShowErrorMessage(true);
      return;
    }

    try {
      const response = await http.post(`/api/reset-password`, {
        newPassword,
        resetCode: token,
        username // Include username in the request
      });
      if (response.status === 200) {
        setShowSuccessMessage(true);
        setShowErrorMessage(false);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setShowErrorMessage(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />
      <Container className="login-container mt-5">
        <h2 className="text-center">Đổi Mật Khẩu</h2>
        {showSuccessMessage && (
          <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
            Mật khẩu đã được đổi thành công! Vui lòng đăng nhập lại.
          </Alert>
        )}
        {showErrorMessage && (
          <Alert variant="danger" onClose={() => setShowErrorMessage(false)} dismissible>
            Đã xảy ra lỗi hoặc mật khẩu không khớp. Vui lòng thử lại.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="newPassword">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderLeft: "none",
                  padding: "8px",
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  backgroundColor: "#fff",
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderLeft: "none",
                  padding: "8px",
                  borderTopRightRadius: "4px",
                  borderBottomRightRadius: "4px",
                  backgroundColor: "#fff",
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100">
            Đổi Mật Khẩu
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default ResetPassword;
