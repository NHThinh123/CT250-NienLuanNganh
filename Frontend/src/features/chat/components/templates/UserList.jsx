
import React from "react";
import { List, Avatar, Modal } from "antd";
import { useUsersForBusiness } from "../../hooks/useChat";

const UserList = ({ businessId, onSelectUser, onClose }) => {
    const { data: users, isLoading, error } = useUsersForBusiness(businessId);

    return (
        <Modal
            title="Danh sách tin nhắn"
            open={true}
            onCancel={onClose}
            footer={null}
            style={{ zIndex: 1000 }}
        >
            {isLoading ? (
                <div>Đang tải...</div>
            ) : error ? (
                <div style={{ color: "red" }}>Lỗi: {error.message}</div>
            ) : (
                <List
                    dataSource={users}
                    renderItem={(user) => (
                        <List.Item
                            onClick={() =>
                                onSelectUser({
                                    userId: user._id,
                                    userName: user.name,
                                    avatar: user.avatar,
                                })
                            }
                            style={{ cursor: "pointer" }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={user.avatar} />}
                                title={user.name}
                                description={user.email}
                            />
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
};

export default UserList;