import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Button } from "antd";

const { Option } = Select;

const CreateUserForm = ({ onCreateUser }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        onCreateUser({
            name: values.name,
            email: values.email,
            password: values.password,
            dateOfBirth: values.dateOfBirth.toISOString(),
            role: values.role,
            verified: values.verified,
        });
        form.resetFields();
    };

    return (
        <Form
            form={form}
            name="createUser"
            onFinish={onFinish}
            layout="vertical"
            style={{ maxWidth: 600, margin: "20px 0" }}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please input the name!" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please input the email!" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please input the password!" }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: "Please select the date!" }]}
            >
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select a role!" }]}
            >
                <Select>
                    <Option value="user">User</Option>
                    <Option value="admin">Admin</Option>
                </Select>
            </Form.Item>
            <Form.Item name="verified" label="Verified" valuePropName="checked">
                <Input type="checkbox" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Create User
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateUserForm;