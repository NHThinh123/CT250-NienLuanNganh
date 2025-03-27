import React from "react";
import { Card, Spin, Avatar, Space, message, Button } from "antd";
import MessageList from "../../features/chat/components/templates/MessageList";
import MessageInput from "../../features/chat/components/templates/Messageinput";
import useChat from "../../features/chat/hooks/useChat";

const ChatWindow = ({ userId, businessId, businessName, userName, avatar, onClose, onNewMessage, style }) => {
    const { messages, isLoading, error, sendMessage, markAsRead } = useChat(
        userId,
        businessId,
        (newMessage) => {
            message.info(`Tin nhắn mới từ ${businessId ? businessName : userName}: ${newMessage.content}`);
            if (onNewMessage) {
                onNewMessage(newMessage);
            }
        }
    );

    // Danh sách các tin nhắn mẫu
    const chatTemplates = [
        "Xin chào, tôi muốn trao đổi với quán.",
        "Quán có chương trình khuyến mãi nào không?",
        "Tôi có thể đặt bàn trước không?",
    ];

    // Hàm xử lý khi người dùng chọn một tin nhắn mẫu
    const handleTemplateSelect = (template) => {
        // Trong trường hợp này, người dùng (User) gửi tin nhắn cho doanh nghiệp (Business)
        sendMessage({
            senderId: userId,
            receiverId: businessId,
            senderModel: "User",
            receiverModel: "Business",
            content: template,
        });
    };

    return (
        <Card
            title={
                <Space>
                    {businessId ? (
                        <>
                            {avatar && <Avatar src={avatar} />}
                            <span>{businessName || "Doanh nghiệp không tên"}</span>
                        </>
                    ) : userId ? (
                        <>
                            {avatar && <Avatar src={avatar} />}
                            <span>{userName || "Người dùng không tên"}</span>
                        </>
                    ) : (
                        <span>Không xác định</span>
                    )}
                </Space>
            }
            style={{
                width: 400,
                height: 500,
                position: "fixed",
                zIndex: 1000,
                boxShadow: "0px 5px 20px rgba(0,0,0,0.1)",
                ...style,
            }}
            extra={<a onClick={onClose}>Đóng</a>}
        >
            {isLoading ? (
                <Spin style={{ display: "block", textAlign: "center" }} />
            ) : error ? (
                <div style={{ color: "red", textAlign: "center" }}>
                    Lỗi: {error.message || "Không thể tải tin nhắn!"}
                </div>
            ) : messages.length === 0 ? (
                // Hiển thị danh sách tin nhắn mẫu nếu không có tin nhắn nào
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <p>Chào mừng bạn đến với đoạn chat! Chọn một tin nhắn để bắt đầu:</p>
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {chatTemplates.map((template, index) => (
                            <Button
                                key={index}
                                type="default"
                                block
                                onClick={() => handleTemplateSelect(template)}
                                style={{
                                    marginBottom: "10px",
                                    borderRadius: "5px",
                                    textAlign: "left",
                                    padding: "10px",
                                }}
                            >
                                {template}
                            </Button>
                        ))}
                    </Space>
                </div>
            ) : (
                <>
                    <MessageList messages={messages} userId={userId} businessId={businessId} markAsRead={markAsRead} />
                    <MessageInput sendMessage={sendMessage} userId={userId} businessId={businessId} />
                </>
            )}
        </Card>
    );
};

export default ChatWindow;