import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Table,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { createAxios } from "../redux/createInstance";
import { loginSuccess } from "../redux/authSlice";
import {
  getCusById,
  getCart,
  changePassword,
  updateUser,
  getDetailCartOfUser
} from "../redux/apiRequest";
import "../CSS/profilecus.css";
import edit from "../Icon/edit.png";

const ProfileCustomer = () => {
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const [customerData, setCustomerData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosJWT = createAxios(customer, dispatch, loginSuccess);

  const fetchCustomerData = async () => {
    if (customer?.accessToken) {
      try {
        const dataCus = await getCusById(
          customer.idUser,
          customer.accessToken,
          axiosJWT
        );
        setCustomerData(dataCus);
      } catch (error) {}
    }
  };

  const fetchCartData = async () => {
    if (customer?.accessToken) {
      try {
        const data = await getCart(
          customer.idUser,
          customer.accessToken,
          axiosJWT
        );
        setCartData(data);
      } catch (error) {}
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    };

    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", options);
  };
  useEffect(() => {
    fetchCustomerData();
    fetchCartData();
  }, [dispatch]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0 VND";
    }
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const customerInfo = customerData[0] || {};

  const labelMapping = {
    hoTen: "Họ và tên",
    diaChi: "Địa chỉ",
    SDT: "Số điện thoại",
    email: "Email",
    userName: "Tên đăng nhập",
    passWord: "Mật khẩu",
  };

  const orderedFields = ["hoTen", "SDT", "email", "diaChi"];

  const handleEditClick = (field) => {
    setIsEditing(field);
    setEditValue(customerInfo[field] || "");
  };
  const handleOrderDetailClick = async (idDonHang) => {
    try {
      // Send request to the server with idDonHang
      const response = await getDetailCartOfUser(idDonHang, customer.accessToken, axiosJWT);
  
      if (response.success) {
        // Navigate to DetailCart component with the idDonHang in the URL
        navigate(`/getdetailcart/${idDonHang}`);
      } else {
        // Handle server errors or response failures
        console.error("Error fetching order details:", response.message);
      }
    } catch (error) {
      console.error("Error sending order detail request:", error);
    }
  };
  const handleSaveClick = async () => {
    if (isEditing) {
      try {
        const response = await updateUser(
          {
            idUser: customer.idUser,
            [isEditing]: editValue,
          },
          customer.accessToken,
          axiosJWT
        );

        if (response.success) {
          setUpdateSuccessMessage("Cập nhật thông tin thành công.");
          fetchCustomerData();
          setIsEditing(null);

          // Clear the success message after 3 seconds
          setTimeout(() => {
            setUpdateSuccessMessage("");
          }, 2000);
        } else {
          setUpdateErrorMessage(
            response.message || "Lỗi khi cập nhật thông tin."
          );
          setTimeout(() => {
            setUpdateErrorMessage("");
          }, 2000); // Show error for 3 seconds
        }
      } catch (error) {
        setUpdateErrorMessage("Đã xảy ra lỗi khi cập nhật thông tin.");
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(null);
  };

  const handlePasswordChange = async () => {
    setPasswordChangeMessage(""); // Clear previous messages
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordChangeMessage("Vui lòng điền đầy đủ các ô mật khẩu.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(newPassword)) {
      setPasswordChangeMessage(
        "Mật khẩu mới phải chứa ít nhất một chữ cái, một chữ số, và từ 6 ký tự trở lên."
      );
      return;
    }

    try {
      const response = await changePassword(
        currentPassword,
        newPassword,
        customer.accessToken,
        axiosJWT
      );

      if (response.success) {
        setPasswordChangeMessage("Đổi mật khẩu thành công.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => {
          setPasswordChangeMessage("");
        }, 2000);
      } else if (response.error === "Current password is incorrect.") {
        setPasswordChangeMessage("Mật khẩu hiện tại không chính xác.");
        setTimeout(() => {
          setPasswordChangeMessage("");
        }, 2000);
      } else if (
        response.error ===
        "New password cannot be the same as the current password."
      ) {
        setPasswordChangeMessage("Mật khẩu mới không được giống mật khẩu cũ.");
      } else {
        setPasswordChangeMessage(
          response.error || "Đã xảy ra lỗi khi đổi mật khẩu."
        );
      }
    } catch (error) {
      setPasswordChangeMessage("Đã xảy ra lỗi khi đổi mật khẩu.");
    }
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
                {orderedFields.map((key) => {
                  const value = customerInfo[key];
                  const label =
                    labelMapping[key] ||
                    key.charAt(0).toUpperCase() + key.slice(1);

                  return (
                    <div className="info-item" key={key}>
                      <Form.Label>{label}:</Form.Label>
                      <div className="info-content">
                        {isEditing === key ? (
                          <>
                            <Form.Control
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              style={{
                                width: "300px",
                              }}
                            />
                            <Button
                              variant="dark"
                              onClick={handleSaveClick}
                              className="mt-2"
                              style={{
                                marginBottom: "10px",
                              }}
                            >
                              Lưu
                            </Button>
                            <Button
                              variant="danger"
                              onClick={handleCancelClick}
                              className="mt-2 ms-2"
                              style={{
                                marginBottom: "10px",
                              }}
                            >
                              Hủy
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="info-text">
                              <span className="info-value">
                                {value ? value.toString() : "N/A"}
                              </span>
                              <div className="button-edit">
                                <Button
                                  variant="light"
                                  onClick={() => handleEditClick(key)}
                                  className="ms-2"
                                >
                                  <img
                                    src={edit}
                                    alt="Edit"
                                    className="edit-icon"
                                  />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
                {updateSuccessMessage && (
                  <div className="mt-3">
                    <span
                      className={
                        updateSuccessMessage.includes("thành công")
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {updateSuccessMessage}
                    </span>
                  </div>
                )}
                {updateErrorMessage && (
                  <div className="mt-3">
                    <span className="text-danger">{updateErrorMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="password-change">
              <h2>Đổi Mật Khẩu</h2>
              <Form>
                <Form.Group controlId="currentPassword">
                  <Form.Label>Mật khẩu hiện tại:</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Mật khẩu hiện tại"
                      required
                    />
                    <InputGroup.Text
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      style={{
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        borderLeft: "none",
                        backgroundColor: "#fff",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showCurrentPassword ? faEyeSlash : faEye}
                      />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="newPassword" className="mt-3">
                  <Form.Label>Mật khẩu mới:</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới"
                      required
                    />
                    <InputGroup.Text
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        borderLeft: "none",
                        backgroundColor: "#fff",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showNewPassword ? faEyeSlash : faEye}
                      />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="confirmNewPassword" className="mt-3">
                  <Form.Label>Nhập lại mật khẩu mới:</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                    <InputGroup.Text
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      style={{
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        borderLeft: "none",
                        backgroundColor: "#fff",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showConfirmNewPassword ? faEyeSlash : faEye}
                      />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                {passwordChangeMessage && (
                  <div className="mt-3">
                    <span
                      className={
                        passwordChangeMessage.includes("thành công")
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {passwordChangeMessage}
                    </span>
                  </div>
                )}
                <Button
                  variant="dark"
                  className="mt-3"
                  onClick={handlePasswordChange}
                >
                  Đổi mật khẩu
                </Button>
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
                    <td>{formatDate(order.ngayDatHang)}</td>
                    <td>{order.phuongThucTT}</td>
                    <td>{order.trangThai}</td>
                    <td>{formatPrice(order.tongTienDH)}</td>
                    <td>
                    <Button 
    variant="dark" 
    className="detail-button" 
    onClick={() => navigate(`/getdetailcart/${order.idDonHang}`)}
  >
    Xem chi tiết đơn hàng
  </Button>
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
