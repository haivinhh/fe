import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getDetailCartOfUser } from "../redux/apiRequest";
import { loginSuccess } from "../redux/authSlice";
import { createAxios } from "../redux/createInstance";
import "../CSS/cart.css";

const DetailCart = () => {
  const { idDonHang } = useParams(); // Lấy idDonHang từ URL
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const axiosJWT = createAxios(customer, dispatch, loginSuccess);

    const fetchCart = async () => {
      if (customer?.accessToken && idDonHang) {
        await getDetailCartOfUser(customer.accessToken, idDonHang, dispatch, axiosJWT);
      }
    };

    fetchCart();
  }, [customer, dispatch, idDonHang]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 VND";
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  return (
    <>
      <Header />
      <div className="cart-container">
        <h2>Chi Tiết Giỏ Hàng</h2>
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
                      <p>Số lượng: {item.soLuong}</p>
                      <p>Thành tiền: {formatPrice(item.tongTien)}</p>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="cart-summary">
              {cartData && cartData.length > 0 && (
                <p>Tổng Tiền Đơn Hàng: {formatPrice(cartData.reduce((acc, item) => acc + item.tongTien, 0))}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DetailCart;
