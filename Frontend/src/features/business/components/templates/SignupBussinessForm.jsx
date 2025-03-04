import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Col } from "antd";
import { useBusinessSignup } from "../../hooks/useBusinessSignup";

const SignupBusinessForm = () => {
    const navigate = useNavigate();
    const { mutate: register, isPending } = useBusinessSignup();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const formData = new FormData();
        formData.append("business_name", values.businessName);
        formData.append("email", values.email);
        formData.append("location", values.location);
        formData.append("contact_info", values.contactInfo);
        formData.append("open_hours", values.openHours);
        formData.append("close_hours", values.closeHours);
        formData.append("password", values.password);

        register(formData, {
            onSuccess: (data) => {
                const { business } = data;
                navigate(`/payment/activation/${business.id}`);
            },
            onError: (error) => {
                console.error("Đăng ký thất bại:", error);
            },
        });
    };

    return (
        <Col xs={24} md={12} style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
            <div
                style={{
                    maxWidth: "500px", // Tăng chiều rộng khung
                    margin: "0 auto",
                    padding: "30px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{
                        // Giảm khoảng cách giữa các Form.Item
                        "--ant-form-item-margin-bottom": "0px",
                    }}
                >
                    <Form.Item
                        label="Tên doanh nghiệp"
                        name="businessName"
                        rules={[{ required: true, message: "Vui lòng nhập tên doanh nghiệp!" }]}
                    >
                        <Input placeholder="Tên doanh nghiệp" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
                        style={{ marginTop: "-15px" }}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Địa chỉ"
                        name="location"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                        style={{ marginTop: "-15px" }}
                    >
                        <Input placeholder="Địa chỉ" />
                    </Form.Item>

                    <Form.Item
                        label="Liên hệ"
                        name="contactInfo"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                        style={{ marginTop: "-15px" }}
                    >
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        label="Giờ mở cửa"
                        name="openHours"
                        rules={[{ required: true, message: "Vui lòng nhập giờ mở cửa!" }]}
                        style={{ marginTop: "-15px" }}
                    >
                        <Input placeholder="Giờ mở cửa (VD: 08:00)" />
                    </Form.Item>

                    <Form.Item
                        label="Giờ đóng cửa"
                        name="closeHours"
                        rules={[{ required: true, message: "Vui lòng nhập giờ đóng cửa!" }]}
                        style={{ marginTop: "-15px" }}
                    >
                        <Input placeholder="Giờ đóng cửa (VD: 17:00)" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        style={{ marginTop: "-15px" }}
                    >
                        <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={["password"]}
                        style={{ marginTop: "-15px" }}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Xác nhận mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} block>
                            Đăng Ký
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center" }}>

                        <p style={{ marginTop: "10px" }}>
                            Đã có tài khoản? <a href="/login">Đăng nhập</a>
                        </p>
                    </div>
                </Form>
            </div>
        </Col>
    );
};

export default SignupBusinessForm;