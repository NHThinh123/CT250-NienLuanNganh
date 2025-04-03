import React from 'react';
import { Form, Input, DatePicker, Select, Button, Checkbox, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const CreateUserForm = ({ onCreateUser, loading, form }) => {
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
      style={{ width: '100%', maxWidth: '800px', margin: '20px auto' }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={24}>
          <Form.Item
            name="name"
            label="Họ Và Tên"
            rules={[{ required: true, message: 'Hãy Nhập Tên Người Dùng!' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={24}>
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
        </Col>

        <Col xs={24} md={24}>
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
        </Col>

        <Col xs={24} md={24}>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Hãy nhập ngày sinh' }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Chọn ngày sinh"
              style={{ width: '100%' }}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="role"
            label="Vai Trò"
            rules={[{ required: true, message: 'Hãy chọn vai trò của người dùng!' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="verified"
            label="Xác Thực"
            valuePropName="checked"
          >
            <Checkbox></Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
            <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: "150px" }}>
              Tạo Người Dùng
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateUserForm;