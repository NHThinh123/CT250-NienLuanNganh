import React from "react";
import { Divider } from "antd";
import { Typography } from "antd";

const { Paragraph } = Typography;

const BillingInfo = () => {
    return (
        <div>
            <Divider orientation="left" orientationMargin="0">
                <span style={{ color: "#52c41a" }}>Tần suất thanh toán</span>
            </Divider>
            <Paragraph style={{ color: "#888", marginBottom: "20px" }}>
                Để tránh lạm dụng, chúng tôi yêu cầu thông tin thanh toán trước. Quý khách hàng có thể cân nhắc để sử dụng gói cước phù hợp. Chúng tôi sẽ có thông báo khi gói cước sắp hết hạn để tránh làm ảnh hưởng đến trải nghiệm của quý khách hàng. Cảm ơn quý khách hàng đã tin tưởng và ủng hộ của chúng tôi. Yumzy xin chân thành cảm ơn.
            </Paragraph>
        </div>
    );
};

export default BillingInfo;