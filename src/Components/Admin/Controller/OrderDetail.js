import React, { useEffect, useState } from "react";
import { Modal, Table, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createAxiosAdmin } from "../../../redux/createInstance";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import moment from "moment";
import '../../../CSS/ant-table.css';
const { Title } = Typography;

const OrderDetail = ({ visible, onCancel, orderId }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (idDonHang) => {
    try {
      const response = await axiosAdmin.get(`/api/detailcart/${idDonHang}`);
      setOrderDetails(response.data.details);
      setOrderInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch order details", error);
    }
  };

  const formatDate = (date) => moment(date).format("DD-MM-YYYY HH:mm");

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const columns = [
    {
      title: "ID Sản Phẩm",
      dataIndex: "idSanPham",
      key: "idSanPham",
    },
    {
      title: "Hình Sản Phẩm",
      dataIndex: "hinhSP",
      key: "hinhSP",
      render: (text) => <img src={text} alt="Hình Sản Phẩm" style={{ width: 50, height: 50 }} />,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Giá",
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
  ];

  return (
    <Modal
      
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      
      <Title level={4} style={{ marginTop: 16 }}>
        Chi tiết đơn hàng
      </Title>
      <Table columns={columns} dataSource={orderDetails} rowKey="idSanPham" />
    </Modal>
  );
};

export default OrderDetail;
