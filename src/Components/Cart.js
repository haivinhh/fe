import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getCart } from "../redux/apiRequest";
import '../CSS/cart.css'; // Import file CSS

const Cart = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?.accessToken) {
      getCart(currentUser.accessToken, dispatch);
    }
  }, [currentUser, dispatch]);

  const calculateTotalPrice = () => {
    if (cartData && cartData.length > 0) {
      return cartData.reduce((total, item) => total + item.soLuong * item.donGia, 0);
    }
    return 0;
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
        {cartData && cartData.map((item) => (
          <li key={item.idSanPham} className="cart-item">
            <img
              src={item.hinhSP}
              alt={item.tenSanPham}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{item.tenSanPham}</h3>
              <p>Số lượng: {item.soLuong}</p>
              <p>Giá: {item.donGia} VND</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
    <p>Tổng Tiền Đơn Hàng: {calculateTotalPrice()} VND</p>
  </div>
  <button className="checkout-button">Thanh Toán</button>
    </div>
  )}
  
</div>

      <Footer />
    </>
  );
};

export default Cart;
