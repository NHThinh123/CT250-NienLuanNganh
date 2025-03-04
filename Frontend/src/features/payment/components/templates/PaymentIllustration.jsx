// features/payment/components/PaymentIllustration.jsx
import React from "react";
import { Col } from "antd";

const PaymentIllustration = () => {
    return (
        <Col xs={0} md={12} style={{ textAlign: "center", padding: "50px" }}>
            <img
                src="https://via.placeholder.com/300x400.png?text=Payment+Illustration"
                alt="Illustration"
                style={{ maxWidth: "100%", height: "auto" }}
            />
            <h2>Thanh toán để kích hoạt tài khoản</h2>
            <p>Hoàn tất thanh toán để bắt đầu sử dụng dịch vụ của Yumzy.</p>
        </Col>
    );
};

export default PaymentIllustration;