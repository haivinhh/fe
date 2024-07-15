import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getCart, deleteCartItem, updateCartItem } from "../redux/apiRequest";
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
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);

    const fetchCart = async () => {
      if (customer?.accessToken) {
        await getCart(customer.accessToken, dispatch, axiosJWT);
      }
    };

    fetchCart();
  }, [customer, dispatch]);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleDeleteCartItem = async (idChiTietDH) => {
    setIdToDelete(idChiTietDH);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
    try {
      const result = await deleteCartItem(idToDelete, customer.accessToken, axiosJWT, dispatch);

      if (result.success) {
        alert("Xóa sản phẩm khỏi giỏ hàng thành công");
        await getCart(customer.accessToken, dispatch, axiosJWT);
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
        await getCart(customer.accessToken, dispatch, axiosJWT);
        alert ('Cập nhật số lượng thành công');
      } else {
        alert(`Cập nhật số lượng thất bại: ${result.error}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      alert("Cập nhật số lượng thất bại. Vui lòng thử lại sau.");
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
                        type="text"
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
              {cartData && (
                <p>Tổng Tiền Đơn Hàng: {formatPrice(cartData[0].tongTienDH)}</p>
              )}
              <Button variant="dark" className="checkout-button">Thanh Toán</Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Cart;
