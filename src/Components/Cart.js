import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getDetailCart, deleteCartItem, updateCartItem, payCOD } from "../redux/apiRequest";
import { loginSuccess } from "../redux/authSlice";
import { createAxios } from "../redux/createInstance";
import { Button, Modal, Table, Typography, Input, Space } from "antd";
import "../CSS/cart.css";

const { Title, Text } = Typography;

const Cart = () => {
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [idDonHang, setIdDonHang] = useState(null);

  useEffect(() => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);

    const fetchCart = async () => {
      if (customer?.accessToken) {
        try {
          const result = await getDetailCart(customer.accessToken, dispatch, axiosJWT);
          if (result && result.idDonHang) {
            setIdDonHang(result.idDonHang);
          }
        } catch (error) {
          console.error("Failed to fetch cart details:", error);
        }
      }
    };

    fetchCart();
  }, [customer, dispatch]);

  useEffect(() => {
    if (cartData && cartData.length > 0) {
      setIdDonHang(cartData[0]?.idDonHang);
    }
  }, [cartData]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 VND";
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleDeleteCartItem = (idChiTietDH) => {
    setIdToDelete(idChiTietDH);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
    try {
      const result = await deleteCartItem(idToDelete, customer.accessToken, axiosJWT, dispatch);
      if (result.success) {
        alert("Xóa sản phẩm khỏi giỏ hàng thành công");
        await getDetailCart(customer.accessToken, dispatch, axiosJWT);
      } else {
        alert(`Xóa sản phẩm khỏi giỏ hàng thất bại: ${result.error}`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm trong giỏ hàng:", error);
      alert("Xóa sản phẩm khỏi giỏ hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleQuantityChange = async (idChiTietDH, newQuantity) => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
    if (newQuantity < 1) return;

    try {
      const result = await updateCartItem(idChiTietDH, newQuantity, customer.accessToken, axiosJWT);
      if (result.success) {
        await getDetailCart(customer.accessToken, dispatch, axiosJWT);
      } else {
        alert(`Cập nhật số lượng thất bại: ${result.error}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      alert("Cập nhật số lượng thất bại. Vui lòng thử lại sau.");
    }
  };

  const handlePayment = async () => {
    if (!idDonHang) {
      alert("Không tìm thấy đơn hàng để thanh toán.");
      return;
    }

    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
  
    if (paymentMethod === "COD") {
      try {
        const result = await payCOD(idDonHang, customer.accessToken, axiosJWT);
        if (result.success) {
          alert("Thanh toán thành công!");
        } else {
          alert(`Thanh toán thất bại: ${result.message}`);
        }
      } catch (error) {
        console.error("Lỗi khi thanh toán COD:", error);
        alert("Thanh toán thất bại. Vui lòng thử lại.");
      }
    } else {
      alert("Chức năng thanh toán online chưa được triển khai.");
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhSP',
      key: 'hinhSP',
      render: (text, record) => (
        <img src={record.hinhSP} alt={record.tenSanPham} style={{ width: '100px', height: '100px', borderRadius: '5px' }} />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'donGia',
      key: 'donGia',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      render: (text, record) => (
        <Space>
          <Button
            style={{ backgroundColor: '#000', color: '#fff' }}
            onClick={() => handleQuantityChange(record.idChiTietDH, record.soLuong - 1)}
          >
            -
          </Button>
          <Input
            type="number"
            value={record.soLuong}
            onChange={(e) => handleQuantityChange(record.idChiTietDH, parseInt(e.target.value))}
            style={{ width: '60px', textAlign: 'center' }}
          />
          <Button
            style={{ backgroundColor: '#000', color: '#fff' }}
            onClick={() => handleQuantityChange(record.idChiTietDH, record.soLuong + 1)}
          >
            +
          </Button>
        </Space>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="default"
          danger
          style={{ backgroundColor: '#ff4d4f', color: '#fff' }}
          onClick={() => handleDeleteCartItem(record.idChiTietDH)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="cart-container">
        <Title level={2}>Giỏ Hàng</Title>
        {cartData && cartData.length === 0 ? (
          <Text>Giỏ hàng của bạn đang trống.</Text>
        ) : (
          <div className="cart-table-container">
            <Table
              columns={columns}
              dataSource={cartData}
              rowKey="idChiTietDH"
              pagination={false}
            />
            <div className="cart-summary">
              {cartData && cartData.length > 0 && (
                <Text strong>Tổng Tiền Đơn Hàng: {formatPrice(cartData.reduce((acc, item) => acc + item.tongTien, 0))}</Text>
              )}
              <div className="payment-options">
                <Title level={3}>Phương Thức Thanh Toán</Title>
                <Button
                  style={{ backgroundColor: paymentMethod === "COD" ? '#000' : '#f0f0f0', color: paymentMethod === "COD" ? '#fff' : '#000' }}
                  onClick={() => setPaymentMethod("COD")}
                >
                  Thanh toán khi nhận hàng
                </Button>
                {/* Add other payment methods here if needed */}
              </div>
              <Button
                style={{ backgroundColor: '#000', color: '#fff', marginTop: '10px' }}
                onClick={handlePayment}
              >
                Thanh Toán
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        title="Xác Nhận Xóa"
        open={showConfirmModal}
        onOk={confirmDelete}
        onCancel={handleCloseModal}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
      </Modal>

      <Footer />
    </>
  );
};

export default Cart;
