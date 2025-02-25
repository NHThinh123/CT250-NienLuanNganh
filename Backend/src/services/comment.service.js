const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const Comment = require("../models/comment.model");
require("dotenv").config();

const createCommentService = async (
  user_id,
  post_id,
  parent_comment_id,
  comment_content
) => {
  if (!user_id || !post_id || !comment_content) {
    throw new AppError("Missing required fields", 400);
  }
  let result = await Comment.create({
    user_id: user_id,
    post_id: post_id,
    parent_comment_id: parent_comment_id,
    comment_content: comment_content,
  });
  return result;
};

const getListCommentByPostService = async (post_id) => {
  if (!mongoose.Types.ObjectId.isValid(post_id)) {
    throw new AppError("Invalid post ID", 400);
  }
  // Lấy tất cả comment của bài post
  let comments = await Comment.find({ post_id: post_id })
    .populate("user_id", "name _id avatar")
    .lean();

  // Tạo danh sách comment cha
  let parentComments = comments.filter((comment) => !comment.parent_comment_id);

  // Đếm số lượng reply của từng comment cha
  let result = parentComments.map((comment) => ({
    ...comment,
    replyCount: comments.filter(
      (c) => String(c.parent_comment_id) === String(comment._id)
    ).length,
  }));

  return result;
};

const getCommentByIdService = async (comment_id) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  let result = await Comment.findById(comment_id).populate(
    "user_id",
    "name _id"
  );

  if (!result) {
    throw new AppError("Comment not found", 404);
  }
  let replies = await Comment.find({ parent_comment_id: comment_id }).populate(
    "user_id",
    "name _id"
  );
  return { ...result._doc, replies };
};

const getReplyByCommentService = async (comment_id) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }
  let result = await Comment.find({ parent_comment_id: comment_id }).populate(
    "user_id",
    "name _id"
  );
  return result;
};

const updateCommentService = async (comment_id, dataUpdate) => {
  if (!mongoose.Types.ObjectId.isValid(comment_id)) {
    throw new AppError("Invalid comment ID", 400);
  }

  let result = await Comment.findOneAndUpdate({ _id: comment_id }, dataUpdate, {
    new: true,
  });

  if (!result) {
    throw new AppError("Comment not found", 404);
  }

  return result;
};

const deleteCommentService = async (comment_id) => {
  let comment = await Comment.findById(comment_id);
  if (!comment) {
    throw new AppError("Comment not found", 404);
  }
  let result = comment.delete();
  return result;
};

module.exports = {
  createCommentService,
  getListCommentByPostService,
  getCommentByIdService,
  getReplyByCommentService,
  updateCommentService,
  deleteCommentService,
};
