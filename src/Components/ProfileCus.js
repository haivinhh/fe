import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { createAxios } from "../redux/createInstance";
import { loginSuccess } from "../redux/authSlice";
import { getCusById, getCart } from "../redux/apiRequest";
import "../CSS/profilecus.css";
import edit from "../Icon/edit.png";

const ProfileCustomer = () => {
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const [customerData, setCustomerData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // Track which field is being edited
  const [editValue, setEditValue] = useState(""); // Store the new value for editing
  const dispatch = useDispatch();
  const axiosJWT = createAxios(customer, dispatch, loginSuccess);

  const fetchCustomerData = async () => {
    if (customer?.accessToken) {
      try {
        const dataCus = await getCusById(customer.idUser, customer.accessToken, axiosJWT);
        setCustomerData(dataCus); // Assuming dataCus is an array
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    }
  };

  const fetchCartData = async () => {
    if (customer?.accessToken) {
      try {
        const data = await getCart(customer.idUser, customer.accessToken, axiosJWT);
        setCartData(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchCartData();
  }, [dispatch]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 VND";
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const customerInfo = customerData[0] || {};

  // Mapping of field names to display labels
  const labelMapping = {
    hoTen: "Họ và tên",
    diaChi: "Địa chỉ",
    SDT: "Số điện thoại",
    email: "Email",
    userName: "Tên đăng nhập",
    passWord: "Mật khẩu" // You can skip displaying this if you don't want it
  };

  const handleEditClick = (field) => {
    setIsEditing(field);
    setEditValue(customerInfo[field] || ""); // Set current value to input
  };

  const handleSaveClick = async () => {
    if (isEditing) {
      try {
        // Implement the save functionality
        // Example: await updateCustomerData(customer.idUser, { [isEditing]: editValue }, customer.accessToken, axiosJWT);
        setIsEditing(null); // Exit editing mode after saving
      } catch (error) {
        console.error("Error updating customer data:", error);
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(null); // Exit editing mode without saving
  };

  return (
    <>
      <Header />
      <Container className="profile-container mt-4">
        <Row>
          <Col md={6}>
            <div className="profile-info">
              <h2>Thông Tin Khách Hàng</h2>
              <div className="info-list">
                {Object.entries(customerInfo).map(([key, value]) => {
                  if (key === 'passWord' || key === 'userName') return null; // Skip password and username

                  // Get the display label for the field
                  const label = labelMapping[key] || key.charAt(0).toUpperCase() + key.slice(1);

                  return (
                    <div className="info-item" key={key}>
                      <Form.Label>{label}:</Form.Label>
                      <div>
                        {isEditing === key ? (
                          <>
                            <Form.Control
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                            />
                            <Button variant="primary" onClick={handleSaveClick} className="mt-2">Lưu</Button>
                            <Button variant="secondary" onClick={handleCancelClick} className="mt-2 ms-2">Hủy</Button>
                          </>
                        ) : (
                          <>
                            <span>{value ? value.toString() : "N/A"}</span>
                            <Button variant="outline-primary" onClick={() => handleEditClick(key)} className="ms-2">
                              <img src={edit} alt="Edit" className="edit-icon" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="password-change">
              <h2>Đổi Mật Khẩu</h2>
              <Form>
                <Form.Group controlId="currentPassword">
                  <Form.Label>Mật khẩu hiện tại:</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Form.Group controlId="newPassword" className="mt-3">
                  <Form.Label>Mật khẩu mới:</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Form.Group controlId="confirmNewPassword" className="mt-3">
                  <Form.Label>Nhập lại mật khẩu mới:</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Button variant="primary" className="mt-3">Đổi mật khẩu</Button>
              </Form>
            </div>
          </Col>
        </Row>
        <div className="profile-orders mt-4">
          <h2>Đơn Hàng Của Bạn</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ngày mua hàng</th>
                <th>Hình thức thanh toán</th>
                <th>Tình trạng</th>
                <th>Tổng tiền</th>
                <th>Chi tiết đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {cartData.length > 0 ? (
                cartData.map((order, index) => (
                  <tr key={index}>
                    <td>{order.idDonHang}</td>
                    <td>{order.ngayDatHang}</td>
                    <td>{order.phuongThucTT}</td>
                    <td>{order.trangThai}</td>
                    <td>{formatPrice(order.tongTienDH)}</td>
                    <td>
                      <Button variant="dark" className="detail-button">Xem chi tiết đơn hàng</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Bạn chưa có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default ProfileCustomer;
