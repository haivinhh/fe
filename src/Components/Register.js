import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap"; // Import Alert từ react-bootstrap
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerCus } from "../redux/apiRequest";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState(""); // State để lưu thông báo lỗi validation
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State để hiển thị thông báo thành công
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate password match
    if (password !== confirmPassword) {
      setValidationError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Validate password complexity
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordPattern.test(password)) {
      setValidationError(
        "Mật khẩu phải chứa ít nhất một chữ cái và một chữ số, từ 6 ký tự trở lên"
      );
      return;
    }

    // Validate phone number is numeric
    if (!(/^\d+$/.test(phoneNumber))) {
      setValidationError("Số điện thoại chỉ được chứa các ký tự số");
      return;
    }
    // Clear any previous validation errors
    setValidationError("");

    const newCustomer = {
      userName: username,
      passWord: password,
      hoTen: fullName,
      SDT: phoneNumber,
      diaChi: address,
      email: email,
    };

    // Call registerCus function
    registerCus(newCustomer, dispatch, navigate);

    // Reset form fields after submission (optional)
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhoneNumber("");
    setAddress("");
    setEmail("");

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <>
      <Header />
      <Container className="login-container mt-5">
        <h2 className="text-center">ĐĂNG KÝ</h2>

        {showSuccessMessage && (
          <Alert variant="success" onClose={() => setShowSuccessMessage(false)} dismissible>
            Đăng ký thành công! Đăng nhập để tiếp tục.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Control
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Control
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Control
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fullName">
            <Form.Control
              type="text"
              placeholder="Họ tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phoneNumber">
            <Form.Control
              type="text"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="address">
            <Form.Control
              type="text"
              placeholder="Địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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

          {validationError && (
            <Alert variant="danger" onClose={() => setValidationError("")} dismissible>
              {validationError}
            </Alert>
          )}

          <Button variant="dark" type="submit" className="w-100">
            Đăng ký
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Register;
