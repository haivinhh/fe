import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, notification } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";
import { createAxiosAdmin } from "../../../redux/createInstance";

const { confirm } = Modal;

const PhoneTypeManager = () => {
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPhoneType, setEditingPhoneType] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  useEffect(() => {
    fetchPhoneTypes();
  }, []);

  const fetchPhoneTypes = async () => {
    try {
      const response = await axiosAdmin.get("/api/loaidtql");
      setPhoneTypes(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch phone types.",
      });
    }
  };

  const handleAdd = async (values) => {
    try {
      await axiosAdmin.post("/api/loaidtql/add", values);
      fetchPhoneTypes();
      setIsModalVisible(false);
      notification.success({
        message: "Success",
        description: "Phone type added successfully.",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to add phone type.",
      });
    }
  };

  const handleEdit = async (values) => {
    confirm({
      title: 'Bạn có chắc chắn muốn sửa thông tin loại điện thoại này không?',
      onOk: async () => {
        try {
          await axiosAdmin.put(`/api/loaidtql/put/${editingPhoneType.idLoaiDT}`, values);
          fetchPhoneTypes();
          setIsModalVisible(false);
          form.resetFields();
          setEditingPhoneType(null);
          notification.success({
            message: "Success",
            description: "Cập nhật loại điện thoại thành công.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to update phone type.",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDelete = async (idLoaiDT) => {
    confirm({
      title: 'Bạn có chắc chắn muốn xóa loại điện thoại này không?',
      onOk: async () => {
        try {
          await axiosAdmin.delete(`/api/loaidtql/del/${idLoaiDT}`);
          fetchPhoneTypes();
          notification.success({
            message: "Success",
            description: "Xóa loại điện thoại thành công.",
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to delete phone type.",
          });
        }
      },
      onCancel() {},
    });
  };

  const openModalAdd = () => {
    form.resetFields();
    setEditingPhoneType(null);
    setIsModalVisible(true);
  };

  const openModalEdit = (phoneType) => {
    setEditingPhoneType(phoneType);
    form.setFieldsValue(phoneType);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingPhoneType(null);
  };

  const columns = [
    {
      title: "ID loại điện thoại",
      dataIndex: "idLoaiDT",
      key: "idLoaiDT",
    },
    {
      title: "Tên loại điện thoại",
      dataIndex: "tenLoaiDienThoai",
      key: "tenLoaiDienThoai",
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
            onClick={() => handleDelete(record.idLoaiDT)}
            danger
          />
        </span>
      ),
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
        Thêm loại điện thoại
      </Button>
      <Table columns={columns} dataSource={phoneTypes} rowKey="idLoaiDT" />
      <Modal
        title={<div style={{ textAlign: 'center' }}>{editingPhoneType ? "Sửa loại điện thoại" : "Thêm loại điện thoại"}</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingPhoneType ? handleEdit : handleAdd}
        >
          <Form.Item
            name="tenLoaiDienThoai"
            label="Tên loại điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {editingPhoneType ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PhoneTypeManager;
