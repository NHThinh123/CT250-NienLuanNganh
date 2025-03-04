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
                Để tránh lạm dụng, chúng tôi yêu cầu thông tin thanh toán trước. Bạn sẽ được dùng thử miễn phí 30 ngày, sau đó tự động chuyển sang gói trả phí. Bạn có thể hủy bất kỳ lúc nào từ cài đặt trước khi thời gian dùng thử kết thúc.
            </Paragraph>
        </div>
    );
};

export default BillingInfo;