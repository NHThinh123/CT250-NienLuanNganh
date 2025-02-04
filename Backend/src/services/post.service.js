const mongoose = require("mongoose");
const Post = require("../models/post.model");
const AppError = require("../utils/AppError");

require("dotenv").config();

const getListPostService = async () => {
  let result = await Post.find().populate("userId", "username email");
  return result;
};

const getPostByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid post ID", 400);
  }

  let result = await Post.findById(id);

  if (!result) {
    throw new AppError("Post not found", 404);
  }

  return result;
};

const createPostService = async (userId, title, content) => {
  if (!userId || !title || !content) {
    throw new AppError("Missing required fields", 400);
  }

  let result = await Post.create({
    userId: userId,
    title: title,
    content: content,
  });
  return result;
};

const updatePostService = async (id, dataUpdate) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid post ID", 400);
  }

  let result = await Post.findOneAndUpdate(
    { _id: id, deleted: { $ne: true } }, // Chỉ cập nhật bài chưa bị xóa
    dataUpdate,
    { new: true }
  );

  if (!result) {
    throw new AppError("Post not found", 404);
  }

  return result;
};

const deletePostService = async (id) => {
  let post = await Post.findById(id);
  if (!post) {
    throw new AppError("Post not found", 404);
  }
  let result = post.delete(id);
  return result;
};

module.exports = {
  getListPostService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService,
};
