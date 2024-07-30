import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { getDetailCartOfUser } from "../redux/apiRequest";
import { loginSuccess } from "../redux/authSlice";
import { createAxios } from "../redux/createInstance";
import { Table, Typography } from "antd";
import "../CSS/detailcart.css"; // Import the new CSS file

const { Title, Text } = Typography;

const DetailCart = () => {
  const { idDonHang } = useParams(); // Get idDonHang from URL
  const customer = useSelector((state) => state.auth.login?.currentUser);
  const cartData = useSelector((state) => state.cart.cart.allCart);
  const dispatch = useDispatch();

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

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhSP',
      key: 'hinhSP',
      render: (text, record) => (
        <img src={record.hinhSP} alt={record.tenSanPham} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
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
    },
    {
      title: 'Thành tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (text) => formatPrice(text),
    },
  ];

  return (
    <>
      <Header />
      <div className="cart-container">
        <Title level={2}>Chi Tiết Giỏ Hàng</Title>
        {cartData && cartData.length === 0 ? (
          <Text>Giỏ hàng của bạn đang trống.</Text>
        ) : (
          <div className="cart-table-container">
            <Table
              columns={columns}
              dataSource={cartData}
              rowKey="idSanPham"
              pagination={false}
              summary={(pageData) => {
                let total = 0;
                pageData.forEach(({ tongTien }) => {
                  total += tongTien;
                });
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={4}>
                        <Title level={4} style={{ margin: 0 }}>
                          Tổng Tiền Đơn Hàng
                        </Title>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        <Text strong >{formatPrice(total)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DetailCart;
