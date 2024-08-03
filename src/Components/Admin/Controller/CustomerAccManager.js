import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import moment from "moment";

const { Title } = Typography;
const { confirm } = Modal;

const CustomerAccManager = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form] = Form.useForm();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [viewOrders, setViewOrders] = useState(false); // New state to toggle between views

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosAdmin.get("/api/getallcustomers");
      setCustomers(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch customers.",
      });
    }
  };

  const fetchOrders = async (customerId) => {
    setSelectedCustomerId(customerId);
    try {
      const response = await axiosAdmin.get(`/api/getcartbyiduser/${customerId}`);
      setOrders(response.data);
      setViewOrders(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch orders.",
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/customers/add", values);
      fetchCustomers();
      setIsModalVisible(false);
      notification.success({
        message: "Success",
        description: "Customer added successfully.",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add customer.",
      });
    }
  };

  const handleEdit = async (values) => {
    confirm({
      title: "Bạn có chắc chắn muốn sửa thông tin khách hàng này không?",
      onOk: async () => {
        try {
          await axiosAdmin.put(`/api/customers/${editingCustomer.idUser}`, values);
          fetchCustomers();
          setIsModalVisible(false);
          form.resetFields();
          setEditingCustomer(null);
          notification.success({
            message: "Success",
            description: "Customer updated successfully.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to update customer.",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDelete = async (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa khách hàng này không?",
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/api/customers/${id}`);
          fetchCustomers();
          notification.success({
            message: "Success",
            description: "Customer deleted successfully.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to delete customer.",
          });
        }
      },
      onCancel() {},
    });
  };

  const openModalAdd = () => {
    form.resetFields();
    setEditingCustomer(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCustomer(null);
  };

  const formatDate = (date) => moment(date).format("DD-MM-YYYY HH:mm");

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const getStatusText = (status) => {
    switch (status) {
      case "waiting":
        return "Chờ xác nhận";
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
      case "waiting":
        return { color: "orange" };
      case "delivery":
        return { color: "blue" };
      case "success":
        return { color: "green" };
      default:
        return {};
    }
  };

  const customerColumns = [
    {
      title: "ID Khách hàng",
      dataIndex: "idUser",
      key: "idUser",
      align: "left",
    },
    {
      title: "Họ tên",
      dataIndex: "hoTen",
      key: "hoTen",
      align: "left",
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      align: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "SDT",
      key: "SDT",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
    },
    {
      title: "Khách hàng thân thiết",
      dataIndex: "KHThanThiet",
      key: "KHThanThiet",
      align: "left",
      render: (text) => text === 1 ? "X" : "",
    },
    {
      title: "Hành động",
      key: "action",
      align: "left",
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModalEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.idUser)}
            danger
          />
        </span>
      ),
    },
    {
      title: "Xem đơn hàng",
      key: "viewOrders",
      align: "left",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => fetchOrders(record.idUser)}
        />
      ),
    },
  ];

  const orderColumns = [
    {
      title: "ID đơn hàng",
      dataIndex: "idDonHang",
      key: "idDonHang",
      align: "left",
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "phuongThucTT",
      key: "phuongThucTT",
      align: "left",
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "ngayDatHang",
      key: "ngayDatHang",
      render: (text) => formatDate(text),
      align: "left",
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTienDH",
      key: "tongTienDH",
      render: (text) => formatPrice(text),
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text) => (
        <span style={getStatusStyle(text)}>
          {getStatusText(text)}
        </span>
      ),
      align: "left",
    },
  ];

  return (
    <>
      {!viewOrders ? (
        <>
          <Title level={2} style={{ marginBottom: 16 }}>Quản lý tài khoản khách hàng</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openModalAdd}
            style={{ marginBottom: 16 }}
          >
            Thêm khách hàng
          </Button>
          <Table columns={customerColumns} dataSource={customers} rowKey="idUser" />
          <Modal
            title={<div style={{ textAlign: "center" }}>{editingCustomer ? "Sửa khách hàng" : "Thêm khách hàng"}</div>}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              onFinish={editingCustomer ? handleEdit : handleAdd}
            >
              <Form.Item
                name="hoTen"
                label="Họ tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="userName"
                label="Username"
                rules={[{ required: true, message: "Vui lòng nhập username!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="SDT"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: 8 }}
                >
                  {editingCustomer ? "Cập nhật" : "Thêm"}
                </Button>
                <Button onClick={handleCancel}>Hủy</Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        <>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setViewOrders(false)}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>
          <Title level={2}>Chi tiết đơn hàng</Title>
          <Table columns={orderColumns} dataSource={orders} rowKey="idDonHang" />
        </>
      )}
    </>
  );
};

export default CustomerAccManager;
