import React, { useEffect, useState } from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import http from "../HTTP/http";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu giỏ hàng
    const fetchCartItems = async () => {
      try {
        const response = await http.get("/api/cart");
        setCartItems(response.data); // Giả sử response.data chứa dữ liệu giỏ hàng
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <>
      <Header />
      <div className="cart-container">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.idSanPham}>
                <img src={item.hinhSP} alt={item.tenSanPham} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                <div>
                  <h3>{item.tenSanPham}</h3>
                  <p>Quantity: {item.soLuong}</p>
                  <p>Price: {item.donGia}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
