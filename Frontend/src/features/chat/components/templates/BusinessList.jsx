// features/chat/components/BusinessList.js
import React from "react";
import { List, Avatar, Modal } from "antd";
import { useBusinessesForUser } from "../../hooks/useChat";

const BusinessList = ({ userId, onSelectBusiness, onClose }) => {
    const { data: businesses, isLoading, error } = useBusinessesForUser(userId);

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
                    dataSource={businesses}
                    renderItem={(business) => (
                        <List.Item
                            onClick={() => onSelectBusiness({
                                businessId: business._id,
                                businessName: business.business_name,
                                avatar: business.avatar,
                            })}
                            style={{ cursor: "pointer" }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={business.avatar} />}
                                title={business.business_name}
                                description={business.email}
                            />
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
};

export default BusinessList;