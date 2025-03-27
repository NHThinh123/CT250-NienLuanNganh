import { Descriptions, Button } from "antd";
import dayjs from "dayjs";

const ProfileInfo = ({ user, onEdit }) => {
    return (
        <div>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và Tên">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                    {user.dateOfBirth ? dayjs(user.dateOfBirth).format("YYYY-MM-DD") : "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Mật khẩu">********</Descriptions.Item>
            </Descriptions>
            <Button type="primary" onClick={onEdit} style={{ marginTop: 16 }}>
                Chỉnh sửa
            </Button>
        </div>
    );
};

export default ProfileInfo;