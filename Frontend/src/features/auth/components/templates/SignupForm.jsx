import { Form, Input, Button, Checkbox, Card, Row, Col, DatePicker } from "antd";
import { useSignup } from "../../hooks/useSignup";


const SignupForm = () => {
    const { mutate: signupMutation } = useSignup();

    const onFinish = (values) => {
        signupMutation({
            email: values.email,
            password: values.password,
            name: values.name,
            dateOfBirth: values.dateOfBirth,
            role: values.role,
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
                        Đăng Kí
                    </h2>
                    <p style={{ textAlign: "center", color: "#666" }}>
                        Điền vào thông tin
                    </p>

                    <Form name="signup-form" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
                        <Form.Item
                            label="Họ và tên"
                            name="name"
                            rules={[
                                { required: true, message: "Hãy nhập tên" },
                                { pattern: /^[\p{L}\s]+$/u, message: "Tên đăng nhập không hợp lệ" }
                            ]}
                        >
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Hãy nhập email" },
                                { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Email không hợp lệ" }
                            ]}
                        >
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item
                            label="Mật Khẩu"
                            name="password"
                            rules={[
                                { required: true, message: "Hãy nhập mật khẩu" },
                                { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                                { pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{8,}$/, message: "Mật khẩu phải có chữ Hoa, số, ký tự đặc biệt" }
                            ]}
                        >
                            <Input.Password size="large" />
                        </Form.Item>


                        <Form.Item
                            label="Ngày sinh"
                            name="dateOfBirth"
                            rules={[
                                { required: true, message: "Hãy nhập ngày sinh" }
                            ]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                placeholder="Chọn ngày sinh"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Row justify="space-between">
                                <Checkbox>Hãy Nhớ Tôi</Checkbox>
                            </Row>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={signupMutation.isLoading}>
                                Đăng Kí
                            </Button>
                        </Form.Item>

                        <p style={{ textAlign: "center", marginTop: "20px" }}>
                            Nếu bạn có tài khoản? <a href="/login">Đăng Nhập</a>
                        </p>
                        <p style={{ textAlign: "center", marginTop: "20px" }}>
                            Nếu bạn là chủ doanh nghiệp ẩm thực? <a href="/signupBusiness">Đăng Kí Business</a>
                        </p>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default SignupForm;
