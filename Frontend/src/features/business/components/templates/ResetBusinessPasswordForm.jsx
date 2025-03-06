import { Form, Input, Button, Card, Row, Col, Spin } from "antd";
import { useResetPassword } from "../../hooks/useResetPassword";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetBusinessPasswordForm = () => {
    const { mutate: resetPasswordMutation } = useResetPassword();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values) => {
        setIsLoading(true);
        resetPasswordMutation(values, {
            onSettled: () => setIsLoading(false),
        });
    };

    return (
        <>

            {isLoading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Mờ nền
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}>
                    <Spin size="large" tip="Đang gửi yêu cầu..." style={{ color: "#fff", fontSize: "18px" }} />
                </div>
            )}

            {/* Form */}
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
                            Đặt Lại Mật Khẩu Business
                        </h2>
                        <p style={{ textAlign: "center", color: "#666" }}>
                            Điền vào email để nhận link đặt lại mật khẩu
                        </p>

                        <Form name="resetpassword-form" layout="vertical" onFinish={onFinish}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Hãy nhập email" },
                                    { type: "email", message: "Email không hợp lệ!" }
                                ]}
                            >
                                <Input size="large" placeholder="example@gmail.com" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block size="large">
                                    Gửi
                                </Button>
                            </Form.Item>
                            <Button
                                type="default"
                                block
                                size="large"
                                onClick={() => navigate("/")}
                                style={{ marginTop: "10px" }}
                            >
                                Quay về trang chủ
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ResetBusinessPasswordForm;
