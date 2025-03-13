require("dotenv").config();
require("./services/paymentScheduler");

const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const configViewEngine = require("./config/viewEngine");
const connection = require("./config/database");

const userRoutes = require("./routes/user.route");
const dishRoutes = require("./routes/dish.route");
const businessRoutes = require("./routes/business.route");
const postRoutes = require("./routes/post.route");
const tagRoutes = require("./routes/tag.route");
const post_tagRoutes = require("./routes/post_tag.route");
const menuRoutes = require("./routes/menu.route");
const reviewRoutes = require("./routes/review.route");
const user_like_postRoutes = require("./routes/user_like_post.route");
const user_like_commentRoutes = require("./routes/user_like_comment.route");
const commentRoutes = require("./routes/comment.route");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 8888;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/businesss", businessRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user_like_post", user_like_postRoutes);
app.use("/api/user_like_comment", user_like_commentRoutes);
app.use("/api/post_tag", post_tagRoutes);

// Middleware xử lý lỗi
// app.use(errorHandler);

// Khởi động server HTTP
const server = app.listen(port, () => {
  console.log(`Backend Nodejs App listening on port ${port}`);
});

// Khởi tạo WebSocket Server
const wss = new WebSocketServer({ server });

// Danh sách các client kết nối
const clients = new Map();

wss.on("connection", (ws) => {

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.businessId) {
      clients.set(ws, data.businessId); // Lưu ID của business mà client theo dõi
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

// Xuất hàm notifyClients để sử dụng trong các route
app.set("notifyClients", notifyClients);

// Kết nối database và khởi động server
(async () => {
  try {
    await connection();
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();