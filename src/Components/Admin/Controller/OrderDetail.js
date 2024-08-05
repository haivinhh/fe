import React, { useEffect, useState } from "react";
import { Modal, Table, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";

const OrderDetail = ({ idDonHang, visible, onCancel }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    if (idDonHang) {
      fetchOrderDetails(idDonHang);
    }
  }, [idDonHang]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axiosAdmin.get(`/api/detailcart/${orderId}`);
      const { details } = response.data; // Assuming response data contains 'details'
      setOrderDetails(details || []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch order details.",
      });
    }
  };

  const columns = [
    {
      title: "Hình sản phẩm",
      dataIndex: "hinhSP",
      key: "hinhSP",
      render: (text) => <img src={text} alt="Product" style={{ width: 100, height: 100, objectFit: 'cover' }} />,
      align: "left"
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      align: "left"
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      align: "left"
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "donGia",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
      align: "left"
    },
    {
      title: "Thành tiền",
      dataIndex: "tongTien",
      key: "tongTien",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
      align: "left"
    },
  ];

  return (
    <Modal
      title={<span style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', display: 'block' }}>Chi tiết đơn hàng</span>} // Center-align the title
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000} // Adjust the width as needed
    >
      <Table
        columns={columns}
        dataSource={orderDetails} // Make sure this is an array
        rowKey="idChiTietDH"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default OrderDetail;
