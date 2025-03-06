import { Form, Input, Button, Checkbox, Card, Row, Col, Spin } from "antd";
import { useLogin } from "../../hooks/useLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { mutate: loginMutation, isLoading } = useLogin();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true); // Hiển thị loading khi bắt đầu đăng nhập
    loginMutation(values, {
      onSettled: () => setLoading(false), // Tắt loading khi hoàn tất
    });
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {/* Overlay Loading */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Mờ nền
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
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
          <h2
            style={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Đăng Nhập
          </h2>
          <p style={{ textAlign: "center", color: "#666" }}>
            Điền vào thông tin email và mật khẩu
          </p>

          <Form
            name="login-form"
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Hãy nhập email" }]}
            >
              <Input
                size="large"
                placeholder="Yumzy123@gmail.com"
                autoComplete="email" // Thêm autocomplete cho email
              />
            </Form.Item>

            <Form.Item
              label="Mật Khẩu"
              name="password"
              rules={[{ required: true, message: "Hãy nhập mật khẩu" }]}
            >
              <Input.Password
                size="large"
                placeholder="********"
                autoComplete="current-password" // Thêm autocomplete cho mật khẩu
              />
            </Form.Item>

            <Form.Item>
              <Checkbox disabled={loading}>Hãy Nhớ Tôi</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
              </Button>
            </Form.Item>
            <Button
              type="default"
              block
              size="large"
              onClick={() => navigate("/")}
              style={{ marginTop: "0px" }}
            >
              Quay về trang chủ
            </Button>

            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Nếu bạn không có tài khoản? <a href="/signup">Đăng Kí</a>
            </p>
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Nếu bạn quên mật khẩu?{" "}
              <a href="/resetpassword">Đặt lại mật khẩu</a>
            </p>
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Nếu bạn là chủ doanh nghiệp ẩm thực?{" "}
              <a href="/loginBusiness">Đăng nhập Business</a>
            </p>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginForm;
