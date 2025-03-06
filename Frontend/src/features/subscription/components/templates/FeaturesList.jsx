import React from "react";
import { Divider } from "antd";

const FeaturesList = () => {
    return (
        <div>
            <Divider orientation="left" orientationMargin="0">
                <span style={{ color: "#52c41a" }}>Tính năng bao gồm</span>
            </Divider>
            <ul style={{ paddingLeft: "20px", marginBottom: "20px" }}>
                <li>Quảng bá không giới hạn – Hiển thị nhà hàng/quán ăn của bạn trên nền tảng đánh giá ẩm thực hàng đầu.</li>
                <li>Tiếp cận khách hàng tiềm năng – Kết nối với thực khách đang tìm kiếm địa điểm ăn uống chất lượng.</li>
                <li>Tối ưu hóa đánh giá & thương hiệu – Thu hút đánh giá tích cực, nâng cao uy tín và độ tin cậy.</li>
                <li>Chiến dịch khuyến mãi & ưu đãi độc quyền – Hỗ trợ các chương trình giảm giá, voucher để thu hút khách hàng mới.</li>
            </ul>
        </div>
    );
};

export default FeaturesList;