// features/chat/components/templates/MessageInput.jsx
import React, { useState, useContext } from "react";
import { Input, Button } from "antd";
import { AuthContext } from "../../../../contexts/auth.context";
import { BusinessContext } from "../../../../contexts/business.context";

const MessageInput = ({ sendMessage, userId, businessId }) => {
    const [content, setContent] = useState("");
    const { auth } = useContext(AuthContext);
    const { business } = useContext(BusinessContext);

    const isUserLoggedIn = auth?.isAuthenticated;
    const isBusinessLoggedIn = business?.isAuthenticated;

    const handleSend = () => {
        if (content.trim()) {
            if (isUserLoggedIn) {
                sendMessage({
                    senderId: userId,
                    receiverId: businessId,
                    senderModel: "User",
                    receiverModel: "Business",
                    content,
                });
            } else if (isBusinessLoggedIn) {
                sendMessage({
                    senderId: businessId,
                    receiverId: userId,
                    senderModel: "Business",
                    receiverModel: "User",
                    content,
                });
            }
            setContent("");
        }
    };

    return (
        <div style={{ display: "flex", marginTop: "10px" }}>
            <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onPressEnter={handleSend}
                placeholder="Nhập tin nhắn..."
                style={{ flex: 1, borderColor: "#0084ff" }}
            />
            <Button type="primary" onClick={handleSend} style={{ marginLeft: "10px", background: "#0084ff" }}>
                Gửi
            </Button>
        </div>
    );
};

export default MessageInput;