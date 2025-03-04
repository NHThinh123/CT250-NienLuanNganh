require("dotenv").config();

const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const User_Like_Comment = require("../models/user_like_comment.model");
const User = require("../models/user.model"); // Thêm model User
const Business = require("../models/business.model"); // Thêm model Business

const likeCommentService = async (id, comment_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(comment_id)
  ) {
    throw new AppError("Invalid ID or comment ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // Kiểm tra xem id thuộc về user hay business
  const user = await User.findById(objectId);
  const business = await Business.findById(objectId);

  if (!user && !business) {
    throw new AppError("ID does not belong to any user or business", 404);
  }

  // Tạo bản ghi với user_id hoặc business_id
  const likeData = {
    comment_id,
    ...(user ? { user_id: objectId } : { business_id: objectId }),
  };

  // Kiểm tra xem đã like chưa để tránh trùng lặp
  const existingLike = await User_Like_Comment.findOne(likeData);
  if (existingLike) {
    throw new AppError("Comment already liked by this entity", 400);
  }

  let result = await User_Like_Comment.create(likeData);
  return result;
};

const unlikeCommentService = async (id, comment_id) => {
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(comment_id)
  ) {
    throw new AppError("Invalid ID or comment ID", 400);
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
    comment_id,
    $or: [{ user_id: objectId }, { business_id: objectId }],
  };

  let result = await User_Like_Comment.deleteMany(unlikeCondition);
  if (result.deletedCount === 0) {
    throw new AppError("No like found to unlike", 404);
  }

  return result;
};

const getUserLikeCommentService = async (comment_id) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  let result = await User_Like_Comment.find({ comment_id })
    .populate("user_id", "name _id")
    .populate("business_id", "business_name _id");

  return result.map((item) => ({
    id: item.user_id?._id || item.business_id?._id,
    name: item.user_id?.name || item.business_id?.business_name,
  }));
};

const getCommentLikeByUserService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID", 400);
  }

  const objectId = new mongoose.Types.ObjectId(id);

  let result = await User_Like_Comment.find({
    $or: [{ user_id: objectId }, { business_id: objectId }],
  }).populate("comment_id");

  return result.map((item) => item.comment_id);
};

module.exports = {
  likeCommentService,
  getUserLikeCommentService,
  getCommentLikeByUserService,
  unlikeCommentService,
};
