require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User_Like_Comment = require("../models/user_like_comment.model");

const likeCommentService = async (user_id, comment_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(user_id) ||
    !mongoose.Types.ObjectId.isValid(comment_id)
  ) {
    throw new AppError("Invalid user ID or comment ID", 400);
  }

  let result = await User_Like_Comment.create({ user_id, comment_id });
  return result;
};

const unlikeCommentService = async (user_id, comment_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(user_id) ||
    !mongoose.Types.ObjectId.isValid(comment_id)
  ) {
    throw new AppError("Invalid user ID or comment ID", 400);
  }
  let result = await User_Like_Comment.deleteMany({ user_id, comment_id });
  return result;
};

const getUserLikeCommentService = async (comment_id) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }
  let result = await User_Like_Comment.find({ comment_id }).populate(
    "user_id",
    "username _id"
  );
  return result.map((item) => item.user_id);
};

const getCommentLikeByUserService = async (user_id) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new AppError("Invalid comment ID", 400);
  }
  let result = await User_Like_Comment.find({ user_id }).populate("comment_id");
  return result.map((item) => item.comment_id);
};

module.exports = {
  likeCommentService,
  getUserLikeCommentService,
  getCommentLikeByUserService,
  unlikeCommentService,
};
