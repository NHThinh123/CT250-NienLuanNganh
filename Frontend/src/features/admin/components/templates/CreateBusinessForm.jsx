import React from 'react';
import { Form, Input, Select, Button, TimePicker, Checkbox } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const CreateBusinessForm = ({ onCreateBusiness, loading, form }) => {
    const onFinish = (values) => {
        onCreateBusiness({
            business_name: values.business_name,
            email: values.email,
            password: values.password,
            open_hours: dayjs(values.open_hours).format("HH:mm"),
            close_hours: dayjs(values.close_hours).format("HH:mm"),
            address: { type: "Point", coordinates: values.coordinates },
            location: values.location,
            contact_info: values.contact_info,
            verified: values.verified,
            status: values.status,

        });

    };

    return (
        <Form
            form={form}
            name="createBusiness"
            onFinish={onFinish}
            layout="vertical"
            style={{ maxWidth: 600, margin: '20px 0' }}
        >
            <Form.Item
                name="business_name"
                label="Tên Doanh Nghiệp Ẩm Thực"
                rules={[{ required: true, message: 'Hãy Nhập Tên Doanh Nghiệp Ẩm thực!' }]}
            >
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
            <Form.Item label="Giờ mở cửa" name="open_hours" rules={[{ required: true, message: "Vui lòng chọn giờ mở cửa!" }]}>
                <TimePicker size="large" format="HH:mm" style={{ width: "100%", borderRadius: "8px" }} placeholder="Chọn giờ" />
            </Form.Item>
            <Form.Item label="Giờ đóng cửa" name="close_hours" rules={[{ required: true, message: "Vui lòng chọn giờ đóng cửa!" }]}>
                <TimePicker size="large" format="HH:mm" style={{ width: "100%", borderRadius: "8px" }} placeholder="Chọn giờ" />
            </Form.Item>
            <Form.Item
                name="coordinates"
                label="Vị Trí"
                rules={[{ required: true, message: 'Hãy Nhập Vị Trí!' }]}
            >
                <Input placeholder="e.g., 106.6297, 10.8231" />
            </Form.Item>
            <Form.Item
                name="location"
                label="Địa Chỉ"
                rules={[{ required: true, message: 'Hãy Nhập Địa Chỉ!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="contact_info"
                label="Thông Tin Liên Hệ"
                rules={[{ required: true, message: 'Hãy Nhập Thông Tin Liên Hệ!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="verified" label="Xác Thực" valuePropName="checked">
                <Checkbox></Checkbox>
            </Form.Item>
            <Form.Item name="status" label="Trạng Thái" initialValue="pending">
                <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="active">Active</Option>
                    <Option value="suspended">Suspended</Option>
                </Select>
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Tạo Doanh Nghiệp
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateBusinessForm;
