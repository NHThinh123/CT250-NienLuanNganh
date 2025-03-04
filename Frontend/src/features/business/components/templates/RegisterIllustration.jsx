// features/register/components/RegisterIllustration.jsx
import React from "react";
import { Col } from "antd";
import image from "../../../../assets/signupbusiness/image.png";

const RegisterIllustration = () => {
    return (
        <Col xs={0} md={12} style={{ textAlign: "center", padding: "50px" }}>
            <img
                src={image}
                alt="Illustration"
                style={{ maxWidth: "100%", height: "auto" }}
            />
            <h2>Đăng Ký Tài Khoản Business</h2>
            <p>Tạo tài khoản Business để có thể trải nghiệm Yumzy với nhiều ưu đãi đặc biệt.</p>
        </Col>
    );
};

export default RegisterIllustration;