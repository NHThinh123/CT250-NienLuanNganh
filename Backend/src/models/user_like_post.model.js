const mongoose = require("mongoose");

const user_like_postSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const User_Like_Post = mongoose.model("User_Like_Post", user_like_postSchema);

module.exports = User_Like_Post;
