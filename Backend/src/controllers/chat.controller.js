// controllers/chatController.js
const mongoose = require("mongoose");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Business = require("../models/business.model");

const sendMessage = async (req, res) => {
    const { senderId, receiverId, senderModel, receiverModel, content } = req.body;

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!senderId || !receiverId || !senderModel || !receiverModel || !content) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
        }

        const validModels = ["User", "Business"];
        if (!validModels.includes(senderModel) || !validModels.includes(receiverModel)) {
            return res.status(400).json({ message: "Model không hợp lệ!" });
        }

        // Tạo tin nhắn mới
        const message = new Message({
            senderId,
            receiverId,
            senderModel,
            receiverModel,
            content,
        });
        await message.save();

        // Gửi tin nhắn qua WebSocket
        const wss = req.app.get("wss"); // Lấy instance WebSocketServer từ app
        const clients = req.app.get("clients"); // Lấy map clients từ app
        const messageData = JSON.stringify({
            event: "receiveMessage",
            data: message,
        });

        clients.forEach((trackedId, client) => {
            if (
                (trackedId === senderId.toString() || trackedId === receiverId.toString()) &&
                client.readyState === client.OPEN
            ) {
                client.send(messageData);
            }
        });

        res.status(201).json({
            message: "Tin nhắn đã được gửi!",
            data: message,
        });
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server khi gửi tin nhắn!" });
    }
};

const getMessages = async (req, res) => {
    const { userId, businessId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: businessId, senderModel: "User", receiverModel: "Business" },
                { senderId: businessId, receiverId: userId, senderModel: "Business", receiverModel: "User" },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("senderId", "name business_name avatar")
            .populate("receiverId", "name business_name avatar");

        res.status(200).json({
            message: "Danh sách tin nhắn",
            data: messages,
        });
    } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server khi lấy tin nhắn!" });
    }
};

const markAsRead = async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await Message.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ message: "Tin nhắn không tồn tại!" });
        }

        res.status(200).json({
            message: "Tin nhắn đã được đánh dấu là đã đọc!",
            data: message,
        });
    } catch (error) {
        console.error("Lỗi khi đánh dấu tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server khi đánh dấu tin nhắn!" });
    }
};
const getBusinessesForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "userId không hợp lệ!" });
        }

        // Tìm tất cả tin nhắn mà userId là sender hoặc receiver
        const messages = await Message.find({
            $or: [
                { senderId: userId, senderModel: "User" },
                { receiverId: userId, receiverModel: "User" },
            ],
        }).populate("senderId receiverId");

        // Lấy danh sách businessId duy nhất từ các tin nhắn
        const businessIds = [
            ...new Set(
                messages
                    .map((msg) =>
                        msg.senderModel === "Business" ? msg.senderId._id : msg.receiverId._id
                    )
                    .filter((id) => id)
            ),
        ];

        // Lấy thông tin chi tiết của các Business
        const businesses = await Business.find({ _id: { $in: businessIds } });

        res.status(200).json({ message: "Danh sách Business", data: businesses });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách Business:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};
const getUsersForBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(businessId)) {
            return res.status(400).json({ message: "businessId không hợp lệ!" });
        }

        // Tìm tất cả tin nhắn mà businessId là sender hoặc receiver
        const messages = await Message.find({
            $or: [
                { senderId: businessId, senderModel: "Business" },
                { receiverId: businessId, receiverModel: "Business" },
            ],
        }).populate("senderId receiverId");

        // Lấy danh sách userId duy nhất từ các tin nhắn
        const userIds = [
            ...new Set(
                messages
                    .map((msg) =>
                        msg.senderModel === "User" ? msg.senderId._id : msg.receiverId._id
                    )
                    .filter((id) => id)
            ),
        ];

        // Lấy thông tin chi tiết của các User
        const users = await User.find({ _id: { $in: userIds } });

        res.status(200).json({ message: "Danh sách User", data: users });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách User:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
};

module.exports = { sendMessage, getMessages, markAsRead, getBusinessesForUser, getUsersForBusiness };