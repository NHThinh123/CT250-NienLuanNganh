require("dotenv").config();
require("./services/paymentScheduler");

const express = require("express");
const cors = require("cors");
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
const adminRoutes = require("./routes/admin.route");
const assetReviewsRoutes = require("./routes/asset_reviews.route");
const initializeWebSocket = require("./websocket/websocket");

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
app.use("/api/admin", adminRoutes);
app.use("/api/asset_reviews", assetReviewsRoutes);

// Middleware xử lý lỗi
// app.use(errorHandler);

// Khởi động server HTTP
const server = app.listen(port, () => {
  console.log(`Backend Nodejs App listening on port ${port}`);
});

// Khởi tạo WebSocket Server
const {
  notifyClients,
  notifyUserStats,
  notifyBusinessStats,
  notifyPaymentStats,
} = initializeWebSocket(server);

// Xuất các hàm để sử dụng trong các route
app.set("notifyClients", notifyClients);
app.set("notifyUserStats", notifyUserStats);
app.set("notifyBusinessStats", notifyBusinessStats);
app.set("notifyPaymentStats", notifyPaymentStats);
// Kết nối database và khởi động server
(async () => {
  try {
    await connection();
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
