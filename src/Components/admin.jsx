import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';

import { Table, Button, Modal } from 'antd';
import del from "../Icon/delete.png";
import edit from "../Icon/edit.png";
import { Link } from "react-router-dom";
import http from "../HTTP/http";
const { Header, Sider, Content } = Layout;
const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
    update: (
      <>
        <Button type="primary">Sửa</Button>
      </>
    ),
    delete: (
      <>
        <Button danger type="primary">
          Xóa
        </Button>
      </>
    ),
  });
}
const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("Sửa");
  const [action, setAction] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [nameUpdate, setNameUpdate] = useState("");
  const [priceUpdate, setPriceUpdate] = useState("");
  const [contentUpdate, setContentUpdate] = useState("");
  const [imageUpdate, setImageIdUpdate] = useState("");
//   const isAdmin = JSON.parse(localStorage.getItem("users")).role_id === "1";
  console.log(JSON.parse(localStorage.getItem("user")));
  function showModal(action) {
    if (action === "add") {
      setTitle("Thêm");
      setAction(action);
      refreshForm();
      setIsModalOpen(true);
    } else if (action === "update") {
      setTitle("Sửa");
      setAction(action);
      setIsModalOpen(true);
    }
  }
  function refreshForm() {
    setIdUpdate("");
    setNameUpdate("");
    setPriceUpdate("");
    setContentUpdate("");
    setImageIdUpdate("");
  }
  function loadListProduct() {
    http
      .get("/sanpham")
      .then((res) => {
        console.log(res.data);
        setListProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    document.title = "Trang Admin";
    loadListProduct();
  }, []);

//   function deleteProd(id) {
//     console.log(id);
//     http
//       .delete(`/product.php?id=${id}`)
//       .then((res) => {
//         console.log(res);
//         if (res.data.message === "true") {
//           alert("Xóa thành công");
//           loadListProduct();
//         } else {
//           alert("Xóa thất bại");
//           loadListProduct();
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   function updateProd(id) {
//     http
//       .get(
//         `/product.php?action=findOne&productId=${id}`
//       )
//       .then((res) => {
//         const data = res.data[0];

//         setIdUpdate(data?.id);
//         setNameUpdate(data?.name);
//         setPriceUpdate(data?.price);
//         setContentUpdate(data?.content);
//         setImageIdUpdate(data?.image);
//         showModal("update");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function handleOk() {
//     if (action === "update") {
//       http
//         .put(
//           `/product.php?
//         id=${idUpdate}&
//         name=${nameUpdate}&
//         price=${priceUpdate}&
//         image=${imageUpdate}&
//         content=${contentUpdate}`
//         )
//         .then((res) => {
//           if (res.data.message === "true") {
//             alert("thành công");
//             setIsModalOpen(false);
//             loadListProduct();
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     } else if (action === "add") {

//       var formData = new FormData();
//       formData.append("name",nameUpdate);
//       formData.append("price",priceUpdate);
//       formData.append("content",contentUpdate);
//       formData.append("image",imageUpdate);
//       http({
//         method: "post",
//         url: "/product.php",
//         data: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//         .then(function (response) {
//           //handle success
//           console.log(response);
//           if(response.data.message === "success"){
//             alert("thêm thành công")
//             loadListProduct()
//           }else{
//             alert("thêm thất bại")
//           }
//           setIsModalOpen(false)
//         })
//         .catch(function (response) {
//           //handle error
//           console.log(response);
//         });

//     }
//   }
//   function handleCancel() {
//     setIsModalOpen(false);
//   }
  const columns = [
    {
      title: "Id",
      dataIndex: "idSanPham",
    },
    {
      title: "Name",
      dataIndex: "tenSanPham",
    },
    {
      title: "Price",
      dataIndex: "donGia",
    },
    {
      title: "Content",
      dataIndex: "thongTinSP",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhSP",
      render: (text) => (
        <img
          style={{ width: "80px", height: "80px",borderRadius: "10% 10% 10% 10% / 11% 10% 10% 10% " }}
          src={text}
          alt="ko co hinh"
        />
      ),
    },
    {
      title: "Sửa",
      dataIndex: "id",
      render: (id) => (
        <Link
        //   onClick={() => {
        //     updateProd(id);
        //   }}
          Default
          type="primary"
        >
          <img src={edit} width="20px"/>
        </Link>
      ),
    },
    {
      title: "Delete",
      dataIndex: "id",
      render: (id) => (
        <Link
        //   onClick={() => {
        //     deleteProd(id);
        //   }}
          Default
          
        >
          <img src={del} width="20px"/>
        </Link>
      ),
    },
  ];
  
//   if (!isAdmin )
//   {
//     window.location.href="/"
//   }
  return (

    <>
    
    <Layout >
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Quản lí sản phẩm",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "Quản lí nhân viên",
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <Button
              style={{ marginBottom: "20px",background:"#33cc33"}}
              onClick={() => {
                showModal("add");
              }}
              
              type="success"
            >
              <b>Thêm</b>
              
            </Button>
            <Table 
              pagination={{
                pageSize: 6,
              }}
              columns={columns}
              dataSource={listProduct}
            />
            <Modal
              title={title}
              open={isModalOpen}
            //   onOk={handleOk}
            //   onCancel={handleCancel}
            >
              Name :
              <input
                onChange={(e) => {
                  setNameUpdate(e.target.value);
                }}
                type={"text"}
                value={nameUpdate}
              />
              <br />
              Price :
              <input
                onChange={(e) => {
                  setPriceUpdate(e.target.value);
                }}
                type={"text"}
                value={priceUpdate}
              />
              <br />
              Content :
              <input
                onChange={(e) => {
                  setContentUpdate(e.target.value);
                }}
                type={"text"}
                value={contentUpdate}
              />
              <br />
              ImageUrl :
              <input
                onChange={(e) => {
                  setImageIdUpdate(e.target.value);
                }}
                type={"text"}
                value={imageUpdate}
              />
              <br />
            </Modal>
          </Content>
        </Layout>
      </Layout>

    </>
  );
};
export default Admin;