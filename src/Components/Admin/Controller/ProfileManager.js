import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, notification, Typography, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createAxiosAdmin } from "../../../redux/createInstance";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";

const { Title } = Typography;

const ProfileManager = () => {
  const [employee, setEmployee] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axiosAdmin.get("/api/getuserbyid");
      setEmployee(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch employee details.",
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Error",
        description: "New password and confirmation do not match.",
      });
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      notification.error({
        message: "Error",
        description: "Password must contain at least one letter, one number, and be at least 6 characters long.",
      });
      return;
    }

    try {
      await axiosAdmin.put("/api/user/put", { passWord: newPassword });
      notification.success({
        message: "Success",
        description: "Password updated successfully.",
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update password.",
      });
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      hoTen: employee.hoTen,
      userName: employee.userName,
      SDT: employee.SDT,
      diaChi: employee.diaChi,
      email: employee.email,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleUpdateProfile = async (values) => {
    try {
      await axiosAdmin.put("/api/user/put", values);
      notification.success({
        message: "Success",
        description: "Profile updated successfully.",
      });
      fetchEmployeeDetails();
      handleCancel();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update profile.",
      });
    }
  };

  return (
    <>
      <Title level={2}>Employee Profile</Title>
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 4, height: '100%' }}>
            <Button type="primary" onClick={openModal} style={{ marginBottom: 16 }}>
              Edit Profile
            </Button>
            <div>
              <p><strong>Full Name:</strong> {employee.hoTen}</p>
              <p><strong>Username:</strong> {employee.userName}</p>
              <p><strong>Phone Number:</strong> {employee.SDT}</p>
              <p><strong>Address:</strong> {employee.diaChi}</p>
              <p><strong>Email:</strong> {employee.email}</p>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 4, height: '100%' }}>
            <Title level={3}>Change Password</Title>
            <Form
              layout="vertical"
              onFinish={handleUpdatePassword}
            >
              <Form.Item
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password!' }]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                rules={[{ required: true, message: 'Please enter your new password!' }]}
              >
                <Input.Password
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                rules={[{ required: true, message: 'Please confirm your new password!' }]}
              >
                <Input.Password
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>

      <Modal
        title={<div style={{ textAlign: 'center' }}>{employee ? "Edit Profile" : "Add Profile"}</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            name="hoTen"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="userName"
            label="Username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="SDT"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="diaChi"
            label="Address"
            rules={[{ required: true, message: 'Please enter your address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProfileManager;
