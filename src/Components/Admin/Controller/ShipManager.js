import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess, logOutSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";
import http from "../../../HTTP/http";

const { confirm } = Modal;

const ShipManager = () => {
  const [dvvc, setDvvc] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDVVC, setEditingDVVC] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchDVVC();
  }, []);

  const fetchDVVC = async () => {
    try {
      const response = await axiosAdmin.get("/api/dvvc");
      setDvvc(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch shipping companies.",
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/dvvc/add", values);
      fetchDVVC();
      setIsModalVisible(false);
      notification.success({
        message: "Success",
        description: "Shipping company added successfully.",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add shipping company.",
      });
    }
  };

  const handleEdit = async (values) => {
    confirm({
      title: 'Bạn có chắc chắn muốn sửa thông tin đơn vị vận chuyển này không?',
      onOk: async () => {
        try {
          await axiosAdmin.put(`/api/dvvc/put/${editingDVVC.idDonViVanChuyen}`, values);
          fetchDVVC();
          setIsModalVisible(false);
          form.resetFields();
          setEditingDVVC(null);
          notification.success({
            message: "Success",
            description: "Sửa thông tin đơn vị vận chuyển thành công.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to update shipping company.",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDelete = async (idDonViVanChuyen) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa đơn vị vận chuyển này không?',
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/api/dvvc/del/${idDonViVanChuyen}`);
          fetchDVVC();
          notification.success({
            message: "Success",
            description: "Xóa đơn vị vận chuyển thành công.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to delete shipping company.",
          });
        }
      },
      onCancel() {},
    });
  };

  const openModalAdd = () => {
    form.resetFields();
    setEditingDVVC(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (dvvc) => {
    setEditingDVVC(dvvc);
    form.setFieldsValue(dvvc);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingDVVC(null);
  };

  const columns = [
    {
      title: "ID đơn vị",
      dataIndex: "idDonViVanChuyen",
      key: "idDonViVanChuyen",
      align: "left",
    },
    {
      title: "Tên đơn vị",
      dataIndex: "tenDonVi",
      key: "tenDonVi",
      align: "left",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => openModalEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.idDonViVanChuyen)}
            danger
          />
        </span>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={openModalAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm đơn vị vận chuyển
      </Button>
      <Table columns={columns} dataSource={dvvc} rowKey="idDonViVanChuyen" />
      <Modal
        title={<div style={{ textAlign: 'center' }}>{editingDVVC ? "Sửa đơn vị vận chuyển" : "Thêm đơn vị vận chuyển"}</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingDVVC ? handleEdit : handleAdd}
        >
          <Form.Item
            name="tenDonVi"
            label="Tên đơn vị"
            rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {editingDVVC ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ShipManager;
