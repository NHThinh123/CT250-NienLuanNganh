import React, { useEffect, useRef, useContext, useState } from "react";
import { MessageList as RCEMessageList, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { AuthContext } from "../../../../contexts/auth.context";
import { BusinessContext } from "../../../../contexts/business.context";

// Tùy chỉnh CSS để giống Messenger hơn
const customStyles = `
  .chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 360px;
    border: 1px solid #fff;
    background: #fff; 
  }
  .rce-container-mlist {
    flex: 1; 
    overflow-y: auto; 
    padding: 10px;
    background: #fff !important; 
  }
  .rce-mbox {
    background: #f0f2f5 !important; 
    color: black !important;
    max-width: 70% !important;
    min-width: 50px !important;
    word-break: break-word !important; 
    white-space: pre-wrap !important; 
    border-radius: 18px !important;
    padding: 8px 12px !important; 
    margin-bottom: 2px !important; 
  }
  .rce-mbox-right {
    background: #0084ff !important; 
    color: white !important;
  }
  .rce-mbox-right .rce-mbox-time {
    display: none !important; 
  }
  .rce-mbox-left .rce-mbox-time {
    display: none !important;
  }
  .rce-mbox:hover .rce-mbox-time {
    display: block !important; 
    font-size: 10px !important;
    color: #888 !important;
  }
  .rce-mbox-right.rce-mbox--clear-notch {
    border-top-left-radius: 18px !important;
    border-bottom-left-radius: 18px !important;
  }
  .rce-mbox-left.rce-mbox--clear-notch {
    border-top-right-radius: 18px !important;
    border-bottom-right-radius: 18px !important;
  }
  .rce-mbox--clear-notch {
    margin-bottom: 2px !important; 
  }
  .rce-mbox:not(.rce-mbox--clear-notch) {
    margin-bottom: 10px !important; 
  }
  .rce-mbox-system {
    text-align: center !important;
    font-size: 12px !important;
    color: #888 !important;
    margin: 10px 0 !important;
  }
  .input-container {
    padding: 10px;
    border-top: 1px solid #e0e0e0;
    background: #fff;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  .rce-input {
    border: none !important;
    border-radius: 20px !important;
    background: #f0f2f5 !important;
    padding: 8px 12px !important;
  }
  .rce-button {
    background: #0084ff !important;
    color: white !important;
    border-radius: 20px !important;
    padding: 8px 16px !important;
  }
`;

const MessageList = ({ messages, userId, businessId, markAsRead, onSendMessage }) => {
    const { auth } = useContext(AuthContext);
    const { business } = useContext(BusinessContext);
    const messageRefs = useRef({});
    const chatContainerRef = useRef(null);

    const isUserLoggedIn = auth?.isAuthenticated;
    const isBusinessLoggedIn = business?.isAuthenticated;

    const currentUserId = isUserLoggedIn ? auth.user?.id : null;
    const currentBusinessId = isBusinessLoggedIn ? business.business?.id : null;

    // Tự động cuộn đến tin nhắn mới nhất
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Đánh dấu tin nhắn đã đọc khi hiển thị
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = entry.target.dataset.messageId;
                        const message = messages.find((msg) => msg._id === messageId);
                        if (message && message.senderId) { // Kiểm tra message.senderId
                            const senderId = typeof message.senderId === "object" ? message.senderId._id : message.senderId;
                            const currentId = isUserLoggedIn ? currentUserId : currentBusinessId;
                            if (!message.isRead && senderId !== currentId) {
                                markAsRead(messageId);
                            }
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        Object.values(messageRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            Object.values(messageRefs.current).forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [messages, markAsRead, currentUserId, currentBusinessId, isUserLoggedIn, isBusinessLoggedIn]);

    // Hàm kiểm tra xem có nên hiển thị thời gian giữa các tin nhắn không
    const shouldShowTimestamp = (currentMessage, prevMessage) => {
        if (!prevMessage) return true;
        const currentTime = new Date(currentMessage.createdAt).getTime();
        const prevTime = new Date(prevMessage.createdAt).getTime();
        return currentTime - prevTime > 30 * 60 * 1000;
    };

    // Chuyển đổi dữ liệu tin nhắn sang định dạng của react-chat-elements
    const formattedMessages = messages.reduce((acc, message, index) => {
        // Kiểm tra message.senderId trước khi truy cập
        if (!message.senderId) {
            console.error("Message missing senderId:", message);
            return acc; // Bỏ qua tin nhắn không có senderId
        }

        const senderId = typeof message.senderId === "object" && message.senderId?._id
            ? message.senderId._id
            : message.senderId;
        const currentId = isUserLoggedIn ? currentUserId : currentBusinessId;
        const isOwnMessage = senderId === currentId;

        // Xác định tin nhắn đầu tiên trong chuỗi để hiển thị avatar
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const isSameSender =
            prevMessage &&
            prevMessage.senderId &&
            (typeof prevMessage.senderId === "object"
                ? prevMessage.senderId._id
                : prevMessage.senderId) === senderId;
        const showAvatar = !isOwnMessage && !isSameSender;

        // Thêm thời gian nếu cần
        if (shouldShowTimestamp(message, prevMessage)) {
            acc.push({
                id: `timestamp-${message._id}`,
                type: "system",
                text: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                position: "center",
            });
        }

        acc.push({
            id: message._id,
            position: isOwnMessage ? "right" : "left",
            type: "text",
            text: message.content,
            date: new Date(message.createdAt),
            dateString: new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            notch: false, // Tắt dấu đánh dấu mặc định
            ref: (el) => (messageRefs.current[message._id] = el),
            data: { messageId: message._id },
        });

        return acc;
    }, []);

    return (
        <div className="chat-wrapper">
            <style>{customStyles}</style>
            <RCEMessageList
                referance={chatContainerRef}
                className="message-list"
                lockable={true}
                toBottomHeight={"90%"}
                dataSource={formattedMessages}
            />
        </div>
    );
};

export default MessageList;