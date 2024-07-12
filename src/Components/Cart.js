import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getCart } from "../redux/apiRequest";
import "../CSS/cart.css"; // Import file CSS
//import { axiosJWT } from "../HTTP/http";
import http from "../HTTP/http";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../redux/authSlice";
import axios from "axios";
const Cart = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const dispatch = useDispatch();
  let axiosJWT = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
  });
  const refreshToken = async () => {
    try {
      const res = await http.post("/api/refreshtokencus", {});
      console.log("Cookies from response headers:", res.headers["set-cookie"]);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(currentUser?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshCustomer = {
          ...currentUser,
          accessToken: data.accessToken,
        };
        dispatch(loginSuccess(refreshCustomer));
        config.headers["token"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  useEffect(() => {
    if (currentUser?.accessToken) {
      getCart(currentUser.accessToken, dispatch, axiosJWT);
    }
  }, [currentUser, dispatch]);

  const calculateTotalPrice = () => {
    if (cartData && cartData.length > 0) {
      return cartData.reduce(
        (total, item) => total + item.soLuong * item.donGia,
        0
      );
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
              {cartData &&
                cartData.map((item) => (
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
