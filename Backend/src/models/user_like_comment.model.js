const mongoose = require("mongoose");

const user_like_commentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true }
);

const User_Like_Comment = mongoose.model(
  "User_Like_Comment",
  user_like_commentSchema
);

module.exports = User_Like_Comment;
