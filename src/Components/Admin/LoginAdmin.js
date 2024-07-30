import React, { useState } from 'react';
import { Input, Form, notification } from 'antd';
import {Button} from "react-bootstrap"
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../../Icon/logo.jpg'; // Import your logo image
import '../../CSS/loginad.css'; // Import your CSS file
import { loginAdmin } from '../../redux/APIAdmin/APIAdmin'; // Import the login function
import { useDispatch } from 'react-redux';

const LoginAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { userName, passWord } = values;
      const success = await loginAdmin(userName, passWord, dispatch);

      if (success) {
        notification.success({
          message: 'Login Successful',
          description: 'You have logged in successfully.',
        });
        // Redirect to /qlsp upon successful login
        navigate('/qlsp');
      } else {
        notification.error({
          message: 'Login Failed',
          description: 'Invalid username or password.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="login-form-container">
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="userName"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="passWord"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button variant="dark" type='submit' htmlType="submit" loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginAdmin;
