import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Col, Row, TimePicker, Typography, Space } from "antd"; // Thêm Row
import { useBusinessSignup } from "../../hooks/useBusinessSignup";
import { FacebookFilled, TwitterCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Title } = Typography;

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
        formData.append("open_hours", dayjs(values.openHours).format("HH:mm"));
        formData.append("close_hours", dayjs(values.closeHours).format("HH:mm"));
        formData.append("password", values.password);

        register(formData, {
            onSuccess: (data) => {
                const { business } = data;
                if (business && business.id) {
                    navigate(`/subscription/plans/${business.id}`, {
                        state: {
                            email: values.email,
                            businessName: values.businessName,
                        },
                    });
                } else {
                    console.error("Không tìm thấy business.id trong response:", data);
                }
            },
            onError: (error) => {
                console.error("Đăng ký thất bại:", error);
            },
        });
    };

    // Ràng buộc cho mật khẩu
    const passwordValidator = (_, value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;
        if (!value || passwordRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(
            new Error("Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt!")
        );
    };

    // Ràng buộc cho số điện thoại
    const phoneValidator = (_, value) => {
        const phoneRegex = /^\d{10}$/;
        if (!value || phoneRegex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Số điện thoại phải là 10 chữ số!"));
    };

    return (
        <Col
            xs={24}
            md={15}
            style={{
                padding: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    maxWidth: "800px",
                    width: "100%",
                    padding: "40px",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    border: "none",
                }}
            >
                <Title level={3} style={{ textAlign: "center", marginBottom: "30px" }}>
                    Đăng ký doanh nghiệp ẩm thực
                </Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ "--ant-form-item-margin-bottom": "16px" }}
                >
                    <Row gutter={16}>
                        {/* Cột 1 */}
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Tên doanh nghiệp ẩm thực"
                                name="businessName"
                                rules={[{ required: true, message: "Vui lòng nhập tên doanh nghiệp!" }]}
                            >
                                <Input size="large" placeholder="Tên doanh nghiệp ẩm thực" style={{ borderRadius: "8px" }} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
                            >
                                <Input size="large" placeholder="Email" style={{ borderRadius: "8px" }} />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="location"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                            >
                                <Input size="large" placeholder="Địa chỉ" style={{ borderRadius: "8px" }} />
                            </Form.Item>

                            <Form.Item
                                label="Liên hệ"
                                name="contactInfo"
                                rules={[{ required: true, validator: phoneValidator }]}
                            >
                                <Input size="large" placeholder="Số điện thoại" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                        </Col>


                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Giờ mở cửa"
                                name="openHours"
                                rules={[{ required: true, message: "Vui lòng chọn giờ mở cửa!" }]}
                            >
                                <TimePicker
                                    size="large"
                                    format="HH:mm"
                                    style={{ width: "100%", borderRadius: "8px" }}
                                    placeholder="Chọn giờ"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Giờ đóng cửa"
                                name="closeHours"
                                rules={[{ required: true, message: "Vui lòng chọn giờ đóng cửa!" }]}
                            >
                                <TimePicker
                                    size="large"
                                    format="HH:mm"
                                    style={{ width: "100%", borderRadius: "8px" }}
                                    placeholder="Chọn giờ"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, validator: passwordValidator }]}
                            >
                                <Input.Password size="large" placeholder="Mật khẩu" style={{ borderRadius: "8px" }} />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                dependencies={["password"]}
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
                                <Input.Password
                                    size="large"
                                    placeholder="Xác nhận mật khẩu"
                                    style={{ borderRadius: "8px" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            block
                            size="large"
                            style={{
                                borderRadius: "8px",
                                height: "35px",
                                backgroundColor: "#52c41a",
                                borderColor: "#52c41a",
                            }}
                        >
                            Tạo tài khoản
                        </Button>
                        <Button
                            type="default"
                            block
                            size="large"
                            onClick={() => navigate("/")}
                            style={{
                                marginTop: "10px",
                                height: "35px",

                            }}
                        >
                            Quay về trang chủ
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: "center", marginTop: "20px" }}>


                        <p style={{ marginTop: "20px", color: "#888" }}>
                            Đã có tài khoản?{" "}
                            <a href="/loginBusiness" style={{ color: "#1a73e8", fontWeight: "bold" }}>
                                Đăng nhập Business
                            </a>
                        </p>
                    </div>
                </Form>
            </div>
        </Col>
    );
};

export default SignupBusinessForm;