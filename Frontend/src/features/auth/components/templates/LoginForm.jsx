import { Form, Input, Button, Checkbox, Card, Row, Col } from "antd";
import { useLogin } from "../../hooks/useLogin";

const LoginForm = () => {
    const { mutate: loginMutation, isLoading } = useLogin(); // Thêm isLoading để kiểm tra trạng thái đăng nhập

    const onFinish = (values) => {
        loginMutation({
            email: values.email,
            password: values.password,
        });
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                <Card
                    style={{
                        padding: "2rem",
                        borderRadius: "10px",
                        boxShadow: "0px 5px 20px rgba(0,0,0,0.1)",
                    }}
                >
                    <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
                        Đăng Nhập
                    </h2>
                    <p style={{ textAlign: "center", color: "#666" }}>
                        Điền vào thông tin email và mật khẩu
                    </p>

                    {/* Disabled form khi đang loading */}
                    <Form name="login-form" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish} disabled={isLoading}>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Hãy nhập số điện thoại hoặc email" }]}>
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="Mật Khẩu" name="password" rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}>
                            <Input.Password size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Row justify="space-between">
                                <Checkbox disabled={isLoading}>Hãy Nhớ Tôi</Checkbox>
                            </Row>
                        </Form.Item>

                        <Form.Item>
                            {/* Nút đăng nhập hiển thị trạng thái loading */}
                            <Button type="primary" htmlType="submit" block size="large" loading={isLoading} disabled={isLoading}>
                                {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                            </Button>
                        </Form.Item>

                        <p style={{ textAlign: "center", marginTop: "20px" }}>
                            Nếu bạn không có tài khoản? <a href="/signup">Đăng Kí</a>
                        </p>
                        <p style={{ textAlign: "center", marginTop: "20px" }}>
                            Nếu bạn quên mật khẩu? <a href="/forgot-password">Đặt lại mật khẩu</a>
                        </p>
                        <p style={{ textAlign: "center", marginTop: "20px" }}>
                            Nếu bạn là chủ doanh nghiệp ẩm thực? <a href="/loginBusiness">Đăng nhập Business</a>
                        </p>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginForm;
