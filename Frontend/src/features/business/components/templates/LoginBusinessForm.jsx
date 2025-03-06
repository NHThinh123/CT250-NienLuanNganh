import { Form, Input, Button, Checkbox, Card, Row, Col, Spin } from "antd";
import useBusinessLogin from "../../hooks/usebusinessLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginForm = () => {
    const navigate = useNavigate();
    const loginMutation = useBusinessLogin();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = (values) => {
        setIsLoading(true);
        loginMutation.mutate(values, {
            onSettled: () => {
                setIsLoading(false); // Tắt loading sau khi hoàn tất login
            },
        });
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            {isLoading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                >
                    <Spin size="large" tip="Đang đăng nhập..." />
                </div>
            )}

            <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                <Card
                    style={{
                        padding: "2rem",
                        borderRadius: "10px",
                        boxShadow: "0px 5px 20px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
                        Đăng Nhập Business
                    </h2>
                    <p style={{ textAlign: "center", color: "#666" }}>
                        Điền vào thông tin email và mật khẩu
                    </p>

                    <Form name="login-form" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Hãy nhập email" }]}>
                            <Input size="large" placeholder="Yumzy@gmail.com" />
                        </Form.Item>

                        <Form.Item label="Mật Khẩu" name="password" rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}>
                            <Input.Password size="large" placeholder="********" />
                        </Form.Item>

                        <Form.Item>
                            <Row justify="space-between">
                                <Checkbox>Hãy Nhớ Tôi</Checkbox>
                            </Row>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={loginMutation.isLoading}
                                style={{ height: "35px" }}
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                        <Button
                            type="default"
                            block
                            size="large"
                            onClick={() => navigate("/")}
                            style={{ marginTop: "0px", height: "35px" }}
                        >
                            Quay về trang chủ
                        </Button>

                        <p style={{ textAlign: "center", marginTop: "10px" }}>
                            Bạn không có tài khoản Business? <a href="/signupBusiness" style={{ color: "#1a73e8", fontWeight: "bold" }}>Đăng Ký Business</a>
                        </p>
                        <p style={{ textAlign: "center", marginTop: "10px" }}>
                            Bạn quên mật khẩu? <a href="/forgot-password" style={{ color: "#1a73e8", fontWeight: "bold" }}>Đặt lại mật khẩu</a>
                        </p>
                        <p style={{ textAlign: "center", marginTop: "10px" }}>
                            Bạn là người dùng bình thường? <a href="/login" style={{ color: "#1a73e8", fontWeight: "bold" }}>Đăng nhập</a>
                        </p>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginForm;
