require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User_Like_Post = require("../models/user_like_post.model");
const User = require("../models/user.model"); // Thêm model User
const Business = require("../models/business.model"); // Thêm model Business

const likePostService = async (id, post_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(post_id)
  ) {
    throw new AppError("Invalid ID or post ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // Kiểm tra xem id thuộc về user hay business
  const user = await User.findById(objectId);
  const business = await Business.findById(objectId);

  if (!user && !business) {
    throw new AppError("ID does not belong to any user or business", 404);
  }

  // Tạo bản ghi trong user_like_posts với user_id hoặc business_id
  const likeData = {
    post_id,
    ...(user ? { user_id: objectId } : { business_id: objectId }),
  };

  // Kiểm tra xem đã like chưa để tránh trùng lặp
  const existingLike = await User_Like_Post.findOne(likeData);
  if (existingLike) {
    throw new AppError("Post already liked by this entity", 400);
  }

  let result = await User_Like_Post.create(likeData);
  return result;
};

const unlikePostService = async (id, post_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(post_id)
  ) {
    throw new AppError("Invalid ID or post ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // Kiểm tra xem id thuộc về user hay business
  const user = await User.findById(objectId);
  const business = await Business.findById(objectId);

  if (!user && !business) {
    throw new AppError("ID does not belong to any user or business", 404);
  }

  // Xóa bản ghi dựa trên user_id hoặc business_id
  const unlikeCondition = {
    post_id,
    $or: [{ user_id: objectId }, { business_id: objectId }],
  };

  let result = await User_Like_Post.deleteMany(unlikeCondition);
  if (result.deletedCount === 0) {
    throw new AppError("No like found to unlike", 404);
  }

  return result;
};

const getUserLikePostService = async (post_id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }
  let result = await User_Like_Post.find({ post_id })
    .populate("user_id", "name _id")
    .populate("business_id", "business_name _id"); // Thêm populate cho business
  return result.map((item) => ({
    id: item.user_id?._id || item.business_id?._id,
    name: item.user_id?.name || item.business_id?.business_name,
  }));
};

const getPostLikeByUserService = async (user_id) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new AppError("Invalid ID", 400);
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
