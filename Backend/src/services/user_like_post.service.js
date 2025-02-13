require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User_Like_Post = require("../models/user_like_post.model");

const likePostService = async (user_id, post_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(user_id) ||
    !mongoose.Types.ObjectId.isValid(post_id)
  ) {
    throw new AppError("Invalid user ID or post ID", 400);
  }

  let result = await User_Like_Post.create({ user_id, post_id });
  return result;
};

const unlikePostService = async (user_id, post_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(user_id) ||
    !mongoose.Types.ObjectId.isValid(post_id)
  ) {
    throw new AppError("Invalid user ID or post ID", 400);
  }
  let result = await User_Like_Post.deleteMany({ user_id, post_id });
  return result;
};

const getUserLikePostService = async (post_id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }
  let result = await User_Like_Post.find({ post_id }).populate(
    "user_id",
    "username _id"
  );
  return result.map((item) => item.user_id);
};

const getPostLikeByUserService = async (user_id) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new AppError("Invalid post ID", 400);
  }
  let result = await User_Like_Post.find({ user_id }).populate("post_id");
  return result.map((item) => item.post_id);
};

module.exports = {
  likePostService,
  getUserLikePostService,
  getPostLikeByUserService,
  unlikePostService,
};
