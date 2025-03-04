import { Descriptions, Button } from "antd";

const ProfileBusinessInfo = ({ business, onEdit }) => {
    return (
        <div>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Tên doanh nghiệp">{business.business_name || "Chưa cập nhật"}</Descriptions.Item>
                <Descriptions.Item label="Email">{business.email || "Chưa cập nhật"}</Descriptions.Item>
                <Descriptions.Item label="Thông tin liên hệ">{business.contact_info || "Chưa cập nhật"}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{business.location || "Chưa cập nhật"}</Descriptions.Item>
                <Descriptions.Item label="Giờ mở cửa">{business.open_hours || "Chưa cập nhật"}</Descriptions.Item>
                <Descriptions.Item label="Giờ đóng cửa">{business.close_hours || "Chưa cập nhật"}</Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={onEdit} style={{ marginTop: 16 }}>
                Chỉnh sửa
            </Button>
        </div>
    );
};

export default ProfileBusinessInfo;
