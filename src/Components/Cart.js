import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getDetailCart, deleteCartItem, updateCartItem, getCustomerAddress, updateCustomerAddress, payCOD } from "../redux/apiRequest";
import { loginSuccess } from "../redux/authSlice";
import { createAxios } from "../redux/createInstance";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../CSS/cart.css";

const Cart = () => {
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const dispatch = useDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default payment method
  const [address, setAddress] = useState("");
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

    const fetchAddress = async () => {
      if (customer?.accessToken) {
        try {
          const result = await getCustomerAddress(customer.accessToken, axiosJWT);
          if (result?.address) {
            setAddress(result.address);
          } else {
            setAddress("Chưa có địa chỉ");
          }
        } catch (error) {
          console.error("Failed to fetch customer address:", error);
          setAddress("Chưa có địa chỉ");
        }
      }
    };

    fetchCart();
    fetchAddress();
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
    setShowAddressModal(false);
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

  const handleAddressUpdate = async () => {
    if (!address.trim()) {
      alert("Địa chỉ không được để trống.");
      return;
    }

    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
    try {
      const result = await updateCustomerAddress(address, customer.accessToken, axiosJWT);
      if (result.success) {
        alert("Địa chỉ đã được cập nhật thành công.");
        await getCustomerAddress(customer.accessToken, dispatch, axiosJWT);
        handleCloseModal();
      } else {
        alert(`Cập nhật địa chỉ thất bại: ${result.error}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      alert("Cập nhật địa chỉ thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <>
      <Header />
      <div className="cart-container">
        <h2>Giỏ Hàng</h2>
        {cartData && cartData.length === 0 ? (
          <p>Giỏ hàng của bạn đang trống.</p>
        ) : (
          <div className="cart-list-container">
            <ul className="cart-list">
              {cartData &&
                cartData.map((item) => (
                  <li key={item.idSanPham} className="cart-item">
                    <img src={item.hinhSP} alt={item.tenSanPham} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.tenSanPham}</h3>
                      <p>Đơn giá: {formatPrice(item.donGia)}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <Button variant="dark" onClick={() => handleQuantityChange(item.idChiTietDH, item.soLuong - 1)}>-</Button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={item.soLuong}
                        onChange={(e) => handleQuantityChange(item.idChiTietDH, parseInt(e.target.value))}
                      />
                      <Button variant="dark" onClick={() => handleQuantityChange(item.idChiTietDH, item.soLuong + 1)}>+</Button>
                    </div>
                    <p>Thành tiền: {formatPrice(item.tongTien)}</p>
                    <Button
                      variant="dark"
                      onClick={() => handleDeleteCartItem(item.idChiTietDH)}
                      className="delete-button"
                    >
                      Xóa
                    </Button>
                  </li>
                ))}
            </ul>
            <div className="cart-summary">
              {cartData && cartData.length > 0 && (
                <p>Tổng Tiền Đơn Hàng: {formatPrice(cartData.reduce((acc, item) => acc + item.tongTien, 0))}</p>
              )}
              <div className="address-section">
                <h3>Địa Chỉ</h3>
                <p>{typeof address === 'string' ? address : "Chưa có địa chỉ"}</p>
                <Button variant="primary" onClick={() => setShowAddressModal(true)}>Đổi Địa Chỉ</Button>
              </div>
              <div className="payment-options">
                <h3>Phương Thức Thanh Toán</h3>
                <Button
                  variant="dark"
                  onClick={() => setPaymentMethod("COD")}
                  active={paymentMethod === "COD"}
                >
                  Thanh toán khi nhận hàng
                </Button>
                {/* Add other payment methods here if needed */}
              </div>
              <Button variant="dark" onClick={handlePayment}>Thanh Toán</Button>
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
          <Button variant="danger" onClick={confirmDelete}>Xóa</Button>
        </Modal.Footer>
      </Modal>

      {/* Address Update Modal */}
      <Modal show={showAddressModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cập Nhật Địa Chỉ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
          <Button variant="primary" onClick={handleAddressUpdate}>Cập Nhật</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;
