
import { Divider } from "antd";
import { Check } from "lucide-react";

const FeaturesList = () => {
    return (
        <div>
            <Divider orientation="left" orientationMargin="0">
                <span style={{ color: "#52c41a" }}>Ưu Đãi</span>
            </Divider>
            <ul style={{ paddingLeft: "20px", marginBottom: "20px", listStyle: "none" }}>
                <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <Check color="#52c41a" strokeWidth={1.75} style={{ marginRight: "8px" }} />
                    Quảng bá không giới hạn – Hiển thị nhà hàng/quán ăn của bạn trên nền tảng đánh giá ẩm thực hàng đầu.
                </li>
                <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <Check color="#52c41a" strokeWidth={1.75} style={{ marginRight: "8px" }} />
                    Tiếp cận khách hàng tiềm năng – Kết nối với thực khách đang tìm kiếm địa điểm ăn uống chất lượng.
                </li>
                <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <Check color="#52c41a" strokeWidth={1.75} style={{ marginRight: "8px" }} />
                    Tối ưu hóa đánh giá & thương hiệu – Thu hút đánh giá tích cực, nâng cao uy tín và độ tin cậy.
                </li>
                <li style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <Check color="#52c41a" strokeWidth={1.75} style={{ marginRight: "8px" }} />
                    Chiến dịch khuyến mãi & ưu đãi độc quyền – Hỗ trợ các chương trình giảm giá, voucher để thu hút khách hàng mới.
                </li>
            </ul>
        </div>
    );
};

export default FeaturesList;