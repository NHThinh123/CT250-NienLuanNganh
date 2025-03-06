// features/payment/components/PaymentIllustration.jsx
import React from "react";
import { Col } from "antd";
import payment from "../../../../assets/payment/payment.png";

const PaymentIllustration = () => {
    return (
        <Col xs={0} md={12} style={{ textAlign: "center", padding: "50px" }}>
            <img
                src={payment}
                alt="Illustration"
                style={{ maxWidth: "100%", height: "auto" }}
            />
            <h2>Thanh toán phí dịch vụ Yumzy</h2>
            <p>Hoàn tất thanh toán để trải nghiệm những ưu đãi hấp dẫn chỉ có ở của Yumzy.</p>
        </Col>
    );
};

export default PaymentIllustration;