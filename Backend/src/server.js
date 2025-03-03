require("dotenv").config();
require("./services/paymentScheduler")

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
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

app.use("/api/user", userRoutes);

app.use("/api/dishes", dishRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/businesss", businessRoutes);
//app.use("/api/users", userRoutes);

app.use("/api/tags", tagRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user_like_post", user_like_postRoutes);
app.use("/api/user_like_comment", user_like_commentRoutes);

app.use("/api/post_tag", post_tagRoutes);

// Middleware xử lý lỗi
//app.use(errorHandler);
(async () => {
  try {
    await connection();

    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
