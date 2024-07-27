import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GroupOutlined,
  UserOutlined,
  ProductOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../Icon/logo.jpg'; // Import your logo image
import '../../CSS/template.css'; // Import your CSS file
import ProductManager from './Controller/ProductManager'; // Import ProductManager component
import { logOut } from '../../redux/APIAdmin/APIAdmin'; // Import your logOut function
import { createAxiosAdmin, checkRefreshToken } from "../../redux/createInstance"; // Import the createAxiosAdmin and checkRefreshToken functions
import { logOutSuccess } from "../../redux/authSlice";

const { Header, Sider, Content } = Layout;

const Template = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('1'); // Track the selected menu item
  const user = useSelector((state) => state.auth.login?.currentUser);
  const idNhanVien = user?.idNhanVien;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = user?.accessToken; // Get accessToken from Redux store

  // Create Axios instance for admin
  let axiosAdmin = createAxiosAdmin(user, logOutSuccess, dispatch);

  // Handler for logout
  const handleLogout = async () => {
    try {
      await logOut(dispatch, idNhanVien, navigate, accessToken, axiosAdmin);
      message.success('Logged out successfully');
      dispatch(logOutSuccess());
      navigate("/admin");
    } catch (error) {
      message.error('Logout failed');
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = async (key) => {
    const tokenValid = await checkRefreshToken(user, dispatch, navigate);
    if (tokenValid) {
      setSelectedMenu(key);
    } else {
      handleLogout();
    }
  };

  // Dropdown menu items
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <a href="/profile">Thông tin cá nhân</a>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout> {/* Ensure Layout takes full height */}
      <Sider trigger={null} collapsible collapsed={collapsed} className="sider-custom">
        {!collapsed && (
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        )}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]} // Set selected key for menu
          items={[
            {
              key: "1",
              icon: <ProductOutlined />,
              label: "Quản lí sản phẩm",
              onClick: () => handleMenuClick("1"),
            },
            {
              key: "2",
              icon: <GroupOutlined />,
              label: "Quản lí danh mục sản phẩm",
              onClick: () => handleMenuClick("2"),
            },
            {
              key: "3",
              icon: <GroupOutlined />,
              label: "Quản lí dòng điện thoại",
              onClick: () => handleMenuClick("3"),
            },
            {
              key: "4",
              icon: <UserOutlined />,
              label: "Quản lí nhân viên",
              onClick: () => handleMenuClick("4"),
            },
            {
              key: "5",
              icon: <UserOutlined />,
              label: "Quản lí khách hàng",
              onClick: () => handleMenuClick("5"),
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: "Quản lí đơn vị vận chuyển",
              onClick: () => handleMenuClick("6"),
            },
            {
              key: "7",
              icon: <UserOutlined />,
              label: "Quản lí đơn hàng",
              onClick: () => handleMenuClick("7"),
            },
            {
              key: "8",
              icon: <UserOutlined />,
              label: "Quản lí khuyến mãi",
              onClick: () => handleMenuClick("8"),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#031220',
          }}
        >
          <div className="header-custom">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: '#fff',
              }}
            />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{
                  fontSize: '16px',
                  color: '#fff',
                  marginLeft: 'auto', // Push to the right
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {selectedMenu === '1' && <ProductManager />} {/* Conditionally render ProductManager */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Template;
