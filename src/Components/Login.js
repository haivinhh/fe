import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, InputGroup, Alert } from "react-bootstrap";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../CSS/login.css"; // Nếu có CSS riêng cho Login, bạn vẫn có thể giữ

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/apiRequest";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer = {
      userName: userName,
      passWord: passWord,
    };
    const result = await loginUser(customer, dispatch, navigate);
    
    if (result.status === "success") {
      setShowSuccessMessage(true);
      setShowErrorMessage(false);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/");
      }, 1000);
    } else {
      setShowErrorMessage(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterNavigation = () => {
    navigate("/register"); // Điều hướng đến trang đăng ký
  };

  return (
    <>
      <Header />
      <Container className="login-container mt-5">
        <h2 className="text-center">ĐĂNG NHẬP</h2>
        {showSuccessMessage && (
          <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
            Đăng nhập thành công!.
          </Alert>
        )}
        {showErrorMessage && (
          <Alert variant="danger" onClose={() => setShowErrorMessage(false)} dismissible>
            Sai tên đăng nhập hoặc mật khẩu.
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Control
              type="text"
              placeholder="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="passWord">
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
                required
              />
              <span
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
              </span>
            </InputGroup>
            <div className="text-muted mt-2">
              <a href="#">Quên mật khẩu</a> <br /> <a>Khách hàng mới? </a>
              <a onClick={handleRegisterNavigation} style={{ cursor: "pointer", color: "blue" }}>
                Tạo tài khoản
              </a>
            </div>
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100">
            Đăng nhập
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
