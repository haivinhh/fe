import React, { useState } from "react";
import { Modal, Form, Input, Button, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createAxiosAdmin } from "../../../redux/createInstance";
import { loginAdminSuccess } from "../../../redux/authSliceAdmin";

const ChangePassword = ({ visible, onCancel, userId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authAdmin.loginAdmin?.currentUser);
  const axiosAdmin = createAxiosAdmin(user, loginAdminSuccess, dispatch);

  const handleOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
            console.log("Sending values to server:", { ...values, userId });
          await axiosAdmin.post(`/api/users/changePassword/${userId}`, {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });
          notification.success({
            message: "Success",
            description: "Thay đổi mật khẩu thành công",
          });
          onCancel();
          form.resetFields();
        } catch (error) {
          notification.error({
            message: "Lỗi",
            description: "Thay đổi mật khẩu thất bại",
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Đổi mật khẩu"
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
      >
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: "Mật khẩu hiện tại là bắt buộc" }]}
        >
          <Input.Password style={{ width:"350px" }}/>
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: "Mật khẩu mới là bắt buộc" }]}
        >
          <Input.Password style={{ width:"350px" }}/>
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Xác nhận mật khẩu là bắt buộc" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password style={{ width:"350px" }}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
