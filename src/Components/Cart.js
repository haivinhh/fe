import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getCart, deleteCartItem } from "../redux/apiRequest"; // Import deleteCartItem từ apiRequest
import { loginSuccess } from "../redux/authSlice";
import { createAxios } from "../redux/createInstance";
import "../CSS/cart.css";

const Cart = () => {
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const dispatch = useDispatch();

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
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);
    try {
      
      const result = await deleteCartItem(idChiTietDH, customer.accessToken, axiosJWT, dispatch);

      if (result.success) {
        alert("Xóa sản phẩm khỏi giỏ hàng thành công");
        // Sau khi xóa thành công, cập nhật lại giỏ hàng
        await getCart(customer.accessToken, dispatch, axiosJWT);
      } else {
        alert(`Xóa sản phẩm khỏi giỏ hàng thất bại: ${result.error}`);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm trong giỏ hàng:", error);
      alert("Xóa sản phẩm khỏi giỏ hàng thất bại. Vui lòng thử lại sau.");
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
                      <p>Số lượng: {item.soLuong}</p>
                      <p>Giá: {formatPrice(item.donGia)}</p>
                      <p>Thành tiền: {formatPrice(item.tongTien)}</p>
                      <button onClick={() => handleDeleteCartItem(item.idChiTietDH)} className="delete-button">Xóa</button>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="cart-summary">
              {cartData && (
                <p>Tổng Tiền Đơn Hàng: {formatPrice(cartData[0].tongTienDH)}</p>
              )}
              <button className="checkout-button">Thanh Toán</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
