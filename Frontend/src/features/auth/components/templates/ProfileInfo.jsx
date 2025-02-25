import { Descriptions, Button } from "antd";

const ProfileInfo = ({ user, onEdit }) => {
    return (
        <div>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và Tên">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                {/* <Descriptions.Item label="Ngày sinh">{user.dateOfBirth}</Descriptions.Item> */}
            </Descriptions>
            <Button type="primary" onClick={onEdit} style={{ marginTop: 16 }}>
                Chỉnh sửa
            </Button>
        </div>
    );
};

export default ProfileInfo;
