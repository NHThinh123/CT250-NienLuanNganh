import React from 'react';
import { Form, Input, DatePicker, Select, Button } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const CreateUserForm = ({ onCreateUser, loading, form }) => { // Nhận form từ prop
  const onFinish = (users) => {
    const dateOfBirthStr = users.dateOfBirth.format("YYYY-MM-DD");
    onCreateUser({
      name: users.name,
      email: users.email,
      password: users.password,
      dateOfBirth: dateOfBirthStr,
      role: users.role,
      verified: users.verified,
    });
  };

  const disabledDate = (current) => current && current.isAfter(dayjs().endOf('day'));

  return (
    <Form
      form={form}
      name="createUser"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: "100%", margin: '20px 0' }}
    >
      <Form.Item name="name" label="Họ Và Tên" rules={[{ required: true, message: 'Hãy Nhập Tên Người Dùng!' }]}>
        <Input style={{ width: "600px" }} />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Hãy nhập email" },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Email không hợp lệ",
          },
        ]}
      >
        <Input size="large" placeholder="example@gmail.com" />
      </Form.Item>
      <Form.Item
        label="Mật Khẩu"
        name="password"
        rules={[
          { required: true, message: "Hãy nhập mật khẩu" },
          { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
          {
            pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/,
            message: "Mật khẩu phải có chữ Hoa, số, ký tự đặc biệt",
          },
        ]}
      >
        <Input.Password size="large" placeholder="Yumzy123@" />
      </Form.Item>
      <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true, message: 'Hãy nhập ngày sinh' }]}>
        <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày sinh" style={{ width: '100%' }} disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item name="role" label="Vai Trò" rules={[{ required: true, message: 'Hãy chọn vai trò của người dùng!' }]}>
        <Select>
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>
      </Form.Item>
      <Form.Item name="verified" label="Xác Thực" valuePropName="checked">
        <Input type="checkbox" />
      </Form.Item>
      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit" loading={loading} >
          Tạo Người Dùng
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUserForm;
