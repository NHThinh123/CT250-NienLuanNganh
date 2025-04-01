const { WebSocketServer } = require("ws");
const User = require("../models/user.model");
const Business = require("../models/business.model");
const Payment = require("../models/payment.model");

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
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ event: "userStats", data: stats }));
                }
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
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ event: "businessStats", data: stats }));
                }
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
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({ event: "paymentStats", data: stats }));
                }
            })
            .catch((error) => {
                console.error("Error sending initial payment stats:", error);
            });

        ws.on("message", (message) => {
            try {
                const data = JSON.parse(message.toString());



                if (data.businessId) {
                    clients.set(ws, data.businessId.toString());

                }


                if (data.id) {
                    clients.set(ws, data.id.toString());

                }

                // Xử lý tin nhắn chat
                if (data.event === "sendMessage") {
                    wss.clients.forEach((client) => {
                        if (client.readyState === client.OPEN) {
                            const clientId = clients.get(client);
                            const { senderId, receiverId } = data.data;
                            if (clientId === senderId.toString() || clientId === receiverId.toString()) {
                                client.send(JSON.stringify({
                                    event: "receiveMessage",
                                    data: data.data,
                                }));
                            }
                        }
                    });
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        });

        ws.on("close", () => {

            clients.delete(ws);
        });

        ws.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
    });

    wss.on("error", (error) => {
        console.error("WebSocketServer error:", error);
    });

    const notifyClients = (businessId) => {
        clients.forEach((trackedId, client) => {
            if (trackedId === businessId.toString() && client.readyState === client.OPEN) {
                client.send(
                    JSON.stringify({
                        event: "businessUpdated",
                        businessId,
                    })
                );
            }
        });
    };

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