import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Table, Button, Modal, Input, Form, Select } from "antd";
import { Link } from "react-router-dom";
import http from "../HTTP/http";
import del from "../Icon/delete.png";
import edit from "../Icon/edit.png";
import '../CSS/admin.css'; // Import file CSS tùy chỉnh

const { Header, Sider, Content } = Layout;

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
  const [quantityUpdate, setQuantityUpdate] = useState("");
  const [imageUpdate, setImageUpdate] = useState("");
  const [danhMucSPUpdate, setDanhMucSPUpdate] = useState("");
  const [dongDTUpdate, setDongDTUpdate] = useState("");
  const [danhMucSPList, setDanhMucSPList] = useState([]);
  const [dongDTList, setDongDTList] = useState([]);

  function showModal(action) {
    setAction(action);
    if (action === "add") {
      setTitle("Thêm");
      refreshForm();
    } else if (action === "update") {
      setTitle("Sửa");
    }
    setIsModalOpen(true);
  }

  function refreshForm() {
    setIdUpdate("");
    setNameUpdate("");
    setPriceUpdate("");
    setContentUpdate("");
    setQuantityUpdate("");
    setImageUpdate("");
    setDanhMucSPUpdate("");
    setDongDTUpdate("");
  }

  function loadListProduct() {
    http
      .get("/api/sanpham")
      .then((res) => {
        setListProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function loadDanhMucSPList() {
    http
      .get("/api/danhmucsp")
      .then((res) => {
        setDanhMucSPList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function loadDongDTList() {
    http
      .get("/api/dongdt")
      .then((res) => {
        setDongDTList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    document.title = "Trang Admin";
    loadListProduct();
    loadDanhMucSPList();
    loadDongDTList();
  }, []);

  function deleteProd(id) {
    http
      .delete(`/api/sanpham/${id}`)
      .then((res) => {
        if (res.data.success) {
          alert("Xóa thành công");
          loadListProduct();
        } else {
          alert(
            "Xóa thất bại: " + (res.data.message || "Không xác định được lỗi")
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Xóa thất bại: " + err.message);
      });
  }

  function updateProd(idSanPham) {
    http
      .get(`/api/sanpham/${idSanPham}`)
      .then((res) => {
        const data = res.data[0];
        setIdUpdate(data?.idSanPham);
        setNameUpdate(data?.tenSanPham);
        setPriceUpdate(data?.donGia);
        setContentUpdate(data?.thongTinSP);
        setQuantityUpdate(data?.soLuong);
        setImageUpdate(data?.hinhSP);
        setDanhMucSPUpdate(data?.danhMucSP);
        setDongDTUpdate(data?.dongDT);
        showModal("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleOk() {
    if (action === "update") {
      http
        .put(`/api/sanpham/${idUpdate}`, {
          tenSanPham: nameUpdate,
          donGia: priceUpdate,
          thongTinSP: contentUpdate,
          soLuong: quantityUpdate,
          hinhSP: imageUpdate,
          danhMucSP: danhMucSPUpdate,
          dongDT: dongDTUpdate,
        })
        .then((res) => {
          if (res.data.success) {
            alert("Cập nhật thành công");
            setIsModalOpen(false);
            loadListProduct();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (action === "add") {
      http
        .post("/api/sanpham", {
          tenSanPham: nameUpdate,
          donGia: priceUpdate,
          thongTinSP: contentUpdate,
          soLuong: quantityUpdate,
          hinhSP: imageUpdate,
          danhMucSP: danhMucSPUpdate,
          dongDT: dongDTUpdate,
        })
        .then((response) => {
          if (response.data.idSanPham) {
            alert("Thêm sản phẩm thành công");
            setIsModalOpen(false);
            loadListProduct();
          } else {
            alert("Thêm sản phẩm thất bại");
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Thêm sản phẩm thất bại");
        });
    }
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "idSanPham",
    },
    {
      title: "Tên Sản Phảm",
      dataIndex: "tenSanPham",
    },
    {
      title: "Đơn Giá",
      dataIndex: "donGia",
    },
    {
      title: "Thông Tin Sản Phẩm",
      dataIndex: "thongTinSP",
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuong",
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhSP",
      render: (text) => (
        <img
          style={{ width: "80px", height: "80px", borderRadius: "10%" }}
          src={text}
          alt="không có hình"
        />
      ),
    },
    {
      title: "Danh Mục Sản Phẩm",
      dataIndex: "danhMucSP",
    },
    {
      title: "Dòng Điện Thoại",
      dataIndex: "dongDT",
    },
    {
      title: "Sửa",
      dataIndex: "idSanPham",
      render: (idSanPham) => (
        <Link
          onClick={() => {
            updateProd(idSanPham);
          }}
        >
          <img src={edit} width="20px" alt="edit" />
        </Link>
      ),
    },
    {
      title: "Xóa",
      dataIndex: "idSanPham",
      render: (id) => (
        <Link
          onClick={() => {
            deleteProd(id);
          }}
        >
          <img src={del} width="20px" alt="delete" />
        </Link>
      ),
    },
  ];

  return (
    <>
      <Layout>
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
          <Header className="site-layout-background" style={{ padding: 0 }}>
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
            style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}
          >
            <Button
              style={{ marginBottom: "20px", background: "#33cc33" }}
              onClick={() => {
                showModal("add");
              }}
              type="primary"
            >
              <b>Thêm</b>
            </Button>
            <Table
              columns={columns}
              dataSource={listProduct.map((item) => ({
                ...item,
                key: item.idSanPham,
              }))}
            />
            <Modal
              title={title}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Form layout="vertical">
                <Form.Item label="Tên Sản Phẩm">
                  <Input
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Đơn Giá">
                  <Input
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Thông Tin Sản Phẩm">
                  <Input
                    value={contentUpdate}
                    onChange={(e) => setContentUpdate(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Số Lượng">
                  <Input
                    value={quantityUpdate}
                    onChange={(e) => setQuantityUpdate(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Hình Ảnh URL">
                  <Input
                    value={imageUpdate}
                    onChange={(e) => setImageUpdate(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Danh Mục Sản Phẩm">
                  <Select
                    value={danhMucSPUpdate}
                    onChange={(value) => setDanhMucSPUpdate(value)}
                  >
                    {danhMucSPList.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.tenDanhMuc}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Dòng Điện Thoại">
                  <Select
                    value={dongDTUpdate}
                    onChange={(value) => setDongDTUpdate(value)}
                  >
                    {dongDTList.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.tenDongDT}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Admin;
