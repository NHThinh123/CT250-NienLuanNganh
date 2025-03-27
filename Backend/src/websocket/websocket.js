// websocket/websocket.js
const { WebSocketServer } = require("ws");
const User = require("../models/user.model");
const Business = require("../models/business.model");
const Payment = require("../models/payment.model");

// Hàm khởi tạo WebSocket
const initializeWebSocket = (server) => {
    const wss = new WebSocketServer({ server });
    const clients = new Map();

    wss.on("connection", (ws) => {
        // Gửi dữ liệu user ban đầu khi kết nối
        User.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ])
            .then((stats) => {
                ws.send(JSON.stringify({ event: "userStats", data: stats }));
            })
            .catch((error) => {
                console.error("Error sending initial user stats:", error);
            });

        // Gửi dữ liệu business ban đầu khi kết nối
        Business.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ])
            .then((stats) => {
                ws.send(JSON.stringify({ event: "businessStats", data: stats }));
            })
            .catch((error) => {
                console.error("Error sending initial business stats:", error);
            });

        // Gửi dữ liệu payment ban đầu khi kết nối
        Payment.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
                    totalAmount: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ])
            .then((stats) => {
                ws.send(JSON.stringify({ event: "paymentStats", data: stats }));
            })
            .catch((error) => {
                console.error("Error sending initial payment stats:", error);
            });

        ws.on("message", (message) => {
            const data = JSON.parse(message);
            if (data.businessId) {
                clients.set(ws, data.businessId); // Lưu ID của business mà client theo dõi
            }
            // Thêm logic cho chat: Lưu ID của user hoặc business
            if (data.id) {
                clients.set(ws, data.id.toString());
            }
        });

        ws.on("close", () => {
            clients.delete(ws);
        });
    });

    // Hàm gửi thông báo tới các client theo dõi businessId
    const notifyClients = (businessId) => {
        clients.forEach((trackedId, client) => {
            if (trackedId === businessId && client.readyState === client.OPEN) {
                client.send(
                    JSON.stringify({
                        event: "businessUpdated",
                        businessId,
                    })
                );
            }
        });
    };

    // Hàm gửi số lượng user tới tất cả client
    const notifyUserStats = async () => {
        try {
            const stats = await User.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ event: "userStats", data: stats }));
                }
            });
        } catch (error) {
            console.error("Error notifying user stats:", error);
        }
    };

    // Hàm gửi số lượng business tới tất cả client
    const notifyBusinessStats = async () => {
        try {
            const stats = await Business.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ event: "businessStats", data: stats }));
                }
            });
        } catch (error) {
            console.error("Error notifying business stats:", error);
        }
    };

    // Hàm gửi số tiền thanh toán tới tất cả client
    const notifyPaymentStats = async () => {
        try {
            const stats = await Payment.aggregate([
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" } },
                        totalAmount: { $sum: "$amount" },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ event: "paymentStats", data: stats }));
                }
            });
        } catch (error) {
            console.error("Error notifying payment stats:", error);
        }
    };


    setInterval(() => {
        notifyUserStats();
        notifyBusinessStats();
        notifyPaymentStats();
    }, 60000);

    return {
        wss,
        clients,
        notifyClients,
        notifyUserStats,
        notifyBusinessStats,
        notifyPaymentStats,
    };
};

module.exports = initializeWebSocket;