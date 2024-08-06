import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  notification,
  Typography,
  Row,
  Col,
  Table,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { createAxiosAdmin } from "../../../redux/createInstance";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import moment from "moment";
import OrderDetail from "./OrderDetail";

const { Title } = Typography;

const ProfileManager = () => {
  const [employee, setEmployee] = useState({});
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchEmployeeDetails();
    fetchConfirmedOrders();
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

  const fetchConfirmedOrders = async () => {
    try {
      const response = await axiosAdmin.get("/api/confirmorderbyuser");
      setOrders(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch confirmed orders.",
      });
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Error",
        description: "Mật khẩu mới và xác nhận không khớp.",
      });
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      notification.error({
        message: "Error",
        description:
          "Mật khẩu phải chứa ít nhất một chữ cái, một số và ít nhất 6 ký tự.",
      });
      return;
    }

    try {
      await axiosAdmin.put("/api/user/changepassword", {
        currentPassword,
        newPassword,
      });
      notification.success({
        message: "Success",
        description: "Mật khẩu đã được cập nhật thành công.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Cập nhật mật khẩu thất bại.";
      notification.error({
        message: "Error",
        description: errorMsg,
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
        description: "Cập nhật hồ sơ thành công.",
      });
      fetchEmployeeDetails();
      handleCancel();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Cập nhật hồ sơ thất bại.",
      });
    }
  };

  const handleViewOrderDetails = (idDonHang) => {
    setSelectedOrderId(idDonHang);
    setIsOrderDetailVisible(true);
  };

  const handleOrderDetailCancel = () => {
    setIsOrderDetailVisible(false);
    setSelectedOrderId(null);
  };

  const formatDate = (date) => moment(date).format("DD-MM-YYYY HH:mm");

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getStatusText = (status) => {
    switch (status) {
      case "delivery":
        return "Đang giao";
      case "success":
        return "Giao hàng thành công";
      default:
        return "Không xác định";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "delivery":
        return { color: "blue" };
      case "success":
        return { color: "green" };
      default:
        return {};
    }
  };

  const columns = [
    {
      title: "ID Đơn Hàng",
      dataIndex: "idDonHang",
      key: "idDonHang",
      align: "left",
    },
    {
      title: "Tên Người Nhận",
      dataIndex: "tenNguoiNhan",
      key: "tenNguoiNhan",
      align: "left",
    },
    { title: "Địa Chỉ", dataIndex: "diaChi", key: "diaChi", align: "left" },
    {
      title: "Số Điện Thoại",
      dataIndex: "SDT",
      key: "soDienThoai",
      align: "left",
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "phuongThucTT",
      key: "phuongThucThanhToan",
      align: "left",
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "ngayDatHang",
      key: "ngayDatHang",
      align: "left",
      render: (text) => formatDate(text),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "tongTienDH",
      key: "tongTien",
      align: "left",
      render: (text) => formatPrice(text),
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      align: "left",
      render: (text) => (
        <span style={getStatusStyle(text)}>{getStatusText(text)}</span>
      ),
    },
    {
      title: "Đơn Vị Vận Chuyển",
      dataIndex: "donViVanChuyen",
      key: "donViVanChuyen",
      align: "left",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (text, record) => (
        <Button
          icon={<EyeOutlined />}
          type="link"
          onClick={() => handleViewOrderDetails(record.idDonHang)}
        />
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Hồ Sơ Nhân Viên</Title>
      <Row gutter={16}>
        <Col span={12}>
          <div
            style={{
              padding: 24,
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              height: "100%",
              fontSize: "16px",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <p>
                <strong>Họ Tên:</strong> {employee.hoTen}
              </p>
              <p>
                <strong>Username:</strong> {employee.userName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {employee.SDT}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {employee.diaChi}
              </p>
              <p>
                <strong>Email:</strong> {employee.email}
              </p>
            </div>
            <Button
              type="primary"
              onClick={openModal}
              style={{ marginTop: 16 }}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </Col>
        <Col span={12}>
          <div
            style={{
              padding: 16,
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              height: "100%",
            }}
          >
            <Title level={3}>Đổi Mật Khẩu</Title>
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <Form layout="vertical" onFinish={handleUpdatePassword}>
                <Form.Item
                  label="Mật khẩu hiện tại"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu hiện tại!",
                    },
                  ]}
                >
                  <Input.Password
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu mới"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu mới!",
                    },
                  ]}
                >
                  <Input.Password
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu mới!",
                    },
                  ]}
                >
                  <Input.Password
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Đổi Mật Khẩu
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      <Title level={3} style={{ marginTop: 32 }}>
        Đơn Hàng Đã Xác Nhận
      </Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="idDonHang"
        bordered
      />
      <Modal
        title="Chỉnh sửa hồ sơ"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Form.Item
            label="Họ Tên"
            name="hoTen"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="userName"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đăng nhập!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="SDT"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số điện thoại!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="diaChi"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập địa chỉ!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <OrderDetail
        visible={isOrderDetailVisible}
        onCancel={handleOrderDetailCancel}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default ProfileManager;
