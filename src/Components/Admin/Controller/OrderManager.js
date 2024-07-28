import React, { useState, useEffect } from "react";
import { Table, Button, notification, Typography } from "antd";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import http from "../../../HTTP/http";
import '../../../CSS/ordermanager.css'; // Ensure you import the CSS file

const { Title } = Typography;

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerNames, setCustomerNames] = useState({});
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
      const orders = response.data;

      const customerNamesMap = {};
      for (const order of orders) {
        const customerResponse = await axiosAdmin.get(
          `/api/getcusbyid/${order.idUser}`
        );
        customerNamesMap[order.idUser] = customerResponse.data.hoTen;
      }

      setCustomerNames(customerNamesMap);
      setOrders(orders);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch orders.",
      });
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

  const handleViewDetails = (idDonHang) => {
    fetchOrderDetails(idDonHang);
  };

  const handleBackToOrders = () => {
    setViewingDetails(false);
    setSelectedOrder(null);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "unpaid":
        return { color: "red" };
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

  const columns = [
    {
      title: "ID Đơn Hàng",
      dataIndex: "idDonHang",
      key: "idDonHang",
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "idUser",
      key: "idUser",
      render: (idUser) => customerNames[idUser] || "Loading...",
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "tenPhuongThuc",
      key: "tenPhuongThuc",
    },
    {
      title: "Ngày Đặt Hàng",
      dataIndex: "ngayDatHang",
      key: "ngayDatHang",
      render: (text, record) =>
        record.trangThai === "waiting"  ? formatDate(text) : "N/A",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "tongTienDH",
      key: "tongTienDH",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text) => (
        <span style={getStatusStyle(text)}>
          {text === "unpaid" && "Chưa thanh toán"}
          {text === "waiting" && "Chờ xác nhận"}
          {text === "delivery" && "Đang giao"}
          {text === "success" && "Giao hàng thành công"}
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
            onClick={() => handleViewDetails(record.idDonHang)}
            style={{ marginRight: 8 }}
          />
        </span>
      ),
    },
  ];

  return (
    <div>
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
            <div>
              <Title level={3} style={{textAlign: "center"}}>Chi Tiết Đơn Hàng</Title>
              <p>ID Đơn Hàng: {selectedOrder.idDonHang}</p>
              <p>Tên Khách Hàng: {customerNames[selectedOrder.idUser]}</p>
              <p>Phương Thức Thanh Toán: {selectedOrder.tenPhuongThuc}</p>
              <p>
                Ngày Đặt Hàng:{" "}
                {selectedOrder.trangThai === "waiting"
                  ? formatDate(selectedOrder.ngayDatHang)
                  : ""}
              </p>
              <p>Tổng Tiền: {selectedOrder.tongTienDH}</p>
              <p>Trạng Thái: {selectedOrder.trangThai}</p>
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
                    render: (hinhSP) => (
                      <img src={hinhSP} alt="Product" />
                    ),
                  },
                  { title: "Số Lượng", dataIndex: "soLuong", key: "soLuong" },
                  { title: "Đơn Giá", dataIndex: "donGia", key: "donGia" },
                  { title: "Thành Tiền", dataIndex: "tongTien", key: "tongTien" },
                ]}
                dataSource={selectedOrder.details || []} // Ensure this matches your data structure
                rowKey="idChiTietDH"
                pagination={false}
                className="order-details-table"
              />
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <Table columns={columns} dataSource={orders} rowKey="idDonHang" />
      )}
    </div>
  );
};

export default OrderManager;
