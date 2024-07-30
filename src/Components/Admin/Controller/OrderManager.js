import React, { useState, useEffect } from "react";
import { Table, Button, notification, Typography } from "antd";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import "../../../CSS/ordermanager.css"; // Ensure you import the CSS file

const { Title } = Typography;

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosAdmin.get("/api/getallcart");
      setOrders(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch orders.",
      });
    }
  };

  const fetchCustomer = async (idUser) => {
    try {
      const response = await axiosAdmin.get(`/api/getcusbyid/${idUser}`);
      setSelectedCustomer(response.data);
    } catch (error) {
      console.error(
        `Failed to fetch customer details for ID: ${idUser}`,
        error
      );
      setSelectedCustomer({ idUser: "Unknown", userName: "Unknown" }); // Set default values
    }
  };

  const fetchOrderDetails = async (idDonHang) => {
    try {
      const response = await axiosAdmin.get(`/api/detailcart/${idDonHang}`);
      setSelectedOrder(response.data);
      setViewingDetails(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch order details.",
      });
    }
  };

  const handleViewDetails = (idDonHang, idUser) => {
    fetchOrderDetails(idDonHang);
    fetchCustomer(idUser);
  };

  const handleBackToOrders = () => {
    setViewingDetails(false);
    setSelectedOrder(null);
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const columns = [
    {
      title: "ID Đơn Hàng",
      dataIndex: "idDonHang",
      key: "idDonHang",
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "phuongThucTT",
      key: "phuongThucTT",
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "ngayDatHang",
      key: "ngayDatHang",
      render: (text) => formatDate(text),
    },
    {
      title: "Tổng Tiền",
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
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.idDonHang, record.idUser)}
            style={{ marginRight: 8 }}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="order-manager-container">
      {viewingDetails ? (
        <div className="order-details-container">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToOrders}
            style={{ marginBottom: 16 }}
          >
            Back to Orders
          </Button>
          {selectedOrder ? (
            <div className="order-details-grid">
              <div className="order-details-left">
                <Title level={3} style={{ textAlign: "left" }}>
                  Chi Tiết Đơn Hàng
                </Title>
                <p>ID Đơn Hàng: {selectedOrder.idDonHang}</p>
                <p>ID User: {selectedOrder.idUser}</p>
                <p>User Name: {selectedCustomer?.userName || "N/A"}</p>
                <p>Tên Người Nhận: {selectedOrder.tenNguoiNhan || "N/A"}</p>
                <p>Số Điện Thoại Người Nhận: <b>{selectedOrder.SDT || "N/A"}</b></p>
                <p>Địa Chỉ: <b>{selectedOrder.diaChi || "N/A"}</b></p>
                <p>
                  Phương Thức Thanh Toán: {selectedOrder.phuongThucTT || "N/A"}
                </p>
                <p>Ngày Đặt Hàng: {formatDate(selectedOrder.ngayDatHang)}</p>
                <p>
                  Tổng Tiền: {formatPrice(selectedOrder.tongTienDH) || "N/A"}
                </p>
                <p>Nhân viên xác nhận: {selectedOrder.tenNhanVien || "N/A"}</p>
                <p>Đơn vị vận chuyển: {selectedOrder.tenDonVi || "N/A"}</p>
                <p>
                  Trạng Thái:{" "}
                  <span style={getStatusStyle(selectedOrder.trangThai)}>
                    {getStatusText(selectedOrder.trangThai)}
                  </span>
                </p>
              </div>
              <div className="order-details-right">
                <Table
                  columns={[
                    {
                      title: "Sản Phẩm",
                      dataIndex: "tenSanPham",
                      key: "tenSanPham",
                    },
                    {
                      title: "Hình Sản Phẩm",
                      dataIndex: "hinhSP",
                      key: "hinhSP",
                      render: (hinhSP) => <img src={hinhSP} alt="Product" />,
                    },
                    { title: "Số Lượng", dataIndex: "soLuong", key: "soLuong" },
                    {
                      title: "Đơn Giá",
                      dataIndex: "donGia",
                      key: "donGia",
                      render: (text) => formatPrice(text),
                    },
                    {
                      title: "Thành Tiền",
                      dataIndex: "tongTien",
                      key: "tongTien",
                      render: (text) => formatPrice(text),
                    },
                  ]}
                  dataSource={selectedOrder.details || []} // Ensure this matches your data structure
                  rowKey="idChiTietDH"
                  pagination={false}
                  className="order-details-table"
                />
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <>
          <Title level={2} style={{ marginBottom: 16 }}>
            Quản lí đơn hàng
          </Title>
          <Table columns={columns} dataSource={orders} rowKey="idDonHang" />
        </>
      )}
    </div>
  );
};

export default OrderManager;
