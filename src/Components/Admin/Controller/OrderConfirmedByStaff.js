import React, { useState } from "react";
import { Table, Button, BackTop } from "antd";
import moment from "moment";
import OrderDetail from "./OrderDetail";
import { EyeOutlined } from "@ant-design/icons";
import '../../../CSS/ant-table.css';

const OrdersTable = ({ userId, orders, onBack }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isOrderDetailVisible, setIsOrderDetailVisible] = useState(false);

  const handleViewOrderDetails = (idDonHang) => {
    setSelectedOrderId(idDonHang);
    setIsOrderDetailVisible(true);
  };

  const handleOrderDetailCancel = () => {
    setIsOrderDetailVisible(false);
    setSelectedOrderId(null);
  };

  const formatDate = (date) => moment(date).format("DD/MM/YYYY HH:mm");

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
          onClick={() => handleViewOrderDetails(record.idDonHang)}
        />
      ),
    },
  ];

  return (
    <div>
      <Button onClick={onBack} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="idDonHang"
      />
      <OrderDetail
        visible={isOrderDetailVisible}
        onCancel={handleOrderDetailCancel}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default OrdersTable;
