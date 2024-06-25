import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ProductOutlined,
  GroupOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Table, Button, Modal, Input, Form, Select } from "antd";
import { Link } from "react-router-dom";
import http from "../../HTTP/http";
import del from "../../Icon/delete.png";
import edit from "../../Icon/edit.png";
import "../../CSS/admin.css"; // Import file CSS tùy chỉnh

const { Header, Sider, Content } = Layout;

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("Sửa");
  const [action, setAction] = useState("");
  const [listProduct, setListProduct] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [formData, setFormData] = useState({
    idUpdate: "",
    nameUpdate: "",
    priceUpdate: "",
    contentUpdate: "",
    quantityUpdate: "",
    imageUpdate: "",
    danhMucSPUpdate: "",
    dongDTUpdate: "",
  });
  const [danhMucSPList, setDanhMucSPList] = useState([]);
  const [dongDTList, setDongDTList] = useState([]);

  const showModal = (action, idSanPham) => {
    setAction(action);
    if (action === "add") {
      setTitle("Thêm");
      refreshForm();
    } else if (action === "update") {
      setTitle("Sửa");
      fetchProductById(idSanPham);
    }
    setIsModalOpen(true);
  };

  const refreshForm = () => {
    setFormData({
      idUpdate: "",
      nameUpdate: "",
      priceUpdate: "",
      contentUpdate: "",
      quantityUpdate: "",
      imageUpdate: "",
      danhMucSPUpdate: "",
      dongDTUpdate: "",
    });
  };

  const loadListProduct = () => {
    http
      .get("/api/sanpham")
      .then((res) => {
        setListProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadDanhMucSPList = () => {
    http
      .get("/api/danhmucsp")
      .then((res) => {
        setDanhMucSPList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadDongDTList = () => {
    http
      .get("/api/dongdt")
      .then((res) => {
        setDongDTList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    document.title = "Trang Admin";
    loadListProduct();
    loadDanhMucSPList();
    loadDongDTList();
  }, []);

  const isEditing = (record) => record.idSanPham === editingKey;

  const editRow = (record) => {
    setEditingKey(record.idSanPham);
  };

  const cancelEdit = () => {
    setEditingKey("");
  };

  const saveRow = (record) => {
    // Gọi API để lưu dữ liệu sản phẩm
    http
      .put(`/api/sanpham/${record.idSanPham}`, {
        tenSanPham: record.tenSanPham,
        donGia: record.donGia,
        thongTinSP: record.thongTinSP,
        soLuong: record.soLuong,
        hinhSP: record.hinhSP,
        danhMucSP: record.danhMucSP,
        dongDT: record.dongDT,
      })
      .then((res) => {
        if (res.data.success) {
          alert("Cập nhật thành công");
          loadListProduct();
          setEditingKey("");
        } else {
          alert("Cập nhật thất bại");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Cập nhật thất bại");
      });
  };
  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      onOk: () => deleteProd(id),
    });
  };

  const deleteProd = (id) => {
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
  };

  const fetchProductById = (idSanPham) => {
    http
      .get(`/api/sanpham/${idSanPham}`)
      .then((res) => {
        const data = res.data;
        setFormData({
          idUpdate: data.idSanPham,
          nameUpdate: data.tenSanPham,
          priceUpdate: data.donGia,
          contentUpdate: data.thongTinSP,
          quantityUpdate: data.soLuong,
          imageUpdate: data.hinhSP,
          danhMucSPUpdate: data.danhMucSP,
          dongDTUpdate: data.dongDT,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOk = () => {
    const {
      idUpdate,
      nameUpdate,
      priceUpdate,
      contentUpdate,
      quantityUpdate,
      imageUpdate,
      danhMucSPUpdate,
      dongDTUpdate,
    } = formData;

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
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "idSanPham",
      key: "idSanPham",
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      editable: true, // Cho phép chỉnh sửa trực tiếp
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={record.tenSanPham}
            onChange={(e) => handleFieldChange(e.target.value, "tenSanPham", record)}
            onBlur={() => saveRow(record)}
            onPressEnter={() => saveRow(record)}
          />
        ) : (
          record.tenSanPham
        );
      },
    },
    {
      title: "Đơn Giá",
      dataIndex: "donGia",
      key: "donGia",
      editable: true, // Cho phép chỉnh sửa trực tiếp
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={record.donGia}
            onChange={(e) => handleFieldChange(e.target.value, "donGia", record)}
            onBlur={() => saveRow(record)}
            onPressEnter={() => saveRow(record)}
          />
        ) : (
          record.donGia
        );
      },
    },
    {
      title: "Thông Tin Sản Phẩm",
      dataIndex: "thongTinSP",
      key: "thongTinSP",
      editable: true, // Cho phép chỉnh sửa trực tiếp
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={record.thongTinSP}
            onChange={(e) => handleFieldChange(e.target.value, "thongTinSP", record)}
            onBlur={() => saveRow(record)}
            onPressEnter={() => saveRow(record)}
          />
        ) : (
          record.thongTinSP
        );
      },
    },
    {
      title: "Số Lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      editable: true, // Cho phép chỉnh sửa trực tiếp
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={record.soLuong}
            onChange={(e) => handleFieldChange(e.target.value, "soLuong", record)}
            onBlur={() => saveRow(record)}
            onPressEnter={() => saveRow(record)}
          />
        ) : (
          record.soLuong
        );
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "hinhSP",
      key: "hinhSP",
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
      key: "danhMucSP",
      editable: true, // Cho phép chỉnh sửa trực tiếp
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={record.danhMucSP}
            onChange={(value) => handleFieldChange(value, "danhMucSP", record)}
            onBlur={() => saveRow(record)}
            style={{ width: "100%" }}
          >
            {danhMucSPList.map((item) => (
              <Select.Option key={item.idDanhMuc} value={item.idDanhMuc}>
                {item.tenDanhMuc}
              </Select.Option>
            ))}
          </Select>
        ) : (
          record.danhMucSP
        );
      },
    },
    {
      title: "Dòng Điện Thoại",
      dataIndex: "dongDT",
      key: "dongDT",
      editable: true, // Cho phép chỉnh sửa trực tiếp
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={record.dongDT}
            onChange={(value) => handleFieldChange(value, "dongDT", record)}
            onBlur={() => saveRow(record)}
            style={{ width: "100%" }}
          >
            {dongDTList.map((item) => (
              <Select.Option key={item.idDongDT} value={item.idDongDT}>
                {item.tenDongDT}
              </Select.Option>
            ))}
          </Select>
        ) : (
          record.dongDT
        );
      },
    },
    {
      title: "Sửa",
      dataIndex: "edit",
      key: "edit",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <button
              onClick={() => saveRow(record)}
              style={{
                marginRight: 8,
                background: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Lưu
            </button>
            <button
              onClick={cancelEdit}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Hủy
            </button>
          </span>
        ) : (
          <img
            src={edit}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
            onClick={() => editRow(record)}
          />
        );
      },
    },
    {
      title: "Xoá",
      dataIndex: "delete",
      key: "delete",
      render: (_, record) => (
        <img
          src={del}
          style={{ width: "20px", height: "20px", cursor: "pointer" }}
          onClick={() => confirmDelete(record.idSanPham)}
        />
      ),
    },
  ];
  const handleFieldChange = (value, fieldName, record) => {
    // Cập nhật dữ liệu của sản phẩm đang chỉnh sửa
    const updatedRecord = {
      ...record,
      [fieldName]: value,
    };
    const newListProduct = listProduct.map(item =>
      item.idSanPham === record.idSanPham ? updatedRecord : item
    );
    setListProduct(newListProduct);
  };

  return (
    <>
      <Layout>
        <Sider
          width={250} // hoặc width={'30%'} để đặt theo tỉ lệ %
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <ProductOutlined />,
                label: "Quản lí sản phẩm",
              },
              {
                key: "2",
                icon: <GroupOutlined />,
                label: "Quản lí danh mục sản phẩm",
              },
              {
                key: "3",
                icon: <GroupOutlined />,
                label: "Quản lí dòng điện thoại",
              },
              {
                key: "4",
                icon: <UserOutlined />,
                label: "Quản lí nhân viên",
              },
              {
                key: "5",
                icon: <UserOutlined />,
                label: "Quản lí khách hàng"
              },
              {
                key: "6",
                icon: <UserOutlined />,
                label: "Quản lí đơn vị vận chuyển",
              },
              {
                key: "7",
                icon: <UserOutlined />,
                label: "Quản lí đơn hàng",
              },
              {
                key: "8",
                icon: <UserOutlined />,
                label: "Quản lí khuyến mãi",
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
                key: item.idSanPham, // Sử dụng idSanPham làm key
              }))}
            />

            <ProductModal
              title={title}
              isModalOpen={isModalOpen}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formData={formData}
              setFormData={setFormData}
              danhMucSPList={danhMucSPList}
              dongDTList={dongDTList}
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

const ProductModal = ({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  formData,
  setFormData,
  danhMucSPList,
  dongDTList,
}) => {
  const {
    idUpdate,
    nameUpdate,
    priceUpdate,
    contentUpdate,
    quantityUpdate,
    imageUpdate,
    danhMucSPUpdate,
    dongDTUpdate,
  } = formData;

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <Modal
      title={title}
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form layout="vertical">
        <Form.Item label="Tên Sản Phẩm">
          <Input
            value={nameUpdate}
            onChange={(e) => handleChange("nameUpdate", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Đơn Giá">
          <Input
            value={priceUpdate}
            onChange={(e) => handleChange("priceUpdate", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Thông Tin Sản Phẩm">
          <Input
            value={contentUpdate}
            onChange={(e) => handleChange("contentUpdate", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Số Lượng">
          <Input
            value={quantityUpdate}
            onChange={(e) => handleChange("quantityUpdate", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Hình Ảnh URL">
          <Input
            value={imageUpdate}
            onChange={(e) => handleChange("imageUpdate", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Danh Mục Sản Phẩm">
          <Select
            value={danhMucSPUpdate}
            onChange={(value) => handleChange("danhMucSPUpdate", value)}
          >
            {danhMucSPList.map((item) => (
              <Select.Option key={item.idDanhMuc} value={item.idDanhMuc}>
                {item.tenDanhMuc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Dòng Điện Thoại">
          <Select
            value={dongDTUpdate}
            onChange={(value) => handleChange("dongDTUpdate", value)}
          >
            {dongDTList.map((item) => (
              <Select.Option key={item.idDongDT} value={item.idDongDT}>
                {item.tenDongDT}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Admin;

