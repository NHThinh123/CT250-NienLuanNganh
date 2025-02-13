require("dotenv").config();

const express = require("express");
const cors = require("cors");
const configViewEngine = require("./config/viewEngine");
const connection = require("./config/database");

const userRoutes = require("./routes/user.route");
const dishRoutes = require("./routes/dish.route");

const postRoutes = require("./routes/post.route");
const tagRoutes = require("./routes/tag.route");
const post_tagRoutes = require("./routes/post_tag.route");
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

//app.use("/api/user", userRoutes);

app.use("/api/dish", dishRoutes);

app.use("/api/users", userRoutes);

app.use("/api/tags", tagRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/post_tag", post_tagRoutes);

app.use("/api/user_like_post", user_like_postRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/user_like_comment", user_like_commentRoutes);

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
