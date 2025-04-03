import React from 'react';
import { Form, Input, Select, Button, TimePicker, Checkbox, Row, Col } from 'antd';
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
            style={{ width: '100%', maxWidth: '800px', margin: '20px auto' }}
        >
            <Row gutter={[16, 0]}>
                <Col xs={24} md={24}>
                    <Form.Item
                        name="business_name"
                        label="Tên Doanh Nghiệp Ẩm Thực"
                        rules={[{ required: true, message: 'Hãy Nhập Tên Doanh Nghiệp Ẩm thực!' }]}
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

                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Giờ mở cửa"
                        name="open_hours"
                        rules={[{ required: true, message: "Vui lòng chọn giờ mở cửa!" }]}
                    >
                        <TimePicker
                            size="large"
                            format="HH:mm"
                            style={{ width: "100%", borderRadius: "8px" }}
                            placeholder="Chọn giờ"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Giờ đóng cửa"
                        name="close_hours"
                        rules={[{ required: true, message: "Vui lòng chọn giờ đóng cửa!" }]}
                    >
                        <TimePicker
                            size="large"
                            format="HH:mm"
                            style={{ width: "100%", borderRadius: "8px" }}
                            placeholder="Chọn giờ"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={24}>
                    <Form.Item
                        name="coordinates"
                        label="Vị Trí"
                        rules={[{ required: true, message: 'Hãy Nhập Vị Trí!' }]}
                    >
                        <Input placeholder="e.g., 106.6297, 10.8231" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={24}>
                    <Form.Item
                        name="location"
                        label="Địa Chỉ"
                        rules={[{ required: true, message: 'Hãy Nhập Địa Chỉ!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col xs={24} md={24}>
                    <Form.Item
                        name="contact_info"
                        label="Thông Tin Liên Hệ"
                        rules={[{ required: true, message: 'Hãy Nhập Thông Tin Liên Hệ!' }]}
                    >
                        <Input />
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

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="status"
                        label="Trạng Thái"
                        initialValue="pending"
                    >
                        <Select>
                            <Option value="pending">Pending</Option>
                            <Option value="active">Active</Option>
                            <Option value="suspended">Suspended</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: "150px" }}>
                            Tạo Doanh Nghiệp
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateBusinessForm;